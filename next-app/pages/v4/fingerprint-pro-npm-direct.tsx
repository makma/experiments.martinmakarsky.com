import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import * as Fingerprint from '@fingerprint/agent'
import { FINGERPRINT_PUBLIC_API_KEY } from "../../shared/constants";

export default function FingerprintProVanillaAgentDirect() {
  const [fingerprintData, setFingerprintData] = useState< any |string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fp = Fingerprint.start({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
      });
      const data = await fp.get({
      });
      setFingerprintData(data);
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

