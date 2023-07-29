import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    runtime: 'edge',
}

export default async function onRequestPost(context: any) {
    const body: any = await context.request.json();
    console.log('on psot request');
    console.log(JSON.stringify(body))

    const { BOT_EVENTS } = (process.env as unknown as { BOT_EVENTS: KVNamespace });
    BOT_EVENTS.put(body.requestId, JSON.stringify(body));

    return new Response(null, { status: 200 });
}