// Run with: node --test next-app/app/automation-intelligence/edge-api.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEdgeRequestBody,
  buildForwardedHeaders,
  buildPageUrl,
  callEdgeApi,
  classifyIp,
  parseAgentLabel,
  resolveBaseUrl,
  resolveClientIp,
} from "./edge-api.ts";

const headersOf = (obj) => (name) => obj[name] ?? null;

test("headers are forwarded in the received order", () => {
  const out = buildForwardedHeaders([
    ["host", "a.com"],
    ["user-agent", "ua"],
    ["accept", "*/*"],
  ]);
  assert.deepEqual(out.map((h) => h.name), ["host", "user-agent", "accept"]);
  assert.equal(out[1].value, "ua");
});

test("repeated headers stay as separate entries", () => {
  const out = buildForwardedHeaders([["x-a", "1"], ["x-a", "2"]]);
  assert.equal(out.length, 2);
});

test("credential headers are present but blank, and secrets never leak", () => {
  const out = buildForwardedHeaders([
    ["cookie", "session=SECRET"],
    ["Authorization", "Bearer SECRET"],
    ["x-api-key", "SECRET"],
    ["proxy-authorization", "SECRET"],
    ["proxy-authenticate", "SECRET"],
    ["accept", "*/*"],
  ]);
  assert.equal(out.length, 6);
  for (const h of out.slice(0, 5)) assert.equal(h.value, "");
  assert.equal(out[5].value, "*/*");
  assert.ok(!JSON.stringify(out).includes("SECRET"));
});

test("IPv4 goes to ipv4_address, IPv6 to ipv6_address only", () => {
  assert.deepEqual(classifyIp("34.162.244.71"), { ipv4_address: "34.162.244.71" });
  assert.deepEqual(classifyIp("2001:db8::1"), { ipv6_address: "2001:db8::1" });
  assert.deepEqual(classifyIp("[2001:db8::1]:443"), { ipv6_address: "2001:db8::1" });
  assert.deepEqual(classifyIp("1.2.3.4:5555"), { ipv4_address: "1.2.3.4" });
});

test("IPv4-mapped IPv6 is sent as ipv6_address", () => {
  assert.deepEqual(classifyIp("::ffff:34.162.244.71"), {
    ipv6_address: "::ffff:34.162.244.71",
  });
});

test("garbage is not an IP", () => {
  assert.equal(classifyIp("not-an-ip"), null);
  assert.equal(classifyIp(""), null);
});

test("client IP resolution prefers platform header, then first x-forwarded-for, reports source", () => {
  assert.deepEqual(
    resolveClientIp(headersOf({ "do-connecting-ip": "5.5.5.5", "x-forwarded-for": "6.6.6.6" })),
    { ip: { ipv4_address: "5.5.5.5" }, source: "do-connecting-ip" }
  );
  assert.deepEqual(
    resolveClientIp(headersOf({ "x-forwarded-for": "6.6.6.6, 10.0.0.1" })),
    { ip: { ipv4_address: "6.6.6.6" }, source: "x-forwarded-for" }
  );
  assert.equal(resolveClientIp(headersOf({})), null);
  assert.equal(resolveClientIp(headersOf({ "x-forwarded-for": "junk" })), null);
});

test("agent label: valid accepted, invalid ignored", () => {
  assert.equal(parseAgentLabel("claude-browser"), "claude-browser");
  assert.equal(parseAgentLabel("a.b_c-1"), "a.b_c-1");
  assert.equal(parseAgentLabel("<script>"), undefined);
  assert.equal(parseAgentLabel("with space"), undefined);
  assert.equal(parseAgentLabel("x".repeat(65)), undefined);
  assert.equal(parseAgentLabel("x".repeat(64)), "x".repeat(64));
  assert.equal(parseAgentLabel(["a", "b"]), undefined);
  assert.equal(parseAgentLabel(undefined), undefined);
  assert.equal(parseAgentLabel(""), undefined);
});

