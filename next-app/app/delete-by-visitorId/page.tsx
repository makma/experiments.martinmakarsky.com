"use client";

import styles from "../../styles/Home.module.css";
import { useState } from "react";

export default function FingerprintSealedResultsDirect() {
  const [visitorIdToDelete, setVisitorIdToDelete] = useState<null | string>(
    null
  );
  const [deletionSecret, setDeletionSecret] = useState<null | string>(
    null
  );
  const [deletionResult, setDeletionResult] = useState<null | string>(null);

  async function deleteDataByVisitorId() {
    if (visitorIdToDelete) {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(`/delete-by-visitorId/delete`, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({ visitorIdToDelete, deletionSecret }),
      });
      setDeletionResult(await response.json());
    }
  }

  return (
    <div className={styles.container}>
      <h2>VisitorId to delete:</h2>
      <input
        type="string"
        onChange={(e) => setVisitorIdToDelete(e.target.value)}
      ></input>
      <h2>Deletion secret:</h2>
      <input
        type="string"
        onChange={(e) => setDeletionSecret(e.target.value)}
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
