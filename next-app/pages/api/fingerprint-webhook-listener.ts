import { NextApiRequest, NextApiResponse } from 'next';
import { initBotEvents, persistBotEvent } from '../../dbModels/Event';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await initBotEvents();

  if (req.method === 'POST') {
    const event = req.body;
    if (!event) {
      return new Response(null, { status: 400 });
    }

    if (event.bot) {
      await persistBotEvent(event);
    }

    return res.send({ status: 200 });
  } else {
    return res.send({ status: 405 });
  }
}