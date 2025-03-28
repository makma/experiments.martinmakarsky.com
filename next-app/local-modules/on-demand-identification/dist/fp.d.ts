/**
 * Fingerprint Pro static v3.12.0-beta.0 - Copyright (c) FingerprintJS, Inc, 2025 (https://fingerprint.com)
 */

interface Confidence {
    /**
     * A number between 0 and 1 that tells how much the agent is sure about the visitor identifier.
     * The higher the number, the higher the chance of the visitor identifier to be true.
     */
    score: number;
    /**
     * Additional details about the score as a human-readable text
     */
    comment?: string;
}
interface ZeroTrust {
    /**
     * Fields from the result object that have been hidden (values replaced with empty data)
     */
    hiddenFields: string[];
    /**
     * Additional details about the reasons as a human-readable text
     */
    comment?: string;
}
/**
 * IP address location. Can be empty for anonymous proxies.
 */
interface IpLocation {
    /**
     * IP address location detection radius. Smaller values (<50mi) are business/residential,
     * medium values (50 < x < 500) are cellular towers (usually),
     * larger values (>= 500) are cloud IPs or proxies, VPNs.
     * Can be missing, in case of Tor/proxies.
     */
    accuracyRadius?: number;
    /**
     * Latitude
     * Can be missing, in case of Tor/proxies.
     * @example
     * -19.8975
     */
    latitude?: number;
    /**
     * Longitude
     * Can be missing, in case of Tor/proxies.
     * @example
     * -43.9625
     */
    longitude?: number;
    /**
     * Timezone of the IP address location
     * @example
     * 'America/Chicago'
     */
    timezone?: string;
    /**
     * Postal code, when available
     */
    postalCode?: string;
    /**
     * City, when available
     */
    city?: {
        name: string;
    };
    /**
     * Administrative subdivisions array (for example states|provinces -> counties|parishes).
     * Can be empty or missing.
     * When not empty, can contain only top-level administrative units within a country, e.g. a state.
     */
    subdivisions?: {
        isoCode: string;
        name: string;
    }[];
    /**
     * Country, when available. Will be missing for Tor/anonymous proxies.
     */
    country?: {
        code: string;
        name: string;
    };
    /**
     * Continent, when available. Will be missing for Tor/anonymous proxies.
     */
    continent?: {
        code: string;
        name: string;
    };
}
/**
 * @deprecated Not used. Left for backward compatibility.
 */
type FullIpLocation = IpLocation;
interface BotInformation {
    /**
     * @deprecated Agent doesn't detect bots
     */
    probability: number;
    /**
     * @deprecated Agent doesn't detect bots
     */
    safe?: boolean;
}
interface SeenAt {
    /**
     * The date and time within your application. The string format is ISO-8601.
     * @example
     * '2022-03-16T05:18:24.610Z'
     * new Date(result.firstSeenAt.subscription)
     */
    subscription: string | null;
    /**
     * The date and time across all applications. The string format is ISO-8601.
     * @example
     * '2022-03-16T05:18:24.610Z'
     * new Date(result.firstSeenAt.global)
     */
    global: string | null;
}
/**
 * Result of requesting a visitor id
 */
interface VisitorId {
    /**
     * The visitor identifier
     */
    visitorId: string;
    /**
     * If true, this visitor was found and visited before.
     * If false, this visitor wasn't found and probably didn't visit before.
     */
    visitorFound: boolean;
    /**
     * A confidence score that tells how much the agent is sure about the visitor identifier
     */
    confidence: Confidence;
    /**
     * An object that tells what fields were hidden (values replaced with empty data)
     */
    zeroTrust?: ZeroTrust;
}
/**
 * Result of requesting a visitor id when requested with `extendedData: true`
 */
