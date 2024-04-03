import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT, CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN, FINGERPRINT_PUBLIC_API_KEY } from "../shared/constants";

export default function FingerprintProCloudflare() {
  const [fingerprintIdentificationAPIData, setFingerprintIdentificationAPIData] = useState<
    GetResult | null
  >(null);

  const [fingerprintServerAPIData, setFingerprintServerAPIData] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      if (!fingerprintIdentificationAPIData) {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        scriptUrlPattern:
        CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN,
        endpoint:CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT,
      });
      const fp = await fpPromise;
      const data = await fp.get({ extendedResult: true });
      setFingerprintIdentificationAPIData(data);
    }

    if (!fingerprintServerAPIData && fingerprintIdentificationAPIData) {
      const response = await fetch(`/api/events?requestId=${fingerprintIdentificationAPIData.requestId}`, {
        method: "GET",
      });
      setFingerprintServerAPIData(await response.json());
    }
    })();
  }, [fingerprintIdentificationAPIData, fingerprintServerAPIData]);

  return (
    <div className={styles.container}>
      <h2>Identification API data</h2>
      {fingerprintIdentificationAPIData ? (
        <pre className={styles.data}>
          {JSON.stringify(fingerprintIdentificationAPIData, null, 2)}
        </pre>
      ) : (
        <h3>Waiting for Identification API data...</h3>
      )}

     <h2>Server API data</h2>
     {fingerprintServerAPIData ? (
        <pre id="server-api-response" className={styles.data}>
          {JSON.stringify(fingerprintServerAPIData, null, 2)}
        </pre>
      ) : (
        <h3>Waiting for Server API data...</h3>
      )}
    </div>
  );
}
