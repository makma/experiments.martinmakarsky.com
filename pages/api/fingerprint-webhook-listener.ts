import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    runtime: 'edge',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const webhookPayload = await req.body;

        const { BOT_EVENTS } = (process.env as unknown as { BOT_EVENTS: KVNamespace });
        BOT_EVENTS.put(webhookPayload.requestId, webhookPayload);

        // Send a response back to the sender (optional)
        res.status(200).json({ message: 'Webhook data received successfully.' });
        res.end();
    } else {
        res.status(405).end();
    }
}