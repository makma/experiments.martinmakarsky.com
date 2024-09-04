import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT, CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN, FINGERPRINT_PUBLIC_API_KEY } from "../shared/constants";

export default function FingerprintProCloudflare() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        scriptUrlPattern: "https://cloudflare-proxy-integration-manual-via-terraform1.martinmakarsky.com/WORKER_PATH/AGENT_SCRIPT_DOWNLOAD_PATH?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
        endpoint:"https://cloudflare-proxy-integration-manual-via-terraform.martinmakarsky.com/WORKER_PATH/GET_RESULT_PATH?region=eu",
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
