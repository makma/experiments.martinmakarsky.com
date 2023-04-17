import type { NextRequest } from 'next/server'
import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  try {
    const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? ''
    const visitorId = 'T6X2T5TSnZTeSUNZ1oBQ'

    const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey: apiKey, fetch: fetch.bind(globalThis) });

    const visitorHistory = await client.getVisitorHistory(visitorId);
    return new Response(JSON.stringify(visitorHistory, null, 2))
  } catch (error: any) {
    return new Response(`${error.stack} \n ${error}`)
  }
}