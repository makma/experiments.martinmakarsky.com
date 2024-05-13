import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY_STAGING } from "../shared/constants";

export default function FingerprintProCloudflare() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_STAGING,
        scriptUrlPattern: "https://martinmakarsky.com/yunpOOULDfCx6KtY/CE5tR2CtpBMJVc0p?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
        endpoint: "https://martinmakarsky.com/yunpOOULDfCx6KtY/IJzT2PyK0HsWInkT",
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
