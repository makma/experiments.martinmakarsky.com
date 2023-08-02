import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY } from "../shared/constants";

export default function FingerprintProCloudflare() {
  const [fingerprintData, setFingerprintData] = useState<GetResult | string>(
    "Waiting for data..."
  );

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY, // REPLACE <API_KEY>,
        tlsEndpoint: 'https://euc1-warden-rc.fpjs.io',
        scriptUrlPattern:
          "https://martinmakarsky.com/VCwk5AbVKHxWeFtV/TSTNqkwF5uIl9Jpw?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>", // ADDED (as is)
        endpoint:
          "https://martinmakarsky.com/VCwk5AbVKHxWeFtV/EottbWHVCphdNjA2?region=eu", // CHANGED
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
