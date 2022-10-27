import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";

export default function BotDOnly() {
  const [fingerprintData, setFingerprintData] = useState<GetResult | string>(
    "Waiting for data..."
  );

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: "tQUwQQOuG9TNwqc6F4I2",
        endpoint: "https://fp.martinmakarsky.com",
      });
      const fp = await fpPromise;
      const data = await fp.get({ extendedResult: true, products: ["botd"] });
      setFingerprintData(data);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <code>{JSON.stringify(fingerprintData)}</code>
    </div>
  );
}