interface ExtendedVisitorId extends VisitorId {
    /**
     * Whether the visitor is in incognito/private mode
     */
    incognito: boolean;
    /**
     * Browser name
     * @example
     * 'Safari'
     * @example
     * 'Chrome'
     */
    browserName: string;
    /**
     * Browser version
     * @example
     * '78.0.3904'
     */
    browserVersion: string;
    /**
     * Device.
     * For desktop/laptop devices, the value will be "Other"
     * @example
     * 'Samsung SM-J330F'
     */
    device: string;
    /**
     * IP address. Only IPv4 are returned.
     * @example
     * '191.14.35.17'
     */
    ip: string;
    /**
     * IP address location. Can be empty for anonymous proxies
     *
     * @deprecated This field will not return a result for applications created after January 23rd, 2024.
     * See IP Geolocation for a replacement available in our Smart Signals product:
     * https://dev.fingerprint.com/docs/smart-signals-overview#ip-geolocation
     */
    ipLocation?: IpLocation;
    /**
     * OS name.
     * @example
     * 'Mac OS X'
     * @example
     * 'Windows'
     * @example
     * 'Android'
     */
    os: string;
    /**
     * OS version
     * @example
     * '10.13.6'
     */
    osVersion: string;
    /**
     * When the visitor was seen for the first time
     */
    firstSeenAt: SeenAt;
    /**
     * When the visitor was seen previous time
     */
    lastSeenAt: SeenAt;
    /**
     * @deprecated Agent doesn't detect bots
     */
    bot?: BotInformation;
}

interface ResultExtraFields {
    /**
     * The current request identifier. It's different for every request.
     */
    requestId: string;
    /**
     * Sealed result, which is an encrypted content of the `/events` Server API response for this requestId, encoded in
     * base64. The field will miss if Sealed Results are disabled or unavailable for another reason.
     * Reach the support to enable.
     */
    sealedResult?: string;
}
/**
 * Result of getting a visitor id.
 *
 * visitorId can be empty string when the visitor can't be identified.
 * It happens only with bots and hackers that modify their browsers.
 */
type GetResult = VisitorId & ResultExtraFields;
/**
 * Result of getting a visitor id when requested with `extendedData: true`
 */
type ExtendedGetResult = ExtendedVisitorId & ResultExtraFields;
/**
 * @deprecated Not used. Left for backward compatibility.
 */
type FullIpExtendedGetResult = ExtendedGetResult;
/**
 * Result of collecting on demand fingerprint data
 */
type CollectResult = string;

declare const ERROR_WRONG_REGION: string;
declare const ERROR_SUBSCRIPTION_NOT_ACTIVE: string;
declare const ERROR_UNSUPPORTED_VERSION: string;
declare const ERROR_INSTALLATION_METHOD_RESTRICTED: string;
declare const ERROR_FORBIDDEN_ENDPOINT: string;
declare const ERROR_INTEGRATION_FAILURE: string;
declare const ERROR_NETWORK_RESTRICTED: string;
declare const ERROR_INVALID_PROXY_INTEGRATION_SECRET: string;
declare const ERROR_INVALID_PROXY_INTEGRATION_HEADERS: string;

interface RollbarOptions {
    clientId: string;
    token: string;
    endpoint?: string;
}

/**
 * A module that gives the agent some capabilities. Only the built-in modules are supported.
 *
 * Warning! The shape of this object is out of Semantic Versioning, i.e. can change unexpectedly.
 */
interface PublicModule {
    __type__: 'module';
}

/**
 * BotD (bot detection) module of agent
 */
declare const makePublicBotdModule: () => PublicModule;

/**
 * Identification module of agent
 */
declare const makePublicIdentificationModule: () => PublicModule;

/**
 * Validation module of agent
 *
 * Warning for package users:
 * This function is an experimental API, it can change unexpectedly. Usage is at your own risk.
 */
declare const makePublicValidationModule: () => PublicModule;

/**
 * Collects performance metrics of JS Agent and sends them to our server.
 * These data are used to improve the JS Agent performance.
 * You may request a performance report for your JS Agent instance from the support.
 */
declare const makePublicLatencyReportModule: () => PublicModule;

/**
 * Makes a debug output that prints debug messages to browser console.
 *
 * Warning for package users:
 * This function is an experimental API, it can change unexpectedly. Usage is at your own risk.
 */
declare const makePublicConsoleDebugModule: (messagePrefix?: string) => PublicModule;

