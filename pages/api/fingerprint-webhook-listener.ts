import { initBotEvents, persistBotEvent } from '../../dbModels/Event';

export default async function handler(req: any, res: Response) {
    await initBotEvents();

    if (req.method === 'POST') {

        const eventString = req.body;

        if (!eventString) {
            return new Response(null, { status: 400 });
        }

        console.log(`persisting ${eventString}`)
        await persistBotEvent(JSON.parse(eventString));
        console.log(`persisted`)

        return new Response(null, { status: 200 });
    } else {
        return new Response(null, { status: 405 });
    }
}