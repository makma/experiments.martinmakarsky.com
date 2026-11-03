# Tasks

## 1. API helper

- [x] 1.1 Create `next-app/app/automation-intelligence/edge-api.ts` with response types, region-to-base-URL mapping, header blanking, client IP resolution that checks candidate headers in a fixed order (platform client-IP header, then first `x-forwarded-for` entry) and returns the address plus the name of the header it came from, IP classification (IPv4 / IPv6 / IPv4-mapped), URL building, `?agent=` validation, and the `fetch` call with a 5s timeout returning an `ok | error` result. Verify with `npx tsc --noEmit` in `next-app`.
- [x] 1.2 Add unit-style checks for the pure functions (blanking, IP classification, label validation, region mapping) as a Playwright-free test file runnable with `node --test` or the project's existing runner. Verify the tests pass and cover every scenario in the spec's forwarding, credentials, and labeling requirements.

## 2. Page

- [x] 2.1 Create `next-app/app/automation-intelligence/page.tsx` as a dynamic Server Component: sample content, call the helper, render the sections with the stable ids from design.md Decision 7, show config/IP-skipped/API errors in `#ai-error`. Verify by running `next dev` in `next-app` and fetching the page with `curl` (no JS): HTML contains `#ai-event-id` and the raw JSON.
- [x] 2.2 Verify the secret key never appears in the page output: `curl` the page and grep the HTML for the key value; expect no match. Verify an unset key shows the config error and makes no API call.

## 3. End-to-end test

- [x] 3.1 Add `tests/automation-intelligence/automation-intelligence.spec.ts` covering: result renders, raw JSON has `source: "edge"` and `ip_info`, `?agent=` label echoed, invalid label ignored, two visits give different `event_id`s. Verify by running it with `BASE_URL=http://localhost:3000 npx playwright test tests/automation-intelligence --project=chromium` against the local dev server.

## 4. Deploy and observe

- [ ] 4.1 Hand off to the user: they push and merge to `main`, and Digital Ocean builds automatically. Do not push, merge or deploy from the agent. Tell the user that `FINGERPRINT_SECRET_API_KEY` and `FINGERPRINT_REGION` must be set on the Digital Ocean app (never read or print their values). Verify, once the user confirms the deploy, by loading the deployed `/automation-intelligence` and checking that an `event_id` is shown and that the displayed client-IP header source is the platform's real client-IP header; record that finding in design.md Decision 4.
- [x] 4.2 Add the new page and env var usage to the repo's docs (a short section in `README.md`: URL, `?agent=` usage, required env vars). Verify the documented URL and param work as written.

## 5. Region validation (follow-up from first deploy)

- [x] 5.1 Treat a missing or unrecognized `FINGERPRINT_REGION` as a visible configuration error with no API call, normalizing case and whitespace. Verify with the unit tests for `resolveBaseUrl` and `callEdgeApi`, `npx tsc --noEmit`, and a `curl` against `next dev` with `FINGERPRINT_REGION` unset showing the error and no `ai-event-id`.

## Workflow follow-up

- Run `/opsx:verify` (if enabled) and then `/opsx:archive` once the page is deployed and checked.
