# Spec Delta

## ADDED Requirements

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
