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
        scriptUrlPattern:
          "https://martinmakarsky.com/bbcuwo8w03s36c1s/rmcqnpn7451zig6d?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>", // ADDED (as is)
        endpoint:
          "https://martinmakarsky.com/bbcuwo8w03s36c1s/ottv9o457h973r88?region=eu", // CHANGED
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
