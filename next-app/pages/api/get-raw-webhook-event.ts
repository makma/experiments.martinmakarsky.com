import { NextApiRequest, NextApiResponse } from "next";
import { getFingerprintWebhookEvent } from "../../dbModels/FingerprintWebhookEvent";
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const requestId = req.query.requestId ?? '';
  
    if (!requestId) {
      return res.status(400).send("requestId query param must be provided");
    }
  
    try {
      const event = await getFingerprintWebhookEvent(requestId as string);
      return res.status(200).send({webhookEvent: event});
    } catch (error) {
      return res.status(400).send(error);
    }
  
  }