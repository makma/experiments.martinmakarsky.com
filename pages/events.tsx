import {
  FingerprintJsServerApiClient,
  Region,
} from "@fingerprintjs/fingerprintjs-pro-server-api";

export const config = {
  runtime: "experimental-edge",
};

function Events({ content }: { content: string }) {
  return <pre>{content}</pre>;
}

async function getEvent(requestId: string) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? "";

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
    // @ts-ignore missing isRedirect property
    fetch: fetch.bind(globalThis),
  });

  const event = await client.getEvent(requestId);
  return event;
}

export async function getServerSideProps(context: any) {
  const requestId = context.query.requestId;
  if (!context.query.requestId) {
    return { props: { content: "requestId query param must to be provided" } };
  }

  const event = await getEvent(requestId);

  return {
    props: { content: JSON.stringify(event, null, 2) },
  };
}

export default Events;
