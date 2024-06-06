import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import {
  CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_ZERO_TRUST,
  CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_ZERO_TRUST,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

export default function FingerprintProCloudflare() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        scriptUrlPattern:
          CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_ZERO_TRUST,
        endpoint: CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_ZERO_TRUST,
      });
      const fp = await fpPromise;
      const data = await fp.get({ extendedResult: true });
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
