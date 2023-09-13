import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import * as FingerprintJS from "@fingerprintjs/fingerprintjs-pro-static";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

export default function FingerprintProBotdVanillaAgent() {
  const [fingerprintData, setFingerprintData] = useState<GetResult | string>(
    "Waiting for data..."
  );

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        region: "eu",
        endpoint: CUSTOM_SUBDOMAIN,
        modules: [
          FingerprintJS.makeIdentificationModule(), // If you use identification
          FingerprintJS.makeBotdModule(), // If you use bot detection
          FingerprintJS.makeLatencyReportModule(), // For performance monitoring
        ],
      });
      const fp = await fpPromise;
      const data = await fp.get({ extendedResult: true });
      setFingerprintData(data);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <pre className={styles.data}>
        {JSON.stringify(fingerprintData, null, 2)}
      </pre>
    </div>
  );
}
