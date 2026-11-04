# Tasks

## 1. Server API route handler

- [x] 1.1 Add `next-app/app/api/automation-intelligence/event/route.ts` (`GET`) that reads `eventId` from the query string, validates it is present, and returns 400 otherwise; verify by requesting the route with no `eventId` and getting a 400 JSON error.
- [x] 1.2 In the handler, resolve the base URL from `FINGERPRINT_REGION` by reusing `edge-api.ts`'s `resolveBaseUrl` (`global|eu|ap`), returning a config error (no API call) when `FINGERPRINT_SECRET_API_KEY` is missing or the region is unrecognized; verify with unit tests covering missing key and invalid region.
- [x] 1.3 Call `GET {baseUrl}/events/{eventId}` directly via `fetch` with `Auth-API-Key: <secret>` (no `@fingerprint/node-sdk`; confirmed against the live API that this endpoint needs `Auth-API-Key`, not the `Authorization: Bearer` scheme `/v4/edge` uses), returning its JSON on success or a structured error (HTTP status + message) on failure/not-found, never including the secret key in the response; verify with a test that mocks `fetch` for success and failure cases and asserts the response body never contains the key.

## 2. Browser agent section

- [x] 2.1 Add a client component (e.g. `next-app/app/automation-intelligence/BrowserAgentSection.tsx`, `"use client"`) that starts `@fingerprint/agent` with `apiKey: FINGERPRINT_PUBLIC_API_KEY` and `endpoints: CUSTOM_SUBDOMAIN`, calls `.get()` on mount, and renders the resulting `event_id`; verify by loading the page in a browser and confirming an `event_id` appears without a full reload.
- [x] 2.2 Handle agent failure (rejected promise, missing `event_id`) by rendering an explicit "no result" state instead of leaving the section blank; verify by forcing `.get()` to reject in a test/manual check and confirming the fallback text renders.
- [x] 2.3 Mount `BrowserAgentSection` from `next-app/app/automation-intelligence/page.tsx` under a clearly labeled heading (e.g. "JS Agent v4 + Smart Signals (browser)"), alongside the existing edge-API section labeled as the edge approach; verify both section headings render on a single page load.

## 3. Server API detail rendering (both events)

- [x] 3.1 Extract a shared presentational component (e.g. `SmartSignals`) that renders whatever Smart Signals fields are present in a `getEvent` response (bot, vpn, proxy, identification, ip info, etc.), omitting fields that are absent rather than erroring; verify with a unit/render test passing a partial response and confirming missing fields are skipped.
- [x] 3.2 In `page.tsx`, after the existing edge-API call succeeds, server-side fetch that edge event's detail via the new route handler (or call the same server logic directly) and render it with `SmartSignals` under the edge section; verify the edge section's Server API detail is present in the initial HTML (no-JS fetch of the page).
- [x] 3.3 In `BrowserAgentSection`, once the agent resolves an `event_id`, fetch that event's detail from the new route handler and render it with `SmartSignals` under the agent section; verify the detail appears after the agent result without a full page reload.
- [x] 3.4 Handle Server API lookup failure for either event by showing a failure message for that event's detail block without breaking the rest of the page; verify by mocking a `getEvent` failure and confirming the page still renders both sections.

## 4. Documentation and listing check

- [x] 4.1 Confirm the experiments index entry for `/automation-intelligence` in the "Identification API v3" section (per the existing spec requirement) still accurately describes the page now that it covers both approaches, updating its label/description if needed; verify by viewing `next-app/pages/index.tsx`'s rendered card text.
- [x] 4.2 Add a second card for `/automation-intelligence` to the "Identification + Server API API v4" section in `next-app/pages/index.tsx`, labeled with `subId: sub_AHhMVKY0HFYj3W` and `env: prod` matching the existing card in that section; verify the section renders two cards, including the new one linking to `/automation-intelligence`.
