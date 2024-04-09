import { getFingerprintWebhookEvent } from "../dbModels/FingerprintWebhookEvent";
import * as crypto from "crypto";
import { Buffer } from 'buffer';

function FingerprintProWebhookEvent(props: any) {

    if (props.error) {
        return <p>{props.error}</p>
    }

  return (
    <div>
      <h2>Signature status </h2>
      <pre>{props.signatureVerificationResult ? "Valid" : "Invalid"}</pre>
      <h2>Headers</h2>
      <pre>{JSON.stringify(JSON.parse(props.event.headers), null, 2)}</pre>
      <h2>Body</h2>
      <pre>{JSON.stringify(JSON.parse(props.event.body), null, 2)}</pre>
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

  const signature = (JSON.parse(event.headers) as any)["fpjs-event-signature"]
  const webhookSecret = process.env.WEBHOOK_SECRET ?? '';
  const signatureVerificationResult = checkHeader(signature, Buffer.from(event.body), webhookSecret)

  return {
    props: { event: JSON.parse(JSON.stringify(event)), signatureVerificationResult: signatureVerificationResult } // ¯\_(ツ)_/¯ https://github.com/vercel/next.js/issues/11993
  };
}

export default FingerprintProWebhookEvent;

const checkSignature = (signature: string, data: Buffer, secret: string) => {
    return signature === crypto.createHmac('sha256', secret).update(data).digest('hex');
}

const checkHeader = (header: string, data: Buffer, secret: string) => {
    const signatures = header.split(',');
    for (const signature of signatures) {
        const [version, hash] = signature.split('=');
        if (version === 'v1') {
            if (checkSignature(hash, data, secret)) {
                return true;
            }
        }
    }
    return false
}
