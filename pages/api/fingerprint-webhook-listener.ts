import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    runtime: 'edge',
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const webhookPayload = req.body;

        const { BOT_EVENTS } = (process.env as unknown as { BOT_EVENTS: KVNamespace });
        BOT_EVENTS.put(JSON.parse(webhookPayload).requestId, webhookPayload);

        return new Response(null, { status: 200 });
    } else {
        return new Response(null, { status: 405 });
    }
}