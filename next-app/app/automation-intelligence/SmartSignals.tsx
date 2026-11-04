import styles from "../../styles/Home.module.css";

export type EventDetail =
  | { kind: "loading" }
  | { kind: "ok"; event: unknown }
  | { kind: "error"; message: string };

// The Server API "get event" response has two different shapes depending on
// the event's source (confirmed against the live API and
// https://docs.fingerprint.com/reference/server-api-get-event):
// - "device" (JS Agent / mobile SDK): each Smart Signal nested under
//   products.<signal>.data.
// - "edge" (Automation Intelligence, POST /v4/edge): flat top-level fields,
//   the same shape as EdgeResponse in edge-api.ts.
type DeviceEvent = {
  products?: {
    identification?: { data?: { visitorId?: string; confidence?: { score?: number } } };
    botd?: { data?: { bot?: { result?: string; type?: string } } };
    ipInfo?: { data?: { v4?: { address?: string }; v6?: { address?: string } } };
    proxy?: { data?: { result?: boolean; confidence?: string } };
    vpn?: { data?: { result?: boolean; confidence?: string } };
    suspectScore?: { data?: { result?: number } };
    incognito?: { data?: { result?: boolean } };
    tampering?: { data?: { result?: boolean } };
  };
};

type EdgeEvent = {
  bot_info?: { category?: string; provider?: string; name?: string; confidence?: string };
  ip_info?: { v4?: { address?: string }; v6?: { address?: string } };
  proxy?: boolean;
  proxy_confidence?: string;
  vpn?: boolean;
  vpn_confidence?: string;
};

type Signals = {
  visitorId?: string;
  identificationConfidence?: number;
  bot?: string;
  botType?: string;
  botCategory?: string;
  botProvider?: string;
  botName?: string;
  ip?: string;
  proxy?: boolean;
  proxyConfidence?: string;
  vpn?: boolean;
  vpnConfidence?: string;
  suspectScore?: number;
  incognito?: boolean;
  tampering?: boolean;
};

function normalize(event: unknown): Signals {
  const products = (event as DeviceEvent)?.products;
  if (products) {
    return {
      visitorId: products.identification?.data?.visitorId,
      identificationConfidence: products.identification?.data?.confidence?.score,
      bot: products.botd?.data?.bot?.result,
      botType: products.botd?.data?.bot?.type,
      ip: products.ipInfo?.data?.v4?.address ?? products.ipInfo?.data?.v6?.address,
      proxy: products.proxy?.data?.result,
      proxyConfidence: products.proxy?.data?.confidence,
      vpn: products.vpn?.data?.result,
      vpnConfidence: products.vpn?.data?.confidence,
      suspectScore: products.suspectScore?.data?.result,
      incognito: products.incognito?.data?.result,
      tampering: products.tampering?.data?.result,
    };
  }

  const e = event as EdgeEvent;
  return {
    botCategory: e?.bot_info?.category,
    botProvider: e?.bot_info?.provider,
    botName: e?.bot_info?.name,
    ip: e?.ip_info?.v4?.address ?? e?.ip_info?.v6?.address,
    proxy: e?.proxy,
    proxyConfidence: e?.proxy_confidence,
    vpn: e?.vpn,
    vpnConfidence: e?.vpn_confidence,
  };
}

function Row({ label, value }: { label: string; value: unknown }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <tr>
      <th style={{ textAlign: "left", paddingRight: 16 }}>{label}</th>
      <td>{String(value)}</td>
    </tr>
  );
}

// Renders only the fields present in a Server API "get event" response.
// Automation Intelligence (edge) events and JS Agent identification events
// are different sources with different response shapes (see normalize
// above), so this never assumes a given field is present.
export function SmartSignals({ detail }: { detail: EventDetail }) {
  if (detail.kind === "loading") {
    return <p>Loading Server API detail...</p>;
  }

  if (detail.kind === "error") {
    return <p>Server API lookup failed: {detail.message}</p>;
  }

  const s = normalize(detail.event);

  return (
    <>
      <table>
        <tbody>
          <Row label="Visitor ID" value={s.visitorId} />
          <Row label="Identification confidence" value={s.identificationConfidence} />
          <Row label="Bot" value={s.bot} />
          <Row label="Bot type" value={s.botType} />
          <Row label="Bot category" value={s.botCategory} />
          <Row label="Bot provider" value={s.botProvider} />
          <Row label="Bot name" value={s.botName} />
          <Row label="IP address" value={s.ip} />
          <Row label="Proxy" value={s.proxy} />
          <Row label="Proxy confidence" value={s.proxyConfidence} />
          <Row label="VPN" value={s.vpn} />
          <Row label="VPN confidence" value={s.vpnConfidence} />
          <Row label="Suspect score" value={s.suspectScore} />
          <Row label="Incognito" value={s.incognito} />
          <Row label="Tampering" value={s.tampering} />
        </tbody>
      </table>

      <pre className={styles.data} style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(detail.event, null, 2)}
      </pre>
    </>
  );
}
