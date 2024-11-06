import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { OPEN_CLIENT_RESPONSE_PUBLIC_API_KEY } from "../shared/constants";

export default function FingerprintProFastlyComputeEdge() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: OPEN_CLIENT_RESPONSE_PUBLIC_API_KEY,
        scriptUrlPattern:
          "https://fastly-compute-proxy-integration.martinmakarsky.com/download-path?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
        endpoint:
          "https://fastly-compute-proxy-integration.martinmakarsky.com/get-result-path",
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
