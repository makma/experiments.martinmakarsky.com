import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? ''
  const requestId = '1681130720291.YHbcpl'

  const fingerprintJSProServerApiUrl = new URL(
    `https://eu.api.fpjs.io/events/${requestId}`
  );

  fingerprintJSProServerApiUrl.searchParams.append('api_key', apiKey)

  const eventServerApiResponse = await fetch(
    fingerprintJSProServerApiUrl.href
  );

  const response = await eventServerApiResponse.json()
  return new Response(JSON.stringify(response, null, 2))
}