import {
  FingerprintJsServerApiClient,
  Region,
} from "@fingerprintjs/fingerprintjs-pro-server-api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? '';
  const requestId = req.query.requestId ?? '';
  console.log(`hello: ${requestId}`);

  if (!requestId) {
    return res.status(400).send("requestId query param must be provided");
  }

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
    // @ts-ignore missing isRedirect property
    fetch: fetch.bind(globalThis),
  });

  try {
    const event = await client.getEvent(requestId.toString());
    return res.status(200).send(event);
  } catch (error) {
    return res.status(400).send(error)
  }

}