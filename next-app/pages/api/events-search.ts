import {
  FingerprintJsServerApiClient,
  Region,
  SearchEventsFilter,
} from "@fingerprintjs/fingerprintjs-pro-server-api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? '';

  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const visitor_id = (req.query.visitor_id as string) ?? undefined;
  const bot = (req.query.bot as "all" | "good" | "bad" | "none") ?? undefined;
  const ip_address = (req.query.ip_address as string) ?? undefined;
  const linked_id = (req.query.linked_id as string) ?? undefined;
  const start = req.query.start ? parseInt(req.query.start as string) : undefined;
  const end = req.query.end ? parseInt(req.query.end as string) : undefined;
  const reverse = req.query.reverse === 'true' ? true : undefined;
  const suspect = req.query.suspect === 'true' ? true : undefined;

  if (!limit && !visitor_id && !bot && !ip_address && !linked_id && !start && !end && !reverse && !suspect) {
    return res.status(400).send("provide query params in api/events-search?limit=10&visitor_id=string%bot=all|good|bad|none&ip_address=192.168.0.1/32&linked_id=string&start=1739541015&end=1739541050&reverse=true|false&suspect=true|false format ");
  }

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
  });

  try {
    const filter = {
      limit,
      visitor_id,
      bot,
      ip_address,
      linked_id,
      start,
      end,
      reverse,
      suspect
    };
    
    const events = await client.searchEvents(filter);
    return res.status(200).send(JSON.stringify(events, null, 2));
  } catch (error) {
    return res.status(400).send(error);
  }

}