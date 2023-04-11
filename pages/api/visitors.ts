import type { NextRequest } from 'next/server'
import { FINGERPRINT_SECRET_API_KEY } from '../../shared/constants'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const visitorId = 'T6X2T5TSnZTeSUNZ1oBQ'
  const apiKey = FINGERPRINT_SECRET_API_KEY
  const requestId = '1681130720291.YHbcpl'

  const fingerprintJSProServerApiUrl = new URL(
    `https://eu.api.fpjs.io/visitors/${visitorId}`
  );

  fingerprintJSProServerApiUrl.searchParams.append('api_key', apiKey)
  fingerprintJSProServerApiUrl.searchParams.append('request_id', requestId);

  const visitorServerApiResponse = await fetch(
    fingerprintJSProServerApiUrl.href
  );

  const response = await visitorServerApiResponse.json()
  return new Response(JSON.stringify(response, null, 2))
}