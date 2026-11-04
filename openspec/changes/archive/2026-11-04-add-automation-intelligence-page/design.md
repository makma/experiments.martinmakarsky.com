# Design

## Context

- `next-app` is a Next.js 16 app (App Router under `app/`, legacy `pages/`), running as a Node service on Digital Ocean App Platform. See proposal.md for motivation.
- Server routes in this repo read secrets from `process.env` directly (e.g. `FINGERPRINT_SECRET_API_KEY` in `app/delete-by-visitorId/delete/route.ts`). `.env.local` already defines `FINGERPRINT_SECRET_API_KEY` and `FINGERPRINT_REGION`, so no new env vars are needed.
- API contract (from docs.fingerprint.com): `POST {base}/v4/edge`, `Authorization: Bearer <secret>`, JSON body `{headers[{name,value}], method, url, ipv4_address|ipv6_address, linked_id?, tags?}`, `additionalProperties: false`. Response: `event_id`, `timestamp`, `source: "edge"`, `ip_info`, `proxy*`, `vpn*`, and `bot_info` only when a bot is detected.
- Existing tests in `tests/` are Playwright specs that hit a base URL; `playwright.config.ts` has no `webServer`.

## Goals / Non-Goals

**Goals:**
- One page that shows, per visit, exactly what the API says about that request, readable by humans and by non-JS agents.
- Follow the API contract directly so the page also serves as a reference integration.

**Non-Goals:**
- Event history, search or analytics (use the Fingerprint dashboard).
- Using `@fingerprint/node-sdk` or any generated client.
- Acting on the result (blocking, redirecting, rate limiting).
- Making the request shape perfectly byte-identical to what the client sent (see Risks).

## Decisions

**1. Server Component, dynamic, calls the API during render.**
`app/automation-intelligence/page.tsx` is an async Server Component with `export const dynamic = "force-dynamic"`. It reads `headers()` and `searchParams`, calls a helper, and renders the result as HTML. Agents that do not run JavaScript still see the outcome, and nothing is analyzed in the browser.
*Alternatives:* a client page calling an API route (analyzes the route's request, not the page visit, and needs JS); middleware/proxy plus a header handoff (extra moving parts for no gain).

**2. Plain `fetch` against the HTTP contract, in a small helper next to the page.**
`app/automation-intelligence/edge-api.ts` exports a function that builds the payload, calls the API, and returns a discriminated result (`ok` with response, or `error` with status/code/message/reason). It has no dependency on the Fingerprint SDKs. Types for the response are hand-written from the contract, covering only fields we render plus the raw JSON.
*Alternative:* the Node SDK. Rejected per project decision.

**3. Header forwarding from `next/headers`.**
Headers are forwarded in the order `headers()` yields them. Names arrive lowercased because the Node HTTP layer normalizes them; the docs call order/capitalization "recommended, not required". Credential headers in the list from the spec are kept with `""` as value. The helper never logs or echoes forwarded header values.
*Alternative:* a custom server to read `req.rawHeaders` for exact casing. Rejected: it would replace the standard Next start command on Digital Ocean for marginal benefit.

**4. Client IP and URL derivation.**
IP: first non-empty of the platform client-IP header, then the first entry of `x-forwarded-for`. The exact platform header on Digital Ocean App Platform is not assumed: the page displays which header supplied the IP (`#ai-ip-source`). Confirmed on the live deploy at `experiments.martinmakarsky.com/automation-intelligence` (task 4.1): Digital Ocean App Platform sets `do-connecting-ip`, which is the header actually used. The user pushes to `main` and Digital Ocean builds automatically. IPv4 goes to `ipv4_address`; IPv6 (including IPv4-mapped) to `ipv6_address`. If none can be derived, skip the API call and show why.
URL: `x-forwarded-proto` (default `https`) + `host` header + request path and query, no fragment.

**5. Configuration.**
`FINGERPRINT_SECRET_API_KEY` and `FINGERPRINT_REGION` (`global` | `eu` | `ap`, case-insensitive, trimmed, mapped to `api.fpjs.io`, `eu.api.fpjs.io`, `ap.api.fpjs.io`). A missing or unrecognized region is a configuration error shown on the page, with no API call: silently defaulting to global makes a workspace in another region fail with a misleading `secret_api_key_not_found` (observed on the first deploy, where the region variable was unset). Missing key renders a config error and skips the call. The base URL used is displayed with every result or API error.

**6. Labeling.**
`linked_id = crypto.randomUUID()`. `?agent=` is validated against `^[A-Za-z0-9._-]{1,64}$`; sent as `tags: { agent, page: "/automation-intelligence" }`; invalid values are dropped silently. Both are displayed so a run can be located in the dashboard.

**7. Presentation.**
Stable element ids for tests: `#ai-event-id`, `#ai-linked-id`, `#ai-agent-label`, `#ai-bot-info`, `#ai-no-bot`, `#ai-ip-source`, `#ai-ip-info`, `#ai-proxy`, `#ai-vpn`, `#ai-raw`, `#ai-error`. Existing styling approach (`styles/Home.module.css`) is reused. A short block of realistic page content sits above the result so agents have something to "read".

**8. Errors.**
Network failure, non-2xx, and invalid JSON all map to the `error` result and render in `#ai-error` with HTTP status and API error code when available. The page always responds 200 with its content. A short fetch timeout (5s) keeps a slow API from hanging page loads.

**9. Testing.**
Playwright spec `tests/automation-intelligence/automation-intelligence.spec.ts`, using `baseURL` from an env var (`BASE_URL`, default `http://localhost:3000`) like the other specs use a base domain. It runs against a real server with a real key and asserts structure only (an `event_id` is shown, raw JSON parses and has `source: "edge"` and `ip_info`, `?agent=` label echoed, invalid label ignored). It does not assert whether Playwright's browser is detected as a bot, since that is the thing being observed.
*Alternative:* mocking the API. Not possible from the browser side since the call is server-side; a base-URL override env var would add configuration surface just for tests.

## Risks / Trade-offs

- **Header fidelity** (lowercased names, possible reordering/additions by Digital Ocean's proxy layer) → detection may differ from a direct-to-origin deployment. Mitigation: documented here; the page shows the raw response so differences are visible, and the headers sent are not displayed so no secrets can leak.
- **Public preview API** (schema can change, `additionalProperties: false` on both sides) → render the raw JSON in addition to parsed fields so new fields are never hidden.
- **Rate limiting / cost** (one API call per page load, page is public) → show 429 clearly; no retry loop. Acceptable for a low-traffic experiments site.
- **Public page spends the workspace's API quota** → accepted; no auth by design, since agents must be able to land on it.
- **Wrong client IP** (proxy chain) → the page shows the header the IP came from, checked on first deploy (task 4.1).
- **Test needs network and a real key** → run only against environments that have them; documented in the spec file header.
