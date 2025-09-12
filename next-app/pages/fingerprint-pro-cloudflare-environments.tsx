import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";

export default function FingerprintProCloudflare() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: `4T3PxKLfSHpGmiwIKOdv`,
        scriptUrlPattern: "https://martinmakarsky.com/5tsyJElwuNfHFquS/wE6P5yOIb7cB5MqU?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
        endpoint: "https://martinmakarsky.com/5tsyJElwuNfHFquS/9pzULNzJiSo5ozjI?region=eu",
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