/**
 * Makes a debug output that groups debug messages into reports and sends them to Rollbar.
 *
 * Warning for package users:
 * This function is an experimental API, it can change unexpectedly. Usage is at your own risk.
 */
declare const makePublicRollbarDebugModule: (options: Readonly<RollbarOptions>) => PublicModule;

type Region = 
/** N. Virginia, USA */
'us'
/** Frankfurt, Germany */
 | 'eu'
/** Mumbai, India */
 | 'ap';
/**
 * @deprecated Not used
 */
type IPResolution = 'city' | 'full';
/**
 * @deprecated The option to configure products became obsolete with the introduction of Smart Signals
 */
type Product = 'identification' | 'botd';
/**
 * Represents the default API endpoint for getting visitor data. Can be used as a part of the `endpoint` list.
 *
 * The value of this constant is a placeholder, it may change after any update.
 */
declare const defaultEndpoint: {
    default: "endpoint";
};
/**
 * API endpoint for getting visitor data
 */
type Endpoint = string | typeof defaultEndpoint | readonly (string | typeof defaultEndpoint)[];
/**
 * Represents the default API endpoint for TLS requests. Can be used as a part of the `tlsEndpoint` list.
 *
 * The value of this constant is a placeholder, it may change after any update.
 *
 * @deprecated The need to configure TLS is not necessary anymore
 */
declare const defaultTlsEndpoint: {
    default: "tlsEndpoint";
};
/**
 * API endpoint for TLS requests
 *
 * @deprecated The need to configure TLS is not necessary anymore
 */
type TlsEndpoint = string | typeof defaultTlsEndpoint | readonly (string | typeof defaultTlsEndpoint)[];
type UrlHashing = {
    /** Set to `true` to hash the path part of the URL (between the origin and `?`) */
    path?: boolean;
    /** Set to `true` to hash the query part of the URL (between `?` and `#`) */
    query?: boolean;
    /** Set to `true` to hash the fragment part of the URL (after `#`) */
    fragment?: boolean;
};
type ApiKeyOptions = {
    /** Public API key */
    apiKey?: string;
    /** @deprecated Use the `apiKey` option instead */
    token: string;
} | {
    /** Public API key */
    apiKey: string;
    /** @deprecated Use the `apiKey` option instead */
    token?: string;
};
type CommonLoadOptions = ApiKeyOptions & {
    /**
     * Region of the Fingerprint Pro service server
     * @default 'us'
     */
    region?: Region;
    /**
     * Your custom API endpoint for getting visitor data.
     * If multiple endpoints are given, the agent will try them one by one until it finds a working one.
     * If an empty array is given, the agent will throw an error.
     * @example
     * 'https://fp.example.com'
     * @example
     * ['https://fp.example.com', FingerprintJS.defaultEndpoint]
     */
    endpoint?: Endpoint;
    /**
     * Your custom TLS endpoint.
     * If multiple endpoints are given, the agent will try them one by one until it finds a working one.
     * If an empty array is given, the TLS request will be skipped.
     *
     * @deprecated Not necessary anymore, just remove this option
     */
    tlsEndpoint?: TlsEndpoint;
    /**
     * Disables the extra TLS request
     *
     * @deprecated Not necessary anymore, just remove this option
     */
    disableTls?: boolean;
    /**
     * Override storages name (cookies, localStorage, etc).
     * Should only be used when the default name conflicts with some of your existing names.
     * @default '_vid'
     */
    storageKey?: string;
    /**
     * @deprecated Not used
     */
    delayFallback?: number;
    /**
     * Information about libraries and services used to integrate the JS agent.
     * Each array item means a separate integration, the order doesn't matter.
     * An example of an integration library is Fingerprint Pro React SDK.
     */
    integrationInfo?: readonly string[];
    /**
     * Enables data collection for remote control detection.
     * Once enabled, please contact our support team to active the result exposure.
     * @see https://fingerprint.com/support/
     *
     * @default false
     *
     * @see https://dev.fingerprint.com/docs/smart-signals-overview#remote-control-tools-detection
     */
    remoteControlDetection?: boolean;
    /**
     * Hashes URL parts before sending them to Fingerprint the server.
     * The sources of URLs: window.location.href, document.referrer.
     * Сan be used to hide sensitive data (tokens, payment info, etc) that these URLs may contain.
     *
     * Example of URL stripping 'https://example.com/path?token=secret#anchor' -> 'https://example.com/oK-fhlv2N-ZzaBf0zlUuTN97jDbqdbwlTB0fCvdEtb8?E1kifZXhuoBEZ_zkQa60jyxcaHNX3QFaydaaIEtL7j0#eb-w4rp2udRHYG3bzElINPBaTBHesFLnS0nqMHo8W80'
     */
    urlHashing?: UrlHashing;
};
/**
 * A portion of LoadOptions that will be available in the loader package
 */
