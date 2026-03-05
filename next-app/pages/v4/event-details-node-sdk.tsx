import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import * as Fingerprint from "@fingerprint/agent";
import type { GetResult } from "@fingerprint/agent";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../../shared/constants";

type EventDetails = {
  event_id: string;
  visitor_id?: string;
  url?: string;
  ip_address?: string;
  [key: string]: any;
};

export default function EventDetailsNodeSdkPage() {
  const [agentResult, setAgentResult] = useState<GetResult | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fp = Fingerprint.start({
          apiKey: FINGERPRINT_PUBLIC_API_KEY,
          endpoints: CUSTOM_SUBDOMAIN,
        });

        const result = await fp.get();
        setAgentResult(result);

        if (!result.event_id) {
          setError("Agent v4 did not return an event_id.");
          return;
        }

        setLoadingEvent(true);
        const response = await fetch(
          `/api/v4/event-details?eventId=${encodeURIComponent(result.event_id)}`,
        );

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || `Failed to fetch event details`);
        }

        const json = await response.json();
        setEventDetails(json.event);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoadingEvent(false);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Agent v4 + Node SDK event details</h1>

      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>
          Error: {error}
        </p>
      )}

      <section style={{ marginBottom: 24 }}>
        <h2>Client-side agent result</h2>
        {agentResult ? (
          <pre className={styles.data}>
            Event ID: {agentResult.event_id}
            {"\n"}
            Visitor ID: {agentResult.visitor_id ?? ""}
          </pre>
        ) : (
          <h3>Waiting for agent data...</h3>
        )}
      </section>

      <section>
        <h2>Server-side event details (Node SDK v7)</h2>
        {loadingEvent && <h3>Loading event details...</h3>}
        {eventDetails && (
          <pre className={styles.data}>
            {JSON.stringify(eventDetails, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}

