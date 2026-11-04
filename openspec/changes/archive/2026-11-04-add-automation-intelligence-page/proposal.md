# Proposal

## Why

Fingerprint's Automation Intelligence API (public preview, `POST /v4/edge`) classifies a request as bot, AI agent, AI browser, etc. from HTTP metadata alone, with no JS agent. We need a hands-on way to point different agents and automation tools at a real page and observe whether, and how, the API detects them. `next-app` already hosts the other Fingerprint experiments, so this is the natural home.

## What Changes

- Add a new dynamic page in `next-app` (`/automation-intelligence`) with neutral, generic filler content for agents to land on — plain descriptive text about the page's purpose, not a fabricated storefront, brand or business.
- List the page on the experiments index (`next-app/pages/index.tsx`), the same way other experiment pages are listed there.
- On every request to that page, the server calls the Automation Intelligence API directly via its HTTP contract (no Fingerprint SDK), forwarding the incoming request's headers, method, URL and client IP.
- Render the detection result on the page: `bot_info` (category, provider, name, identity, confidence), IP info (geo, ASN, datacenter), proxy and VPN results, the `event_id`, and the raw JSON response, so a human or an agent can see the outcome immediately.
- Allow an optional `?agent=<label>` query param, sent to the API as a tag, so a test run can be matched to an agent in the Fingerprint dashboard. Every request also gets a generated `linked_id`.
- Configure through existing server-side env vars (`FINGERPRINT_SECRET_API_KEY`, `FINGERPRINT_REGION`); nothing secret reaches the browser.
- Add a Playwright test for the page.
- Out of scope: event history or listing (the Fingerprint dashboard covers it), the Fingerprint Node SDK, any blocking or allow/deny behavior, authentication on the page.

## Capabilities

### New Capabilities
- `automation-intelligence-demo`: a demo page that calls the Automation Intelligence API for each incoming request and displays the detection result.

### Modified Capabilities
<!-- None: openspec/specs/ is empty. -->

## Impact

- New code in `next-app/app/automation-intelligence/` (page, server-side API call helper) and a Playwright spec in `tests/`.
- Uses existing env vars in `next-app/.env.local` and the Digital Ocean app's environment; no new dependencies.
- Calls an external preview API (`https://{api|eu.api|ap.api}.fpjs.io/v4/edge`) on every page load, so it is subject to that API's rate limiting (HTTP 429).
- Deployed as part of the `next-app` Node service on Digital Ocean; the client IP and header fidelity depend on that platform's proxy layer (see design).
