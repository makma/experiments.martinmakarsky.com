import type { NextRequest } from 'next/server'
import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? ''
  const visitorId = req.nextUrl.searchParams.get("visitorId") ?? ''

  if (!visitorId) {
    return new Response("visitorId query param must be provided")
  }

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey: apiKey, fetch: fetch.bind(globalThis) });

  const visitorHistory = await client.getVisitorHistory(visitorId);
  return new Response(JSON.stringify(visitorHistory, null, 2))
}