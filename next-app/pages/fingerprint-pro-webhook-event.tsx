import { getFingerprintWebhookEvent } from "../dbModels/FingerprintWebhookEvent";

function FingerprintProWebhookEvent(event: any) {

    if (event.error) {
        return <p>{event.error}</p>
    }

  return (
    <div>
      <h2>Headers</h2>
      <pre>{JSON.stringify(JSON.parse(event.headers), null, 2)}</pre>
      <h2>Body</h2>
      <pre>{JSON.stringify(JSON.parse(event.body), null, 2)}</pre>
    </div>
  );
}

async function getWebhookEvent(requestId: string) {
  const event = await getFingerprintWebhookEvent(requestId);
  return event;
}

export async function getServerSideProps(context: any) {
  const requestId = context.query.requestId;
  if (!context.query.requestId) {
    return { props: { error: "requestId query param must to be provided" } };
  }

  const event = await getWebhookEvent(requestId);

  return {
    props: JSON.parse(JSON.stringify(event)), // ¯\_(ツ)_/¯ https://github.com/vercel/next.js/issues/11993
  };
}

export default FingerprintProWebhookEvent;
