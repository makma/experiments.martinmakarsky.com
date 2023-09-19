import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import {
  FpjsClient,
  CacheLocation,
  GetResult,
} from "@fingerprintjs/fingerprintjs-pro-spa";
import * as FingerprintJS from "@fingerprintjs/fingerprintjs-pro-static";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

export default function FingerprintProSpaPackageStaticAgent() {
  const [fingerprintData, setFingerprintData] = useState<GetResult | string>(
    "Waiting for data..."
  );

  useEffect(() => {
    (async () => {
      const modules = globalThis.hasOwnProperty("document")
        ? [
            FingerprintJS.makeIdentificationModule(), // If you use identification
            FingerprintJS.makeBotdModule(), // If you use bot detection
            FingerprintJS.makeLatencyReportModule(), // For performance monitoring
          ]
        : [];

      const fpjsClient = new FpjsClient({
        loadOptions: {
          apiKey: FINGERPRINT_PUBLIC_API_KEY,
          endpoint: CUSTOM_SUBDOMAIN,
          // @ts-ignore
          modules: modules,
        },
        cacheLocation: CacheLocation.LocalStorage,
        customAgent: FingerprintJS,
      });

      try {
        console.log("calling");
        await fpjsClient.init();
        const visitorData = await fpjsClient.getVisitorData({
          extendedResult: true,
        });

        setFingerprintData(visitorData);
      } catch (e) {
        setFingerprintData(e);
      }
    })();
  }, []);

  return (
    <pre className={styles.data}>
      {JSON.stringify(fingerprintData, null, 2)}
    </pre>
  );
}
