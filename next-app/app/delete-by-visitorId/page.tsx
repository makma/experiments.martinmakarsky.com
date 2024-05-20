"use client";

import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS } from "../../shared/constants";

export default function FingerprintSealedResultsDirect() {
  const [sealedFingerprintData, setSealedFingerprintData] = useState<
    GetResult | string | null
  >(null);
  const [visitorIdToDelete, setVisitorIdToDelete] = useState<null | string>(
    null
  );
  const [deletionResult, setDeletionResult] = useState<null | string>(null);

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS,
      });
      const fp = await fpPromise;
      const data = await fp.get();
      setSealedFingerprintData(data);
    })();
  }, []);

  async function deleteDataByVisitorId() {
    if (sealedFingerprintData && visitorIdToDelete) {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(`/delete-by-visitorId/delete`, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({ sealedFingerprintData, visitorIdToDelete }),
      });
      setDeletionResult(await response.json());
    }
  }

  return (
    <div className={styles.container}>
      <h2>visitorId to delete:</h2>
      <input
        type="string"
        onChange={(e) => setVisitorIdToDelete(e.target.value)}
      ></input>
      <button
        className={styles.button}
        onClick={() => {
          deleteDataByVisitorId();
        }}
      >
        Delete the visitorId
      </button>
      <h2>Result</h2>
      <pre>{JSON.stringify(deletionResult)}</pre>
    </div>
  );
}
