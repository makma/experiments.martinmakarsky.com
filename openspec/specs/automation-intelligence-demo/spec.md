# Automation-intelligence-demo Specification

## Purpose

Provides a demo page that submits each visiting request to Fingerprint's Automation Intelligence API and shows the detection result, so people can observe how different agents and automation tools are classified.

## Requirements

### Requirement: Page analyzes every visit
The system SHALL expose a page at `/automation-intelligence` that, on every request, sends that request's metadata to the Automation Intelligence API (`POST /v4/edge`) and renders the outcome in the response HTML. The analysis MUST NOT be cached between requests.

#### Scenario: Visit without JavaScript
- **WHEN** a client that does not execute JavaScript requests `/automation-intelligence`
- **THEN** the returned HTML already contains the detection result for that request

#### Scenario: Repeat visits are analyzed independently
- **WHEN** the same client requests the page twice
- **THEN** each response contains a different `event_id` and a different `linked_id`

### Requirement: Request metadata faithfully forwarded
The system SHALL send the original request's headers in the order received, its HTTP method, its absolute URL without a fragment, and the client IP address, using `ipv4_address` for IPv4 and `ipv6_address` for IPv6. An IPv4-mapped IPv6 address MUST be sent as `ipv6_address`.

#### Scenario: Headers forwarded
- **WHEN** a request arrives with several headers
- **THEN** the API request contains each of them as a separate `{name, value}` entry in the received order

#### Scenario: IPv6 client
- **WHEN** the client IP is an IPv6 address
- **THEN** the API request carries it in `ipv6_address` and omits `ipv4_address`

### Requirement: Credentials never forwarded
The system SHALL send credential and session headers (`Authorization`, `Cookie`, `Proxy-Authorization`, `Proxy-Authenticate`, `X-Api-Key`) with an empty string value rather than omitting them or sending their real value.

#### Scenario: Cookie present on the request
- **WHEN** a request carries a `Cookie` header
- **THEN** the API request contains a `Cookie` entry with an empty value and the cookie contents appear nowhere in the API request

### Requirement: Secret key stays server-side
The system SHALL authenticate to the API with the workspace secret key sent as a Bearer token, and SHALL use the region configured for the deployment to choose the API base URL. The secret key MUST NOT appear in any response to the browser.

#### Scenario: Regional endpoint
- **WHEN** the configured region is `eu`
- **THEN** the system calls `https://eu.api.fpjs.io/v4/edge`

#### Scenario: Region missing or unrecognized
- **WHEN** the configured region is unset or is not one of `global`, `eu` or `ap`
- **THEN** the page shows a configuration error naming the region setting and its allowed values, and makes no API call

#### Scenario: Key not leaked
- **WHEN** the page is fetched
- **THEN** neither the HTML nor any script served with it contains the secret key

### Requirement: Detection result displayed
The system SHALL display the analyzed request's `event_id`, the `bot_info` fields (category, provider, name, identity, confidence) when present, an explicit "no bot detected" statement when `bot_info` is absent, the IP intelligence, the proxy result, the VPN result, and the full raw JSON response.

#### Scenario: Bot detected
- **WHEN** the API response contains `bot_info`
- **THEN** the page shows its category, provider, name, identity and confidence

#### Scenario: No bot detected
- **WHEN** the API response has no `bot_info`
- **THEN** the page states that no bot was detected and still shows the IP, proxy, VPN and raw JSON sections

### Requirement: Page content is neutral filler
The system SHALL present the page's visible, non-result content as plain, generic text that does not represent any real or fictional business, brand or storefront, so the page cannot be mistaken for commercial content.

#### Scenario: No fabricated brand
- **WHEN** the page is rendered
- **THEN** its content contains no company name, product listing, or pricing presented as a storefront

### Requirement: Page listed on the experiments index
The system SHALL list `/automation-intelligence` on the experiments index page (`next-app/pages/index.tsx`), in the "Identification API v3" section, labeled with `subId: sub_AHhMVKY0HFYj3W` and `env: prod` the same way the other cards in that section are labeled.

#### Scenario: Index lists the page
- **WHEN** the experiments index page is rendered
- **THEN** the "Identification API v3" section contains a card linking to `/automation-intelligence` with `subId: sub_AHhMVKY0HFYj3W` and `env: prod`

