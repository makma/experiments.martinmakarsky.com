"use client";

import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS } from "../../shared/constants";

export default function FingerprintSealedResultsDirect() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS,
      });
      const fp = await fpPromise;
      const data = await fp.get();
      console.log(JSON.stringify(data));
      setFingerprintData(data);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Sealed data returned from the Fingerprint server</h1>
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
