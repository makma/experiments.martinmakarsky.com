import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { NextPage } from "next";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

export default function FingerprintProReactPackage() {
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        endpoint: CUSTOM_SUBDOMAIN,
      }}
    >
      <FingerprintData />
    </FpjsProvider>
  );
}

const FingerprintData: NextPage = () => {
  const [extendedResult, updateExtendedResult] = useState(false);
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult },
    { immediate: true }
  );

  const reloadData = () => {
    // @ts-ignore
    getData({ ignoreCache: true });
  };

  const onChangeExtendedResult = (e: any) => {
    updateExtendedResult(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <h1>FingerprintJS Pro NextJS Demo</h1>
      <div className={styles.testArea}>
        <div className={styles.controls}>
          <button onClick={reloadData} type="button">
            Reload data
          </button>
          <label>
            <input
              type="checkbox"
              onChange={onChangeExtendedResult}
              checked={extendedResult}
            />
            Extended result
          </label>
        </div>
        <h4>
          VisitorId:{" "}
          <span className={styles.visitorId}>
            {isLoading ? "Loading..." : data?.visitorId}
          </span>
        </h4>
        <h4>Full visitor data:</h4>
        <pre className={styles.data}>
          {error ? error.message : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};
