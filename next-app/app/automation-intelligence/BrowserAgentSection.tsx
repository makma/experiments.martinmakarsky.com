"use client";

import { useEffect, useState } from "react";
import * as Fingerprint from "@fingerprint/agent";
import styles from "../../styles/Home.module.css";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../../shared/constants";
import { EventDetail, SmartSignals } from "./SmartSignals";

type AgentState =
  | { kind: "loading" }
  | { kind: "ok"; eventId: string; visitorId?: string }
  | { kind: "error"; message: string };

export function BrowserAgentSection() {
  const [agent, setAgent] = useState<AgentState>({ kind: "loading" });
  const [detail, setDetail] = useState<EventDetail>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let eventId: string | undefined;
      try {
        const fp = Fingerprint.start({
          apiKey: FINGERPRINT_PUBLIC_API_KEY,
          endpoints: CUSTOM_SUBDOMAIN,
        });
        const result = await fp.get();
        if (cancelled) return;

        if (!result.event_id) {
          setAgent({ kind: "error", message: "The agent did not return an event_id." });
          return;
        }
        eventId = result.event_id;
        setAgent({ kind: "ok", eventId: result.event_id, visitorId: result.visitor_id });
      } catch (e) {
        if (!cancelled) {
          setAgent({
            kind: "error",
            message: e instanceof Error ? e.message : String(e),
          });
        }
        return;
      }

      if (!eventId) return;

      try {
        const response = await fetch(
          `/api/automation-intelligence/event?eventId=${encodeURIComponent(eventId)}`
        );
        const body = await response.json();
        if (cancelled) return;

        if (!response.ok) {
          setDetail({ kind: "error", message: body.error ?? "Server API lookup failed." });
          return;
        }
        setDetail({ kind: "ok", event: body.event });
      } catch (e) {
        if (!cancelled) {
          setDetail({
            kind: "error",
            message: e instanceof Error ? e.message : String(e),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id="agent-section">
      {agent.kind === "loading" && <p id="agent-no-result">Waiting for the browser agent...</p>}
      {agent.kind === "error" && (
        <p id="agent-no-result">No result available: {agent.message}</p>
      )}
      {agent.kind === "ok" && (
        <table>
          <tbody>
            <tr>
              <th style={{ textAlign: "left", paddingRight: 16 }}>Event ID</th>
              <td id="agent-event-id">{agent.eventId}</td>
            </tr>
            {agent.visitorId && (
              <tr>
                <th style={{ textAlign: "left", paddingRight: 16 }}>Visitor ID</th>
                <td>{agent.visitorId}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {agent.kind === "ok" && (
        <>
          <h3>Server API detail (Smart Signals)</h3>
          <SmartSignals detail={detail} />
        </>
      )}

      <h3>Raw agent result</h3>
      <pre className={styles.data} style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(agent, null, 2)}
      </pre>
    </div>
  );
}
