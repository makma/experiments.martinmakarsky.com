import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_TESTING, CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_TESTING, FINGERPRINT_PUBLIC_API_KEY_TESTING } from "../shared/constants";

export default function TestingAutomatic() {
  const [fingerprintData, setFingerprintData] = useState<
    GetResult | string | null
  >(null);

  // Function to parse query string parameters
  const getQueryParams = () => {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    // Check for the specific parameters we're interested in
    const targetParams = ['os', 'br', 'vpn', 'vm', 'devtools', 'private'];
    
    targetParams.forEach(param => {
      const value = urlParams.get(param);
      if (value !== null) {
        params[param] = value;
      }
    });
    
    return params;
  };

  // Function to download JSON file
  const downloadJSON = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_TESTING,
        scriptUrlPattern:
        CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_TESTING,
        endpoint:CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_TESTING,
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
        
        // Download the JSON file
        downloadJSON(resultData, `results-${data.requestId}.json`);
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