type LoaderLoadOptions = CommonLoadOptions;
/**
 * Options for Fingerprint Pro agent loading
 */
type PublicLoadOptions = LoaderLoadOptions & {
    /**
     * Agent modules. Each module gives the agent special capabilities. Agent with no modules does nothing.
     */
    modules: readonly Readonly<PublicModule>[];
    /**
     * @deprecated
     */
    debug?: unknown;
};
/**
 * Options of getting a visitor identifier.
 *
 * The TypeScript `TIP` parameter does nothing and is left for backward compatibility. It will be removed later.
 */
interface PublicGetOptions<TExtended extends boolean, TIP = unknown> {
    /**
     * Controls client-side timeout. Client timeout controls total time (both client-side and server-side) that any
     * identification event is allowed to run. It doesn't include time when the page is in background (not visible).
     * The value is in milliseconds.
     * @default 10000
     */
    timeout?: number;
    /**
     * `Tag` is a user-provided value or object that will be returned back to you in a webhook message.
     * You may want to use the `tag` value to be able to associate a server-side webhook event with a web request of the
     * current visitor.
     *
     * What values can be used as a `tag`?
     * Anything that identifies a visitor or a request.
     * You can pass the requestId as a `tag` and then get this requestId back in the webhook, associated with a visitorId.
     */
    tag?: unknown;
    /**
     * `linkedId` is a way of linking current identification event with a custom identifier.
     * This can be helpful to be able to filter API visit information later.
     */
    linkedId?: string;
    /**
     * Prevents agent from waiting for the TLS request to complete.
     *
     * @deprecated Use the `disableTls` option of `load()` instead
     */
    disableTls?: boolean;
    /**
     * Adds details about the visitor to the result
     */
    extendedResult?: TExtended;
    /**
     * Products to enable. By default, all the products are enabled as determined by the billing plan.
     *
     * @deprecated The option to configure products became obsolete with the introduction of Smart Signals.
     * Billed amount is determined by the billing plan and the `products` option does not influence it.
     */
    products?: readonly Product[];
    /**
     * @deprecated Does nothing
     */
    ipResolution?: TIP;
    /**
     * (does nothing)
     *
     * @deprecated Use the `debug` option of `load()` instead
     */
    debug?: boolean;
}
/**
 * Options of collecting on demand fingerprint data
 */
type PublicCollectOptions = {
    /**
     * Controls client-side timeout. Client timeout controls total time (both client-side and server-side) that any
     * identification event is allowed to run. It doesn't include time when the page is in background (not visible).
     * The value is in milliseconds.
     * @default 10000
     */
    timeout?: number;
    /**
     * `Tag` is a user-provided value or object that will be returned back to you in a webhook message.
     * You may want to use the `tag` value to be able to associate a server-side webhook event with a web request of the
     * current visitor.
     *
     * What values can be used as a `tag`?
     * Anything that identifies a visitor or a request.
     * You can pass the requestId as a `tag` and then get this requestId back in the webhook, associated with a visitorId.
     */
    tag?: unknown;
    /**
     * `linkedId` is a way of linking current identification event with a custom identifier.
     * This can be helpful to be able to filter API visit information later.
     */
    linkedId?: string;
};
/**
 * Options of handling on demand agent data
 */
