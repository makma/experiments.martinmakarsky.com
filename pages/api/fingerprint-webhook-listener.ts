import { initBotEvents, persistBotEvent } from '../../dbModels/Event';

export default async function handler(req: Request, res: Response) {
    initBotEvents();

    if (req.method === 'POST') {

        const event: any = await req.json();

        if (!event) {
            return new Response(null, { status: 400 });
        }

        await persistBotEvent(event);

        return new Response(null, { status: 200 });
    } else {
        return new Response(null, { status: 405 });
    }
}