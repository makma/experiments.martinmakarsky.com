import { getFingerprintWebhookEvent } from "../dbModels/FingerprintWebhookEvent";
import * as crypto from "crypto";
import { Buffer } from "buffer";
import { isValidWebhookSignature } from "@fingerprintjs/fingerprintjs-pro-server-api";

function FingerprintProWebhookEvent(props: any) {
  if (props.error) {
    return <p>{props.error}</p>;
  }

  return (
    <div>
      <h2>Signature verification status - Custom code </h2>
      <pre>{props.signatureVerificationResultCustom ? "Valid" : "Invalid"}</pre>
      <h2>Signature status - Node SDK verification </h2>
      <pre id="signature-verification-result-node-sdk">
        {props.signatureVerificationResultSDK ? "Valid" : "Invalid"}
      </pre>
      <h2>Headers</h2>
      <pre>{JSON.stringify(props.event.headers, null, 2)}</pre>
      <h2>Body</h2>
      <pre>{JSON.stringify(props.event.body, null, 2)}</pre>
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

  const signature = (event.headers as any)["fpjs-event-signature"];
  const webhookSecret = process.env.WEBHOOK_SECRET ?? "";
  const signatureVerificationResultCustom =
    verifySignatureHeaderCustomImplementation(
      signature,
      Buffer.from(JSON.stringify(event.body)),
      webhookSecret
    );
  const signatureVerificationResultSDK = isValidWebhookSignature({
    header: signature,
    data: Buffer.from(JSON.stringify(event.body)),
    secret: webhookSecret,
  });

  return {
    props: {
      event: event,
      signatureVerificationResultCustom: signatureVerificationResultCustom,
      signatureVerificationResultSDK: signatureVerificationResultSDK,
    }, // ¯\_(ツ)_/¯ https://github.com/vercel/next.js/issues/11993
  };
}

export default FingerprintProWebhookEvent;

const checkSignature = (signature: string, data: Buffer, secret: string): boolean => {
  const computedSignature = crypto.createHmac("sha256", secret)
    .update(new Uint8Array(data.buffer, data.byteOffset, data.byteLength)) // Convert Buffer to Uint8Array
    .digest("hex");

  return signature === computedSignature;
};

const verifySignatureHeaderCustomImplementation = (
  header: string,
  data: Buffer,
  secret: string
) => {
  const signatures = header.split(",");
  for (const signature of signatures) {
    const [version, hash] = signature.split("=");
    if (version === "v1") {
      if (checkSignature(hash, data, secret)) {
        return true;
      }
    }
  }
  return false;
};
