// Client for the Fingerprint Automation Intelligence API (POST /v4/edge),
// written against the public HTTP contract. No Fingerprint SDK is used.
// Keep this file free of non-erasable TypeScript syntax (enums, parameter
// properties) so it can also be loaded by `node --test` via type stripping.
import { isIP } from "node:net";

export const PAGE_PATH = "/automation-intelligence";

const REGION_BASE_URLS: Record<string, string> = {
  global: "https://api.fpjs.io",
  eu: "https://eu.api.fpjs.io",
  ap: "https://ap.api.fpjs.io",
};

// Sent with an empty value instead of the real one (header must still be present).
const BLANKED_HEADERS = new Set([
  "authorization",
  "cookie",
  "proxy-authorization",
  "proxy-authenticate",
  "x-api-key",
]);

// Checked in this order; the first one holding a valid IP wins. The page shows
// which one was used so the real platform header can be confirmed after deploy.
const CLIENT_IP_HEADERS = ["do-connecting-ip", "x-forwarded-for"];

const AGENT_LABEL_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
const REQUEST_TIMEOUT_MS = 5000;

export type HeaderEntry = { name: string; value: string };

export type BotInfo = {
  category: string;
  provider: string;
  provider_url?: string;
  name: string;
  identity: string;
  confidence: string;
};

export type IpInfoEntry = {
  address: string;
  geolocation?: Record<string, unknown>;
  asn?: string;
  asn_name?: string;
  asn_network?: string;
  asn_type?: string;
  datacenter_result?: boolean;
  datacenter_name?: string;
};

export type EdgeResponse = {
  event_id: string;
  timestamp: number;
  source?: string;
  linked_id?: string;
  tags?: Record<string, unknown>;
  url?: string;
  bot_info?: BotInfo;
  ip_info: { v4?: IpInfoEntry; v6?: IpInfoEntry };
  proxy?: boolean;
  proxy_confidence?: string;
  proxy_details?: Record<string, unknown>;
  vpn?: boolean;
  vpn_confidence?: string;
  vpn_methods?: Record<string, boolean>;
};

export type EdgeRequestBody = {
  headers: HeaderEntry[];
  method: string;
  url: string;
  ipv4_address?: string;
  ipv6_address?: string;
  linked_id?: string;
  tags?: Record<string, string>;
};

export type AnalysisResult =
  | {
      kind: "ok";
      baseUrl: string;
      response: EdgeResponse;
      raw: unknown;
    }
  | {
      kind: "skipped";
      reason: "missing_secret_key" | "client_ip_unknown";
      message: string;
    }
  | {
      kind: "error";
      baseUrl: string;
      status?: number;
      code?: string;
      message: string;
    };

export function resolveBaseUrl(region: string | undefined): string {
  const key = (region ?? "").trim().toLowerCase();
  return REGION_BASE_URLS[key] ?? REGION_BASE_URLS.global;
}

export function parseAgentLabel(
  value: string | string[] | undefined
): string | undefined {
  if (typeof value !== "string") return undefined;
  return AGENT_LABEL_PATTERN.test(value) ? value : undefined;
}

export function buildForwardedHeaders(
  entries: Iterable<[string, string]>
): HeaderEntry[] {
  const result: HeaderEntry[] = [];
  for (const [name, value] of entries) {
    result.push({
      name,
      value: BLANKED_HEADERS.has(name.toLowerCase()) ? "" : value,
    });
  }
  return result;
}

function stripPort(candidate: string): string {
  const value = candidate.trim();
  // [v6]:port
  const bracketed = value.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracketed) return bracketed[1];
  // v4:port
  const v4WithPort = value.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (v4WithPort) return v4WithPort[1];
  return value;
}

export type ClassifiedIp = { ipv4_address: string } | { ipv6_address: string };

// IPv4-mapped IPv6 (::ffff:a.b.c.d) is deliberately kept as IPv6: the API
// reports it under ip_info.v4 itself.
export function classifyIp(candidate: string): ClassifiedIp | null {
  const ip = stripPort(candidate);
  const family = isIP(ip);
  if (family === 4) return { ipv4_address: ip };
  if (family === 6) return { ipv6_address: ip };
  return null;
}

export function resolveClientIp(
  getHeader: (name: string) => string | null
): { ip: ClassifiedIp; source: string } | null {
  for (const header of CLIENT_IP_HEADERS) {
    const raw = getHeader(header);
    if (!raw) continue;
    const first = raw.split(",")[0];
    const ip = classifyIp(first);
    if (ip) return { ip, source: header };
  }
  return null;
}

export function buildPageUrl(
  getHeader: (name: string) => string | null,
  searchParams: Record<string, string | string[] | undefined>
): string {
  const host = getHeader("host") ?? "localhost";
  const forwardedProto = getHeader("x-forwarded-proto")?.split(",")[0].trim();
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const proto = forwardedProto || (isLocal ? "http" : "https");

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
    else if (value !== undefined) query.append(key, value);
  }
  const qs = query.toString();
  return `${proto}://${host}${PAGE_PATH}${qs ? `?${qs}` : ""}`;
}

export function buildEdgeRequestBody(input: {
  headers: Iterable<[string, string]>;
  method: string;
  url: string;
  ip: ClassifiedIp;
  linkedId: string;
  agentLabel?: string;
}): EdgeRequestBody {
  const tags: Record<string, string> = { page: PAGE_PATH };
  if (input.agentLabel) tags.agent = input.agentLabel;
  return {
    headers: buildForwardedHeaders(input.headers),
    method: input.method,
    url: input.url,
    ...input.ip,
    linked_id: input.linkedId,
    tags,
  };
}

export async function callEdgeApi(args: {
  secretKey: string | undefined;
  region: string | undefined;
  body: EdgeRequestBody;
  fetchImpl?: typeof fetch;
}): Promise<AnalysisResult> {
  if (!args.secretKey) {
    return {
      kind: "skipped",
      reason: "missing_secret_key",
      message: "FINGERPRINT_SECRET_API_KEY is not configured; no API call was made.",
    };
  }

  const baseUrl = resolveBaseUrl(args.region);
  const doFetch = args.fetchImpl ?? fetch;

  let res: Response;
  try {
    res = await doFetch(`${baseUrl}/v4/edge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args.body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    return {
      kind: "error",
      baseUrl,
      message: `Request to the API failed: ${
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
      message: "The API returned a response that is not valid JSON.",
    };
  }

  if (!res.ok) {
    const err = (payload as { error?: { code?: string; message?: string } })
      ?.error;
    return {
      kind: "error",
      baseUrl,
      status: res.status,
      code: err?.code,
      message: err?.message ?? `The API responded with HTTP ${res.status}.`,
    };
  }

  return {
    kind: "ok",
    baseUrl,
    response: payload as EdgeResponse,
    raw: payload,
  };
}
