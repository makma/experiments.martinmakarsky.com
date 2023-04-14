export const config = {
  runtime: "experimental-edge",
};

function Events({ content }: { content: string }) {
  return <pre>{content}</pre>;
}

async function getEvent(requestId: string) {
  try {
    const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? "";

    const fingerprintJSProServerApiUrl = new URL(
      `https://eu.api.fpjs.io/events/${requestId}`
    );

    fingerprintJSProServerApiUrl.searchParams.append("api_key", apiKey);

    const eventServerApiResponse = await fetch(
      fingerprintJSProServerApiUrl.href
    );

    const event = await eventServerApiResponse.json();
    return event;
  } catch (error: any) {
    return `${error.stack} \n ${error}`;
  }
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