### Requirement: Test runs can be labeled
The system SHALL accept an optional `agent` query parameter, send it to the API as the `agent` tag together with a per-request generated `linked_id`, and display both on the page. A label MUST be limited to 64 characters of letters, digits, `.`, `_` and `-`; any other value SHALL be ignored.

#### Scenario: Valid label
- **WHEN** the page is requested with `?agent=claude-browser`
- **THEN** the API request includes the tag `agent` with value `claude-browser` and the page shows that label

#### Scenario: Invalid label
- **WHEN** the page is requested with `?agent=<script>`
- **THEN** no `agent` tag is sent and the page shows no label

### Requirement: Failures are visible and non-fatal
The system SHALL still return the page content when analysis cannot be completed, and SHALL show the reason in place of the result. The system MUST NOT call the API when the secret key is unset, the region is missing or unrecognized, or no client IP can be determined.

#### Scenario: API error
- **WHEN** the API responds with an error such as HTTP 429 `too_many_requests`
- **THEN** the page shows the HTTP status and error code and still renders its regular content

#### Scenario: Missing configuration
- **WHEN** the secret key is not configured
- **THEN** the page shows a configuration error and makes no API call

#### Scenario: Client IP unknown
- **WHEN** no client IP can be determined from the request
- **THEN** the page shows that analysis was skipped for that reason and makes no API call

### Requirement: Browser agent section runs JS Agent v4 over the custom subdomain
The system SHALL render a second section on `/automation-intelligence`, clearly labeled as the browser-based approach, that runs the Fingerprint JS Agent v4 in the visitor's browser configured to use the project's existing custom subdomain as its endpoint, and captures the resulting `event_id`.

#### Scenario: Agent runs successfully
- **WHEN** a browser with JavaScript enabled loads `/automation-intelligence`
- **THEN** the agent section requests identification through the custom subdomain and displays the resulting `event_id` once the agent resolves

#### Scenario: Agent fails or JavaScript is unavailable
- **WHEN** the agent call errors or the browser never executes it
- **THEN** the agent section shows that no result is available instead of leaving the section blank indefinitely or crashing the page

### Requirement: Server API lookup is server-side only
The system SHALL expose a server-side route handler that, given an `event_id`, calls the Fingerprint Server API ("get event") using the workspace secret key and configured region, and returns the event's Smart Signals. The secret key MUST NOT be sent to, or be callable by, the browser directly.

#### Scenario: Browser requests event detail
- **WHEN** the agent section has an `event_id`
- **THEN** it requests that event's detail from the server route handler, and the handler (not the browser) performs the authenticated Server API call

#### Scenario: Secret key not leaked
- **WHEN** the server route handler responds
- **THEN** neither the response body nor any script served with the page contains the secret key

#### Scenario: Server API lookup fails
- **WHEN** the Server API call for an `event_id` errors or the event is not found
- **THEN** the route handler returns an error response and the page shows that the lookup failed for that event instead of showing stale or fabricated data

### Requirement: Both events show their Server API detail
The system SHALL fetch and render the Server API event detail for both the Automation Intelligence edge event created on page load and the browser agent's event, so each event's Smart Signals (bot detection, VPN, proxy, IP intelligence, and other fields present in the response) are visible alongside its original result.

#### Scenario: Edge event detail rendered server-side
- **WHEN** `/automation-intelligence` is requested and the edge API call succeeds
- **THEN** the response HTML already contains that edge event's Server API detail, fetched server-side, in addition to the raw edge-API response already shown

#### Scenario: Agent event detail rendered after the agent resolves
- **WHEN** the browser agent resolves an `event_id`
- **THEN** the page fetches and displays that event's Server API detail without a full page reload

#### Scenario: Fields vary by event source
- **WHEN** the Server API detail for an event omits a Smart Signal field not applicable to that event's source
- **THEN** the page omits that field rather than showing an error

### Requirement: Page also listed in the Identification + Server API v4 section
The system SHALL list `/automation-intelligence` on the experiments index page (`next-app/pages/index.tsx`), in the "Identification + Server API API v4" section, labeled with `subId: sub_AHhMVKY0HFYj3W` and `env: prod` the same way the other card in that section is labeled, in addition to its existing listing in the "Identification API v3" section.

#### Scenario: Index lists the page in the v4 section
- **WHEN** the experiments index page is rendered
- **THEN** the "Identification + Server API API v4" section contains a card linking to `/automation-intelligence` with `subId: sub_AHhMVKY0HFYj3W` and `env: prod`
