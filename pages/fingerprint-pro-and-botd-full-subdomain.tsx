import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, {
  GetResult,
  defaultEndpoint,
  defaultScriptUrlPattern,
} from "@fingerprintjs/fingerprintjs-pro";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

export default function FingerprintProBotdVanillaAgentFullSubdomain() {
  const [fingerprintData, setFingerprintData] = useState<GetResult | string>(
    "Waiting for data..."
  );

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        endpoint: [CUSTOM_SUBDOMAIN, defaultEndpoint],
        scriptUrlPattern: [
          "https://fp.martinmakarsky.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js",
          defaultScriptUrlPattern,
        ],
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
