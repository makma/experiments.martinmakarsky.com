import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import * as OnDemand from "@experiments/on-demand-identification"
import { FINGERPRINT_PUBLIC_API_KEY } from "../shared/constants";

export default function FingerprintOnDemandIdentification() {
  const [fingerprintData, setFingerprintData] = useState<
    any | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = OnDemand.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        region: "eu",
        modules: [
          OnDemand.makeIdentificationModule(), 
          OnDemand.makeBotdModule(),
          OnDemand.makeLatencyReportModule(),
        ],
      });
      const fp = await fpPromise;
      try {
        const browserData = await fp.collect();
        const response = await fetch('/api/on-demand-identification-collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ browserData })
        });
        const result = await response.json();
        setFingerprintData(result.response.agentData);
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      {fingerprintData ? (
        <pre className={styles.data}>
          {JSON.stringify(fingerprintData, null, 2)}
        </pre>
      ) : (
        <h3>Waiting or data...</h3>
      )}
    </div>
  );
}
