import { NextApiRequest, NextApiResponse } from 'next';
import { initFingerprintWebhookEvents, persistFingerprintWebhookEvent } from '../../dbModels/FingerprintWebhookEvent';
import { WebhookEvent } from '../../shared/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await initFingerprintWebhookEvents();

  if (req.method === 'POST') {
    if (!req.body) {
      return new Response(null, { status: 400 });
    }

    const event: WebhookEvent = {
      requestId: req.body.requestId,
      body: JSON.stringify(req.body),
      headers: JSON.stringify(req.headers)
    }

    await persistFingerprintWebhookEvent(event);

    return res.send({ status: 200 });
  } else {
    return res.send({ status: 405 });
  }
}