// Run with: node --test next-app/app/automation-intelligence/server-api.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { getEventDetail } from "./server-api.ts";

test("missing key: no API call, config error reported", async () => {
  let called = false;
  const r = await getEventDetail({
    eventId: "evt-1",
    secretKey: undefined,
    region: "eu",
    fetchImpl: async () => { called = true; return new Response("{}"); },
  });
  assert.equal(r.kind, "skipped");
  assert.equal(r.reason, "missing_secret_key");
  assert.equal(called, false);
});

test("missing or unrecognized region: no API call, config error reported", async () => {
  for (const region of [undefined, "", "mars"]) {
    let called = false;
    const r = await getEventDetail({
      eventId: "evt-1",
      secretKey: "k",
      region,
      fetchImpl: async () => { called = true; return new Response("{}"); },
    });
    assert.equal(r.kind, "skipped");
    assert.equal(r.reason, "invalid_region");
    assert.equal(called, false);
  }
});

test("calls GET /events/{eventId} on the regional endpoint with Auth-API-Key auth", async () => {
  let seen;
  const r = await getEventDetail({
    eventId: "evt-1",
    secretKey: "k",
    region: "eu",
    fetchImpl: async (url, init) => {
      seen = { url, init };
      return new Response(JSON.stringify({ products: {} }), { status: 200 });
    },
  });
  assert.equal(seen.url, "https://eu.api.fpjs.io/events/evt-1");
  assert.equal(seen.init.method, "GET");
  assert.equal(seen.init.headers["Auth-API-Key"], "k");
  assert.equal(r.kind, "ok");
  assert.deepEqual(r.event, { products: {} });
});

test("secret key never appears in a successful or error result", async () => {
  const ok = await getEventDetail({
    eventId: "evt-1", secretKey: "super-secret", region: "eu",
    fetchImpl: async () => new Response(JSON.stringify({ products: {} }), { status: 200 }),
  });
  assert.equal(JSON.stringify(ok).includes("super-secret"), false);

  const err = await getEventDetail({
    eventId: "evt-1", secretKey: "super-secret", region: "eu",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: { code: "not_found", message: "no such event" } }), { status: 404 }),
  });
  assert.equal(JSON.stringify(err).includes("super-secret"), false);
});

test("event not found surfaces status and code", async () => {
  const r = await getEventDetail({
    eventId: "missing", secretKey: "k", region: "global",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: { code: "request_not_found", message: "no such event" } }), { status: 404 }),
  });
  assert.equal(r.kind, "error");
  assert.equal(r.status, 404);
  assert.equal(r.code, "request_not_found");
});

test("network failure and invalid JSON become error results, not throws", async () => {
  const net = await getEventDetail({
    eventId: "evt-1", secretKey: "k", region: "eu",
    fetchImpl: async () => { throw new Error("boom"); },
  });
  assert.equal(net.kind, "error");

  const bad = await getEventDetail({
    eventId: "evt-1", secretKey: "k", region: "eu",
    fetchImpl: async () => new Response("<html>", { status: 502 }),
  });
  assert.equal(bad.kind, "error");
  assert.equal(bad.status, 502);
});
