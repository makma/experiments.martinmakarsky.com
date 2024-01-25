import {
  FingerprintJsServerApiClient,
  Region,
} from "@fingerprintjs/fingerprintjs-pro-server-api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? '';
  const requestId = req.query.requestId ?? '';

  if (!requestId) {
    return res.status(400).send("requestId query param must be provided");
  }

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
  });

  try {
    const event = await client.getEvent(requestId.toString());
    return res.status(200).send(JSON.stringify(event, null, 2));
  } catch (error) {
    return res.status(400).send(error);
  }

}