import styles from "../../styles/Home.module.css";
import { FingerprintProvider, useVisitorData } from "@fingerprint/react";
import {
  CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../../shared/constants";

function VisitorData() {
  const { isLoading, error, data } = useVisitorData({ immediate: true });

  if (isLoading) return <h3>Waiting for data...</h3>;
  if (error) return <p style={{ color: "red", marginTop: 16 }}>Error: {error.message}</p>;

  return (
    <>
      <h4>event_id: {data?.event_id}</h4>
      <h4>visitor_id: {data?.visitor_id}</h4>
      <h4>Full result:</h4>
      <pre className={styles.data}>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default function FingerprintProCloudflareReactApiV4() {
  return (
    <FingerprintProvider
      apiKey={FINGERPRINT_PUBLIC_API_KEY}
      endpoints={CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT}
      region="eu"
    >
      <div className={styles.container}>
        <h1>Cloudflare proxy integration — React SDK, API v4</h1>
        <VisitorData />
      </div>
    </FingerprintProvider>
  );
}
