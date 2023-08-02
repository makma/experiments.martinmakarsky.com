import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? '';
  const visitorId = req.query.visitorId ?? '';

  if (!visitorId) {
    return res.status(400).send("visitorId query param must be provided");
  }

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey: apiKey });

  try {
    const visitorHistory = await client.getVisitorHistory(visitorId.toString());
    return res.status(200).send(visitorHistory);
  } catch (error) {
    return res.status(400).send(error)
  }

}