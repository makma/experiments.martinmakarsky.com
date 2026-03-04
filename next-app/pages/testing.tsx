import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import * as Fingerprint from "@fingerprint/agent";
import type { GetResult } from "@fingerprint/agent";
import {
  CUSTOM_SUBDOMAIN_TESTING,
  FINGERPRINT_PUBLIC_API_KEY_TESTING,
} from "../shared/constants";

export default function TestingAutomatic() {
  const [fingerprintData, setFingerprintData] = useState<GetResult | null>(
    null,
  );

  // Function to parse query string parameters
  const getQueryParams = () => {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    // Serialize all query parameters
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    
    return params;
  };

  useEffect(() => {
    (async () => {
      const fp = Fingerprint.start({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_TESTING,
        endpoints: CUSTOM_SUBDOMAIN_TESTING,
      });
      const data = await fp.get();
      setFingerprintData(data);
    })();
  }, []);

  return (
    <div className={styles.container}>
      {fingerprintData ? (
        <pre className={styles.data}>
          {typeof fingerprintData === "object" && fingerprintData !== null ? (
            <>
              Request ID: {/* v4 uses event_id; keep name for consistency */}
              {" " + (fingerprintData as any).requestId}
              {"\n"}
              Visitor ID: {(fingerprintData as any).visitorId}
            </>
          ) : (
            fingerprintData
          )}
        </pre>
      ) : (
        <h3>Waiting or data...</h3>
      )}
    </div>
  );
}
