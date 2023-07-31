import type { NextRequest } from 'next/server'
import {
  FingerprintJsServerApiClient,
  Region,
} from "@fingerprintjs/fingerprintjs-pro-server-api";

export default async function handler(req: NextRequest) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? ''
  const requestId = req.nextUrl.searchParams.get("requestId") ?? ''

  if (!requestId) {
    return new Response("requestId query param must be provided")
  }

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
    // @ts-ignore missing isRedirect property
    fetch: fetch.bind(globalThis),
  });

  const event = await client.getEvent(requestId);
  return new Response(JSON.stringify(event, null, 2))
}