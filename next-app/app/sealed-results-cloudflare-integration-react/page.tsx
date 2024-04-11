"use client";

import styles from "../../styles/Home.module.css";
import { useState } from "react";
import {
  CacheLocation,
  useVisitorData,
} from "@fingerprintjs/fingerprintjs-pro-react";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { NextPage } from "next";
import { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS } from "../../shared/constants";

export default function FingerprintSealedResultsCloudflareReact() {
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS,
        scriptUrlPattern:
          "https://martinmakarsky.com/YNSLCFNUWAU4p7X8/aRWhfTmpOtukFzWC?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>",
        endpoint:
          "https://martinmakarsky.com/YNSLCFNUWAU4p7X8/pcdSSztwo0Fpgbxt?region=eu",
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
  const [unsealedData, setUnsealedData] = useState<
    GetResult | string | null | any
  >(null);


  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult, linkedId: "someRandomLinkedId" },
    { immediate: true }
  );

  const reloadData = () => {
    getData({ ignoreCache });
  };

  const onChangeExtendedResult = (e: any) => {
    setExtendedResult(e.target.checked);
  };

  const onChangeIgnoreCache = (e: any) => {
    setIgnoreCache(e.target.checked);
  };

  async function getSentUnsealedResultsRequest(method: "custom" | "node") {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`/sealed-results-direct/unseal?method=${method}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    setUnsealedData(await response.json());
  }

  return (
    <div className={styles.container}>
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
                onChange={onChangeIgnoreCache}
                checked={ignoreCache}
              />
              Ignore cache - CacheLocation.SessionStorage cacheTimeInSeconds=60
            </label>
          </div>
          <h2>Sealed data returned from the Fingerprint server</h2>
          {data ? (
            <pre id="sealed" className={styles.data}>
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <h3>Waiting or data...</h3>
          )}
        </div>
      </div>
      <h2>
        Unsealed data returned from the custom backend deciphered using the
        Encryption Key
      </h2>
      {unsealedData ? (
        <pre id="unsealed" className={styles.data}>
          {JSON.stringify(unsealedData, null, 2)}
        </pre>
      ) : (
        <>
        <button className={styles.button} onClick={() => { getSentUnsealedResultsRequest('custom') }}>
          Get the unsealed result from the Server via custom unsealment
        </button>
        <button className={styles.button} onClick={() => { getSentUnsealedResultsRequest('node') }}>
          Get the unsealed result from the Server via Node SDK unsealement
        </button>
        </>
      )}
    </div>
  );
};
