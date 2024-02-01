"use client";

import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS } from "../../shared/constants";

export default function FingerprintSealedResultsDirect() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);
  const [unsealedData, setUnsealedData] = useState<
    GetResult | string | null | any
  >(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS,
      });
      const fp = await fpPromise;
      const data = await fp.get();
      setFingerprintData(data);
    })();
  }, []);

  async function getSentUnsealedResultsRequest(method: "custom" | "node") {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`/sealed-results-direct/unseal?method=${method}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(fingerprintData),
    });
    setUnsealedData(await response.json());
  }

  return (
    <div className={styles.container}>
      <h2>Sealed data returned from the Fingerprint server</h2>
      {fingerprintData ? (
        <pre id="sealed" className={styles.data}>
          {JSON.stringify(fingerprintData, null, 2)}
        </pre>
      ) : (
        <h3>Waiting or data...</h3>
      )}
      <h2>
        Unsealed data returned from the custom backend deciphered using the
        Encryption Key
      </h2>
      {unsealedData ? (
        <pre id="unsealed" className={styles.data}>
          {JSON.stringify(unsealedData, null, 2)}
        </pre>
      ) : (
        <>
        <button className={styles.button} onClick={() => { getSentUnsealedResultsRequest('custom') }}>
          Get the unsealed result from the Server via custom unsealment
        </button>
        <button className={styles.button} onClick={() => { getSentUnsealedResultsRequest('node') }}>
          Get the unsealed result from the Server via Node SDK unsealement
        </button>
        </>
      )}
    </div>
  );
}
