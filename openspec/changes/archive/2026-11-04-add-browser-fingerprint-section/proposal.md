# Proposal

## Why

The `/automation-intelligence` page currently demonstrates only the edge-based Automation Intelligence API (`POST /v4/edge`), which classifies the raw HTTP request. It does not show Fingerprint's browser-based identification path (JS Agent v4 + Smart Signals/bot detection), so visitors to the page can't compare both detection approaches side by side or see how Smart Signals enrich a device that actually executed the agent.

## What Changes

- Add a second section to the existing `/automation-intelligence` page that runs the Fingerprint JS Agent v4 (`@fingerprint/agent`) in the browser, loaded through the project's existing custom subdomain (`CUSTOM_SUBDOMAIN`, `fp.martinmakarsky.com`), and captures the resulting `event_id`.
- Add a new server route handler that, given an `event_id`, calls the Fingerprint Server API's "get event" endpoint (`GET /events/{event_id}`) directly over `fetch`, against its documented HTTP contract (no SDK, matching how the existing edge-API call is made), using the workspace secret key and region, and returns the event's Smart Signals (bot detection, VPN, proxy, IP info, etc.) as JSON. The secret key MUST stay server-side; the browser never calls the Server API directly.
- Reuse that same server route (parameterized by event id) to also fetch and render the Server API ("get event") response for the existing Automation Intelligence edge event, so both the edge event and the agent event show their full Server API detail on the same page, in addition to the raw edge-API response already shown today.
- The agent section is client-rendered (it needs a browser to run the agent); it fetches its own Server API detail after the agent resolves an `event_id`. The existing edge-API section keeps rendering server-side on each request, and the page now also fetches the Server API detail for that edge event server-side before rendering, so both the edge result and its Server API enrichment ship in the initial HTML, while only the agent section waits on the client.
- Label both sections clearly as "Automation Intelligence (edge, no browser agent)" and "JS Agent v4 + Smart Signals (browser)" so the comparison is unambiguous.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `automation-intelligence-demo`: the page gains a second, browser-based detection section (JS Agent v4 over the custom subdomain) and a new server-side "get event" lookup (via the Server API) whose result is rendered for both the edge event and the new agent event.

## Impact

- `next-app/app/automation-intelligence/page.tsx`: add the second section and wire in Server API detail for both events.
- `next-app/app/automation-intelligence/edge-api.ts`: no behavior change to the existing edge-API flow.
- New: a client component for the browser agent section (mounted from the page) and a server route handler (e.g. `next-app/app/api/automation-intelligence/event/route.ts`) calling the Server API's "get event" endpoint directly over `fetch`.
- Uses existing env vars `FINGERPRINT_SECRET_API_KEY`, `FINGERPRINT_REGION`, and existing constants `CUSTOM_SUBDOMAIN`, `FINGERPRINT_PUBLIC_API_KEY` from `next-app/shared/constants.ts`.
- Dependencies: `@fingerprint/agent` (already installed) for the browser agent. No new dependency for the Server API call, which uses `fetch` directly.
- `next-app/pages/index.tsx`: add a second index card for `/automation-intelligence` in the "Identification + Server API API v4" section, alongside its existing card in the "Identification API v3" section.
- No breaking changes; the existing edge-API behavior and its spec requirements are unchanged, only extended.
