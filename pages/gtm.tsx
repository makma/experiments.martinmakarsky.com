import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function BotDOnly() {
  const [fingerprintData, setFingerprintData] = useState<string>(
    "Waiting for data..."
  );

  useEffect(() => {
    setTimeout(() => {
      (window as any).dataLayer.push(function () {
        if (this.get("FingerprintJSProResult")) {
          const result = this.get("FingerprintJSProResult");
          setFingerprintData(result);
        } else {
          setFingerprintData(
            "No data within 3 seconds, try to refresh the page"
          );
        }
      });
    }, 3000);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MT696G5M');`,
          }}
        />
      </Head>
      <h1>Fingerprint Pro data in from the DataLayer</h1>
      <pre className={styles.data}>
        {JSON.stringify(fingerprintData, null, 2)}
      </pre>
    </div>
  );
}
