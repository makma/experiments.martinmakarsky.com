import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY } from "../shared/constants";

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
          "https://martinmakarsky.com/bbcuwo8w03s36c1s/rmcqnpn7451zig6d?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
        endpoint:
          "https://martinmakarsky.com/bbcuwo8w03s36c1s/ottv9o457h973r88?region=eu",
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
        <pre className={styles.data}>
          {JSON.stringify(fingerprintServerAPIData, null, 2)}
        </pre>
      ) : (
        <h3>Waiting for Server API data...</h3>
      )}
    </div>
  );
}
