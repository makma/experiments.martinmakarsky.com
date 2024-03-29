import styles from "../styles/Home.module.css";
import { useState } from "react";
import {
  CacheLocation,
  useVisitorData,
  FpjsProvider,
} from "@fingerprintjs/fingerprintjs-pro-react";
import * as FingerprintJS from "@fingerprintjs/fingerprintjs-pro-static";
import { Product } from "@fingerprintjs/fingerprintjs-pro-static";
import { NextPage } from "next";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

export default function FingerprintProReactPackageStaticAgent() {
  const modules = globalThis.hasOwnProperty("document")
    ? [
        FingerprintJS.makeIdentificationModule(), // If you use identification
        FingerprintJS.makeBotdModule(), // If you use bot detection
        FingerprintJS.makeLatencyReportModule(), // For performance monitoring
      ]
    : [];

  return (
    <FpjsProvider
      loadOptions={{
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        endpoint: CUSTOM_SUBDOMAIN,
        // @ts-ignore
        modules: modules,
      }}
      // @ts-ignore
      customAgent={FingerprintJS}
      cacheLocation={CacheLocation.SessionStorage}
      cacheTimeInSeconds={60}
    >
      <FingerprintData />
    </FpjsProvider>
  );
}

const FingerprintData: NextPage = () => {
  const [extendedResult, setExtendedResult] = useState(true);
  const [addBotdProduct, setAddBotdProduct] = useState(true);
  const [addIdentificationProduct, setIdentificationProduct] = useState(true);
  const [ignoreCache, setIgnoreCache] = useState(true);

  let products: Array<Product> = [];
  if (addBotdProduct) {
    products.push("botd");
  }

  if (addIdentificationProduct) {
    products.push("identification");
  }

  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult, products, linkedId: "someRandomLinkedId" },
    { immediate: true }
  );

  const reloadData = () => {
    getData({ ignoreCache });
  };

  const onChangeExtendedResult = (e: any) => {
    setExtendedResult(e.target.checked);
  };

  const onChangeBotdOnly = (e: any) => {
    setAddBotdProduct(e.target.checked);
  };

  const onChangeIdentificationOnly = (e: any) => {
    setIdentificationProduct(e.target.checked);
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
                onChange={onChangeBotdOnly}
                checked={addBotdProduct}
              />
              Add BotD Product (if no product added, all products are enabled)
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                onChange={onChangeIdentificationOnly}
                checked={addIdentificationProduct}
              />
              Add Identification product (if no product added, all products are
              enabled)
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
