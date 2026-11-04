// Client for the Fingerprint Server API "get event" endpoint
// (GET /events/{event_id}), written against the public HTTP contract.
// No Fingerprint SDK is used, matching edge-api.ts. The region -> base URL
// mapping is duplicated from edge-api.ts rather than imported: a relative
// import needs an explicit ".ts" extension to run under `node --test`
// (native type stripping), which `tsc` then rejects without
// `allowImportingTsExtensions` - keeping each API client self-contained
// avoids the conflict.
const REGION_BASE_URLS: Record<string, string> = {
  global: "https://api.fpjs.io",
  eu: "https://eu.api.fpjs.io",
  ap: "https://ap.api.fpjs.io",
};

// Returns null for a missing or unrecognized region: falling back to the global
// endpoint would make a workspace in another region fail with a misleading
// `secret_api_key_not_found`.
export function resolveBaseUrl(region: string | undefined): string | null {
  const key = (region ?? "").trim().toLowerCase();
  return REGION_BASE_URLS[key] ?? null;
}

const REQUEST_TIMEOUT_MS = 5000;

export type EventDetailResult =
  | {
      kind: "ok";
      baseUrl: string;
      event: unknown;
    }
  | {
      kind: "skipped";
      reason: "missing_secret_key" | "invalid_region";
      message: string;
    }
  | {
      kind: "error";
      baseUrl: string;
      status?: number;
      code?: string;
      message: string;
    };

export async function getEventDetail(args: {
  eventId: string;
  secretKey: string | undefined;
  region: string | undefined;
  fetchImpl?: typeof fetch;
}): Promise<EventDetailResult> {
  if (!args.secretKey) {
    return {
      kind: "skipped",
      reason: "missing_secret_key",
      message: "FINGERPRINT_SECRET_API_KEY is not configured; no API call was made.",
    };
  }

  const baseUrl = resolveBaseUrl(args.region);
  if (!baseUrl) {
    return {
      kind: "skipped",
      reason: "invalid_region",
      message: `FINGERPRINT_REGION is ${
        args.region?.trim() ? `"${args.region.trim()}", which is not recognized` : "not set"
      }; no API call was made.`,
    };
  }

  const doFetch = args.fetchImpl ?? fetch;

  let res: Response;
  try {
    res = await doFetch(`${baseUrl}/events/${encodeURIComponent(args.eventId)}`, {
      method: "GET",
      headers: {
        "Auth-API-Key": args.secretKey,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    return {
      kind: "error",
      baseUrl,
      message: `Request to the Server API failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    return {
      kind: "error",
      baseUrl,
      status: res.status,
      message: "The Server API returned a response that is not valid JSON.",
    };
  }

  if (!res.ok) {
    const err = (payload as { error?: { code?: string; message?: string } })?.error;
    return {
      kind: "error",
      baseUrl,
      status: res.status,
      code: err?.code,
      message: err?.message ?? `The Server API responded with HTTP ${res.status}.`,
    };
  }

  return {
    kind: "ok",
    baseUrl,
    event: payload,
  };
}
