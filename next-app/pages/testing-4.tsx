import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_TESTING_4, CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_TESTING_4, FINGERPRINT_PUBLIC_API_KEY_TESTING_4 } from "../shared/constants";

export default function TestingAutomatic() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

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
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_TESTING_4,
        scriptUrlPattern:
        CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_TESTING_4,
        endpoint:CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_TESTING_4,
        remoteControlDetection: true,
      });
      const fp = await fpPromise;
      const data = await fp.get({ extendedResult: true });
      setFingerprintData(data);

      // Check if any query parameters are present
      const queryParams = getQueryParams();
      if (Object.keys(queryParams).length > 0 && typeof data === 'object' && data !== null) {
        // Create JSON object with query parameters and fingerprint data
        const resultData = {
          ...queryParams,
          requestId: data.requestId,
          visitorId: data.visitorId
        };
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      {fingerprintData ? (
        <pre className={styles.data}>
          {typeof fingerprintData === 'object' && fingerprintData !== null ? (
            <>
              Request ID: {fingerprintData.requestId}
              {'\n'}
              Visitor ID: {fingerprintData.visitorId}
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
