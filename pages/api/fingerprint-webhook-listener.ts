import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    runtime: 'edge',
}

export default async function handler(req: any) {
    if (req.method === 'POST') {
        const webhookPayload: any = await req.json();

        const { BOT_EVENTS } = (process.env as unknown as { BOT_EVENTS: KVNamespace });
        BOT_EVENTS.put(webhookPayload.requestId, JSON.stringify(webhookPayload));

        return new Response(null, { status: 200 });
    } else {
        return new Response(null, { status: 405 });
    }
}