test("region mapping", () => {
  assert.equal(resolveBaseUrl("eu"), "https://eu.api.fpjs.io");
  assert.equal(resolveBaseUrl("AP"), "https://ap.api.fpjs.io");
  assert.equal(resolveBaseUrl("global"), "https://api.fpjs.io");
  assert.equal(resolveBaseUrl(undefined), "https://api.fpjs.io");
  assert.equal(resolveBaseUrl("mars"), "https://api.fpjs.io");
});

test("page URL is absolute, has no fragment, and keeps the query", () => {
  const url = buildPageUrl(
    headersOf({ host: "experiments.example.com", "x-forwarded-proto": "https" }),
    { agent: "x", foo: ["1", "2"] }
  );
  assert.equal(url, "https://experiments.example.com/automation-intelligence?agent=x&foo=1&foo=2");
  assert.ok(!url.includes("#"));
  assert.equal(
    buildPageUrl(headersOf({ host: "localhost:3000" }), {}),
    "http://localhost:3000/automation-intelligence"
  );
});

test("request body: tags and linked_id, no unknown fields", () => {
  const body = buildEdgeRequestBody({
    headers: [["host", "h"]],
    method: "GET",
    url: "https://h/automation-intelligence",
    ip: { ipv4_address: "1.2.3.4" },
    linkedId: "id-1",
    agentLabel: "claude-browser",
  });
  assert.deepEqual(Object.keys(body).sort(), [
    "headers", "ipv4_address", "linked_id", "method", "tags", "url",
  ]);
  assert.deepEqual(body.tags, { page: "/automation-intelligence", agent: "claude-browser" });
  const noLabel = buildEdgeRequestBody({
    headers: [], method: "GET", url: "https://h/x", ip: { ipv6_address: "::1" }, linkedId: "i",
  });
  assert.equal("agent" in noLabel.tags, false);
  assert.equal("ipv4_address" in noLabel, false);
});

const body = { headers: [{ name: "host", value: "h" }], method: "GET", url: "https://h/x", ipv4_address: "1.2.3.4" };

test("missing key: no API call", async () => {
  let called = false;
  const r = await callEdgeApi({
    secretKey: undefined, region: "eu", body,
    fetchImpl: async () => { called = true; return new Response("{}"); },
  });
  assert.equal(r.kind, "skipped");
  assert.equal(r.reason, "missing_secret_key");
  assert.equal(called, false);
});

test("calls the regional endpoint with Bearer auth", async () => {
  let seen;
  const r = await callEdgeApi({
    secretKey: "k", region: "eu", body,
    fetchImpl: async (url, init) => {
      seen = { url, init };
      return new Response(JSON.stringify({ event_id: "1.a", timestamp: 1, ip_info: {} }), { status: 200 });
    },
  });
  assert.equal(seen.url, "https://eu.api.fpjs.io/v4/edge");
  assert.equal(seen.init.method, "POST");
  assert.equal(seen.init.headers.Authorization, "Bearer k");
  assert.equal(r.kind, "ok");
  assert.equal(r.response.event_id, "1.a");
});

test("API error 429 surfaces status and code", async () => {
  const r = await callEdgeApi({
    secretKey: "k", region: undefined, body,
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: { code: "too_many_requests", message: "slow down" } }), { status: 429 }),
  });
  assert.equal(r.kind, "error");
  assert.equal(r.status, 429);
  assert.equal(r.code, "too_many_requests");
});

test("network failure and invalid JSON become error results, not throws", async () => {
  const net = await callEdgeApi({ secretKey: "k", region: "eu", body, fetchImpl: async () => { throw new Error("boom"); } });
  assert.equal(net.kind, "error");
  const bad = await callEdgeApi({ secretKey: "k", region: "eu", body, fetchImpl: async () => new Response("<html>", { status: 502 }) });
  assert.equal(bad.kind, "error");
  assert.equal(bad.status, 502);
});
