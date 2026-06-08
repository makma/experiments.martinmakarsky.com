import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import * as Fingerprint from "@fingerprint/agent";
import type { GetResult } from "@fingerprint/agent";
import {
  CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../../shared/constants";

export default function FingerprintProCloudflareApiV4() {
  const [fingerprintData, setFingerprintData] = useState<GetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const fp = Fingerprint.start({
          apiKey: FINGERPRINT_PUBLIC_API_KEY,
          endpoints: Fingerprint.withoutDefault(CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT),
          region: "eu",
        });
        const result = await fp.get();
        setFingerprintData(result);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Cloudflare proxy integration — API v4</h1>

      {error && <p style={{ color: "red", marginTop: 16 }}>Error: {error}</p>}

      {fingerprintData ? (
        <>
          <h4>event_id: {fingerprintData.event_id}</h4>
          <h4>visitor_id: {fingerprintData.visitor_id}</h4>
          <h4>Full result:</h4>
          <pre className={styles.data}>
            {JSON.stringify(fingerprintData, null, 2)}
          </pre>
        </>
      ) : (
        !error && <h3>Waiting for data...</h3>
      )}
    </div>
  );
}
