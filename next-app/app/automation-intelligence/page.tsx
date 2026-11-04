import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import styles from "../../styles/Home.module.css";
import {
  AnalysisResult,
  buildEdgeRequestBody,
  buildPageUrl,
  callEdgeApi,
  parseAgentLabel,
  resolveClientIp,
} from "./edge-api";

// The analysis is per request: never cache or prerender this page.
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata = {
  title: "Automation Intelligence demo",
};

function Row({ label, value }: { label: string; value: unknown }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <tr>
      <th style={{ textAlign: "left", paddingRight: 16 }}>{label}</th>
      <td>{String(value)}</td>
    </tr>
  );
}

function Json({ value }: { value: unknown }) {
  return (
    <pre className={styles.data} style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function Result({
  analysis,
  ipSource,
}: {
  analysis: AnalysisResult;
  ipSource?: string;
}) {
  if (analysis.kind === "skipped") {
    return (
      <p id="ai-error">
        Analysis skipped ({analysis.reason}): {analysis.message}
      </p>
    );
  }

  if (analysis.kind === "error") {
    return (
      <div id="ai-error">
        <p>
          Analysis failed
          {analysis.status ? ` (HTTP ${analysis.status}` : ""}
          {analysis.code ? `, ${analysis.code}` : ""}
          {analysis.status ? ")" : ""}: {analysis.message}
        </p>
        <p>API base URL: {analysis.baseUrl}</p>
      </div>
    );
  }

  const r = analysis.response;
  const ips = [r.ip_info?.v4, r.ip_info?.v6].filter(Boolean);

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: "left", paddingRight: 16 }}>Event ID</th>
            <td id="ai-event-id">{r.event_id}</td>
          </tr>
          <Row label="Source" value={r.source} />
          <Row label="API base URL" value={analysis.baseUrl} />
        </tbody>
      </table>

      <h3>Bot detection</h3>
      {r.bot_info ? (
        <table id="ai-bot-info">
          <tbody>
            <Row label="Category" value={r.bot_info.category} />
            <Row label="Provider" value={r.bot_info.provider} />
            <Row label="Name" value={r.bot_info.name} />
            <Row label="Identity" value={r.bot_info.identity} />
            <Row label="Confidence" value={r.bot_info.confidence} />
          </tbody>
        </table>
      ) : (
        <p id="ai-no-bot">No bot detected.</p>
      )}

      <h3>IP intelligence</h3>
      <div id="ai-ip-info">
        {ips.length === 0 && <p>No IP information returned.</p>}
        {ips.map((ip) => (
          <table key={ip!.address}>
            <tbody>
              <Row label="Address" value={ip!.address} />
              <Row label="ASN" value={ip!.asn} />
              <Row label="ASN name" value={ip!.asn_name} />
              <Row label="ASN type" value={ip!.asn_type} />
              <Row label="Data center" value={ip!.datacenter_result} />
              <Row label="Data center name" value={ip!.datacenter_name} />
              <Row
                label="Country"
                value={
                  (ip!.geolocation as { country_name?: string } | undefined)
                    ?.country_name
                }
              />
              <Row
                label="City"
                value={
                  (ip!.geolocation as { city_name?: string } | undefined)
                    ?.city_name
                }
              />
            </tbody>
          </table>
        ))}
      </div>

      <h3>Proxy</h3>
      <table id="ai-proxy">
        <tbody>
          <Row label="Proxy" value={r.proxy} />
          <Row label="Confidence" value={r.proxy_confidence} />
          <Row
            label="Type"
            value={(r.proxy_details as { proxy_type?: string } | undefined)?.proxy_type}
          />
          <Row
            label="Provider"
            value={(r.proxy_details as { provider?: string } | undefined)?.provider}
          />
        </tbody>
      </table>

      <h3>VPN</h3>
      <table id="ai-vpn">
        <tbody>
          <Row label="VPN" value={r.vpn} />
          <Row label="Confidence" value={r.vpn_confidence} />
        </tbody>
      </table>

      <h3>Raw response</h3>
      <div id="ai-raw">
        <Json value={analysis.raw} />
      </div>
    </>
  );
}

export default async function AutomationIntelligencePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const requestHeaders = await headers();
  const getHeader = (name: string) => requestHeaders.get(name);

  const agentLabel = parseAgentLabel(query.agent);
  const linkedId = randomUUID();

  const client = resolveClientIp(getHeader);

  let analysis: AnalysisResult;
  if (!client) {
    analysis = {
      kind: "skipped",
      reason: "client_ip_unknown",
      message: "The client IP address could not be determined from the request.",
    };
  } else {
    analysis = await callEdgeApi({
      secretKey: process.env.FINGERPRINT_SECRET_API_KEY,
      region: process.env.FINGERPRINT_REGION,
      body: buildEdgeRequestBody({
        headers: requestHeaders.entries(),
        method: "GET",
        url: buildPageUrl(getHeader, query),
        ip: client.ip,
        linkedId,
        agentLabel,
      }),
    });
  }

  return (
    <div className={styles.container}>
      <h1>Automation Intelligence demo</h1>
      <p>
        This page sends every visit it receives to Fingerprint&apos;s
        Automation Intelligence API and shows the detection result below.
      </p>

      <hr />

      <h2>Automation Intelligence result for this request</h2>
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: "left", paddingRight: 16 }}>Linked ID</th>
            <td id="ai-linked-id">{linkedId}</td>
          </tr>
          {agentLabel && (
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>Agent label</th>
              <td id="ai-agent-label">{agentLabel}</td>
            </tr>
          )}
          {client && (
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>
                Client IP source
              </th>
              <td id="ai-ip-source">{client.source}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Result analysis={analysis} ipSource={client?.source} />
    </div>
  );
}
