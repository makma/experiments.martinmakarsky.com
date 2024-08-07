import styles from "../styles/Home.module.css";
import { useState } from "react";
import {
  CacheLocation,
  useVisitorData,
} from "@fingerprintjs/fingerprintjs-pro-react";
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
      cacheLocation={CacheLocation.SessionStorage}
      cacheTimeInSeconds={60}
    >
      <FingerprintData />
    </FpjsProvider>
  );
}

const FingerprintData: NextPage = () => {
  const [extendedResult, setExtendedResult] = useState(true);
  const [ignoreCache, setIgnoreCache] = useState(true);
  const [exposeComponents, setExposeComponents] = useState(false);

  const { isLoading, error, data, getData } = useVisitorData(
    {
      extendedResult,
      // @ts-ignore
      exposeComponents,
      linkedId: "someRandomLinkedId",
    },
    { immediate: true }
  );

  const reloadData = () => {
    getData({ ignoreCache });
  };

  const onChangeExtendedResult = (e: any) => {
    setExtendedResult(e.target.checked);
  };

  const onChangeExposeComponents = (e: any) => {
    setExposeComponents(e.target.checked);
  };

  const onChangeIgnoreCache = (e: any) => {
    setIgnoreCache(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <h1>FingerprintJS Pro NextJS Demo</h1>
      <div className={styles.testArea}>
        <div className={styles.controls}>
          <button onClick={reloadData} type="button">
            Reload data
          </button>
          <div>
            <label>
              <input
                type="checkbox"
                onChange={onChangeExtendedResult}
                checked={extendedResult}
              />
              Extended result
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                onChange={onChangeExposeComponents}
                checked={exposeComponents}
              />
              Expose components
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                onChange={onChangeIgnoreCache}
                checked={ignoreCache}
              />
              Ignore cache - CacheLocation.SessionStorage cacheTimeInSeconds=60
            </label>
          </div>

          <h4>
            VisitorId:{" "}
            <span className={styles.visitorId}>
              {isLoading ? "Loading..." : data?.visitorId}
            </span>
          </h4>
          <h4>Full visitor data:</h4>
          {data ? (
            <pre className={styles.data}>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <h3>Waiting or data...</h3>
          )}
        </div>
      </div>
    </div>
  );
};