type PublicHandleAgentDataOptions = {
    /**
     * Override storages name (cookies, localStorage, etc).
     * Should only be used when the default name conflicts with some of your existing names.
     * @default '_vid'
     */
    storageKey?: string;
};

/**
 * Derives the get result type based on input options
 */
type DeriveGetResult<TExtended extends boolean> = TExtended extends true ? ExtendedGetResult : GetResult;
/**
 * Agent object that can get visitor identifier
 */
interface PublicAgent {
    /**
     * Gets the visitor identifier.
     * See the `ERROR_...` constants for expected error messages.
     * When an error is emitted by the backend, it gets a `requestId` field, same as in successful result.
     *
     * The TypeScript `TIP` parameter does nothing and is left for backward compatibility. It will be removed later.
     */
    get<TExtended extends boolean = false, TIP = unknown>(options?: Readonly<PublicGetOptions<TExtended, TIP>>): Promise<DeriveGetResult<TExtended>>;
    /**
     * Collects on demand fingerprint data.
     */
    collect(options?: Readonly<PublicCollectOptions>): Promise<CollectResult>;
}
/**
 * Builds an instance of Agent
 */
declare const publicLoad: (options: Readonly<PublicLoadOptions>) => Promise<PublicAgent>;
/**
 * Handles the on demand agent data sent from the remote agent.
 * Intended for use in integrations where response data is received out-of-band (via /send endpoint).
 *
 * @throws ERROR_HANDLE_AGENT_DATA if `response` is malformed.
 */
declare const publicHandleAgentData: (data: string, options?: Readonly<PublicHandleAgentDataOptions> | undefined) => void;

declare const ERROR_CLIENT_TIMEOUT = "Client timeout";
declare const ERROR_NETWORK_CONNECTION = "Network connection error";
declare const ERROR_NETWORK_ABORT = "Network request aborted";
declare const ERROR_BAD_RESPONSE_FORMAT = "Response cannot be parsed";
declare const ERROR_CSP_BLOCK = "Blocked by CSP";
declare const ERROR_INVALID_ENDPOINT = "The endpoint parameter is not a valid URL";
declare const ERROR_HANDLE_AGENT_DATA = "Handle on demand agent data error";

declare const ERROR_API_KEY_MISSING: string;
declare const ERROR_API_KEY_INVALID: string;
declare const ERROR_API_KEY_EXPIRED: string;
declare const ERROR_BAD_REQUEST_FORMAT: string;
declare const ERROR_GENERAL_SERVER_FAILURE: string;
declare const ERROR_SERVER_TIMEOUT: string;
declare const ERROR_RATE_LIMIT: string;
declare const ERROR_FORBIDDEN_ORIGIN: string;
declare const ERROR_FORBIDDEN_HEADER: string;
/** @deprecated Use ERROR_API_KEY_MISSING instead */
declare const ERROR_TOKEN_MISSING: string;
/** @deprecated Use ERROR_API_KEY_INVALID instead */
declare const ERROR_TOKEN_INVALID: string;
/** @deprecated Use ERROR_API_KEY_EXPIRED instead */
declare const ERROR_TOKEN_EXPIRED: string;
declare const _default: {
    readonly load: (options: Readonly<PublicLoadOptions>) => Promise<PublicAgent>;
    readonly handleAgentData: (data: string, options?: Readonly<PublicHandleAgentDataOptions> | undefined) => void;
    readonly defaultEndpoint: {
        default: "endpoint";
    };
    readonly defaultTlsEndpoint: {
        default: "tlsEndpoint";
    };
    readonly ERROR_CLIENT_TIMEOUT: "Client timeout";
    readonly ERROR_NETWORK_CONNECTION: "Network connection error";
    readonly ERROR_NETWORK_ABORT: "Network request aborted";
    readonly ERROR_WRONG_REGION: string;
    readonly ERROR_SUBSCRIPTION_NOT_ACTIVE: string;
    readonly ERROR_API_KEY_MISSING: string;
    readonly ERROR_API_KEY_INVALID: string;
    readonly ERROR_API_KEY_EXPIRED: string;
    readonly ERROR_BAD_REQUEST_FORMAT: string;
    readonly ERROR_BAD_RESPONSE_FORMAT: "Response cannot be parsed";
    readonly ERROR_GENERAL_SERVER_FAILURE: string;
    readonly ERROR_SERVER_TIMEOUT: string;
    readonly ERROR_RATE_LIMIT: string;
    readonly ERROR_FORBIDDEN_ORIGIN: string;
    readonly ERROR_FORBIDDEN_HEADER: string;
    readonly ERROR_UNSUPPORTED_VERSION: string;
    readonly ERROR_INSTALLATION_METHOD_RESTRICTED: string;
    readonly ERROR_FORBIDDEN_ENDPOINT: string;
    readonly ERROR_CSP_BLOCK: "Blocked by CSP";
    readonly ERROR_INTEGRATION_FAILURE: string;
    readonly ERROR_INVALID_ENDPOINT: "The endpoint parameter is not a valid URL";
    readonly ERROR_NETWORK_RESTRICTED: string;
    readonly ERROR_INVALID_PROXY_INTEGRATION_SECRET: string;
    readonly ERROR_INVALID_PROXY_INTEGRATION_HEADERS: string;
    readonly ERROR_HANDLE_AGENT_DATA: "Handle on demand agent data error";
    /** @deprecated Use ERROR_API_KEY_MISSING instead */
    readonly ERROR_TOKEN_MISSING: string;
    /** @deprecated Use ERROR_API_KEY_INVALID instead */
    readonly ERROR_TOKEN_INVALID: string;
    /** @deprecated Use ERROR_API_KEY_EXPIRED instead */
    readonly ERROR_TOKEN_EXPIRED: string;
};

