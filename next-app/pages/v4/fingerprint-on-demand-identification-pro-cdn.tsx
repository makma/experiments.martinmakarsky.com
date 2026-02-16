import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import * as Fingerprint from '@fingerprint/agent'
import { FWALL_ENVIRONEMNT_PUBLIC_KEY } from "../../shared/constants";

export default function FingerprintOnDemandIdentification() {
  const [fingerprintData, setFingerprintData] = useState<
    any | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fp = Fingerprint.start({
        apiKey: FWALL_ENVIRONEMNT_PUBLIC_KEY,
        region: "eu"
      });
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
        console.log('Response data:', result.response); // Debug log
        
        // First set the data
        setFingerprintData(result.response.rawFpResponse);
        
        // Then handle the data with OnDemand
        try {
          // Make sure we're passing the correct format
          const agentData = result.response.rawFpResponse.agentData;
          if (!agentData) {
            throw new Error('No agent data received');
          }
          // @ts-ignore - handleAgentData method exists at runtime
          Fingerprint.handleAgentData(agentData);
        } catch (handleError) {
          console.error('Error handling OnDemand data:', handleError);
          console.error('Agent Data that caused error:', result.response.rawFpResponse.agentData);
        }
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
