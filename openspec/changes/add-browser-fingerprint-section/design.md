# Design

## Context

`/automation-intelligence` (`next-app/app/automation-intelligence/page.tsx`) is a force-dynamic App Router server component. On every request it builds an edge-API request from the incoming headers/IP and calls `POST /v4/edge` directly over HTTP (`edge-api.ts`, no SDK) using `FINGERPRINT_SECRET_API_KEY` / `FINGERPRINT_REGION`. See proposal.md for why this change adds a browser-based counterpart.

The repo already has the pieces this change needs, demonstrated elsewhere:
- `@fingerprint/agent` v4 run client-side with `endpoints: CUSTOM_SUBDOMAIN` (`next-app/shared/constants.ts`, `https://fp.martinmakarsky.com`) - see `next-app/pages/v4/fingerprint-pro-npm-custom-subdomain.tsx`.
- A server-side call to the Server API with the secret key never leaving the server - see `next-app/pages/api/v4/event-details.ts` (there, via `@fingerprint/node-sdk`; this change calls the same endpoint directly instead, see Decisions).
- Calling a Fingerprint API directly over `fetch`, against its documented public HTTP contract with no SDK - see `next-app/app/automation-intelligence/edge-api.ts`, which authenticates with `Authorization: Bearer <secret>` and resolves the regional base URL itself.

## Goals / Non-Goals

**Goals:**
- Run the JS Agent v4 in the browser through the existing custom subdomain and surface its `event_id`.
- Add one server route handler that calls the Server API's "get event" endpoint and is reused for both the edge event and the agent event.
- Keep the existing edge-API section and its behavior unchanged; add the new section alongside it.

**Non-Goals:**
- No changes to how the edge-API request itself is built or sent (`edge-api.ts` logic is untouched).
- No new Rules Engine, tagging/`linkedId` correlation between the two events, or request-filtering changes - out of scope for this change.
- No visual redesign of the page beyond adding the second section and the Server API detail blocks.

## Decisions

- **New App Router route handler at `next-app/app/api/automation-intelligence/event/route.ts`** (`GET ?eventId=`), rather than reusing `next-app/pages/api/v4/event-details.ts`. Keeping it under the feature's own path avoids coupling this page to an unrelated demo's route and matches the Pages-vs-App Router split already in the repo (this page lives entirely in `app/`).
- **Call the Server API directly with `fetch`, no `@fingerprint/node-sdk` dependency.** The handler calls `GET {baseUrl}/events/{event_id}` with `Auth-API-Key: ${FINGERPRINT_SECRET_API_KEY}`, against the documented public HTTP contract, the same way `edge-api.ts` already calls `POST /v4/edge` without an SDK (that endpoint instead expects `Authorization: Bearer <secret>` - confirmed empirically against the live API, since this endpoint rejects Bearer auth with `TokenRequired`). This keeps both Fingerprint API calls on this page free of an SDK dependency and reuses `edge-api.ts`'s existing region -> base URL mapping, reimplemented locally in `server-api.ts` (see Risks / Trade-offs) rather than adding a second, SDK-specific region enum (`Region.Global/EU/AP`) alongside it.
- **Page fetches the edge event's Server API detail server-side**, in the same server component that already calls the edge API, right after that call succeeds - one more `await`, no new client round trip, so the initial HTML is complete for the existing section (consistent with "no-JS still gets a result" behavior already required of that section).
- **Agent section is a client component** (`"use client"`) mounted inside the otherwise server-rendered page, since running the agent requires a browser. It calls the new route handler itself via `fetch` once the agent resolves an `event_id`, mirroring the existing `event-details-node-sdk.tsx` pattern (agent result state -> fetch -> detail state).
- **Shared rendering for Server API detail**: both sections render the same `getEvent` response shape, so a single presentational component (e.g. `SmartSignals`) is reused for both the edge event and the agent event, rather than duplicating the field list.
- **Public API key**: reuse the existing `FINGERPRINT_PUBLIC_API_KEY` constant; no new key is provisioned.

## Risks / Trade-offs

- [`server-api.ts` duplicates `edge-api.ts`'s small region -> base URL mapping instead of importing it, because a relative import needs an explicit `.ts` extension to run under `node --test`'s native type stripping, which `tsc` then rejects without `allowImportingTsExtensions`] → Kept each API client file self-contained (matching `edge-api.ts`'s existing style of no relative imports) rather than changing a shared `tsconfig.json` setting for this one demo page.
- [Automation Intelligence (edge) events and JS-Agent identification ("device") events are different event sources, so the "get event" response may have a different field set for each] → Confirmed against the live API and the Server API "Get event" reference docs: a "device" event nests each Smart Signal under `products.<signal>.data`, while an "edge" event is flat (`bot_info`, `ip_info`, `proxy`, `vpn` at top level, matching `edge-api.ts`'s own `EdgeResponse` shape). `SmartSignals` normalizes both shapes into one display model rather than assuming either, per the spec's "Fields vary by event source" requirement.
- [Agent load through the custom subdomain can be blocked or slow on some networks, leaving the agent section without an `event_id`] → The agent section shows an explicit "no result" state (spec requirement) instead of hanging; this matches how the existing edge-API section already surfaces skip/error states.
- [Adding a second outbound Server API call per page load (for the edge event) increases page latency] → Acceptable for a demo page; no caching is introduced, consistent with the existing "MUST NOT be cached" requirement for the edge analysis.