export { type PublicAgent as Agent, type PublicCollectOptions as CollectOptions, type CollectResult, type Confidence, ERROR_API_KEY_EXPIRED, ERROR_API_KEY_INVALID, ERROR_API_KEY_MISSING, ERROR_BAD_REQUEST_FORMAT, ERROR_BAD_RESPONSE_FORMAT, ERROR_CLIENT_TIMEOUT, ERROR_CSP_BLOCK, ERROR_FORBIDDEN_ENDPOINT, ERROR_FORBIDDEN_HEADER, ERROR_FORBIDDEN_ORIGIN, ERROR_GENERAL_SERVER_FAILURE, ERROR_HANDLE_AGENT_DATA, ERROR_INSTALLATION_METHOD_RESTRICTED, ERROR_INTEGRATION_FAILURE, ERROR_INVALID_ENDPOINT, ERROR_INVALID_PROXY_INTEGRATION_HEADERS, ERROR_INVALID_PROXY_INTEGRATION_SECRET, ERROR_NETWORK_ABORT, ERROR_NETWORK_CONNECTION, ERROR_NETWORK_RESTRICTED, ERROR_RATE_LIMIT, ERROR_SERVER_TIMEOUT, ERROR_SUBSCRIPTION_NOT_ACTIVE, ERROR_TOKEN_EXPIRED, ERROR_TOKEN_INVALID, ERROR_TOKEN_MISSING, ERROR_UNSUPPORTED_VERSION, ERROR_WRONG_REGION, type Endpoint, type ExtendedGetResult, type FullIpExtendedGetResult, type FullIpLocation, type PublicGetOptions as GetOptions, type GetResult, type PublicHandleAgentDataOptions as HandleAgentDataOptions, type IPResolution, type IpLocation, type PublicLoadOptions as LoadOptions, type Product, type Region, type TlsEndpoint, type ZeroTrust, _default as default, defaultEndpoint, defaultTlsEndpoint, publicHandleAgentData as handleAgentData, publicLoad as load, makePublicBotdModule as makeBotdModule, makePublicConsoleDebugModule as makeConsoleDebugModule, makePublicIdentificationModule as makeIdentificationModule, makePublicLatencyReportModule as makeLatencyReportModule, makePublicRollbarDebugModule as makeRemoteDebugModule, makePublicValidationModule as makeValidationModule };
