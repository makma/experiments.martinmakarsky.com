import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

export default function BotDOnly() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        endpoint: CUSTOM_SUBDOMAIN,
      });
      const fp = await fpPromise;
      const data = await fp.get({ extendedResult: true, products: ["botd"] });
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
