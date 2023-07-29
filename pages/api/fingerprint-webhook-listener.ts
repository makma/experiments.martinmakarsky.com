import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    runtime: 'edge',
}

export default async function handler(req: any) {
    if (req.method === 'POST') {
        const body: any = await req.json();

        const { BOT_EVENTS } = (process.env as unknown as { BOT_EVENTS: KVNamespace });
        await BOT_EVENTS.put(body.requestId, JSON.stringify(body));

        return new Response(null, { status: 200 });
    } else {
        return new Response(null, { status: 405 });
    }
}