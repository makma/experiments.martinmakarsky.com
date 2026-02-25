import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    if (!req.body) {
      return new Response(null, { status: 400 });
    }

    const clientIp = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for']?.toString().split(',')[0];

    const host = req.headers['host'];

    const userAgent = req.headers['user-agent'];

    const cookies = req.headers.cookie;
    let iidtCookie = null;


    if (cookies) {
      const cookieArray = cookies.split(';');
      for (const cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=');
        if (name === '_iidt') {
          iidtCookie = value;
          break;
        }
      }
    }

    const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? '';

    // Include all original headers in client_headers
    const clientHeaders: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string" || Array.isArray(value)) {
        clientHeaders[key] = value;
      }
    }
    console.log("FINGERPRINT_SECRET_API_KEY present?", !!process.env.FINGERPRINT_SECRET_API_KEY);

    const response = await fetch('https://eu.api.fpjs.io/v4/send', {
      method: 'POST',
      headers: {
        'Content-Encoding': 'application/json',
        "Auth-API-Key": apiKey
      },
      body: JSON.stringify({
        fingerprintData: req.body.browserData,
        client_host: host,
        client_user_agent: userAgent,
        client_ip: clientIp,
        client_cookie: iidtCookie,
        client_headers: clientHeaders
      })
    });

    if (!response.ok) {
      console.error('Error sending data to Fingerprint API:', await response.text());
      return res.status(500).json({ error: 'Failed to send data to Fingerprint API' });
    }

    // Set cookies from the /send response
    const rawCookies = response.headers.getSetCookie?.();
    if (rawCookies) {
      rawCookies.forEach(cookie => {
        res.setHeader('Set-Cookie', cookie);
      });
    }

    const fpResponse = await response.json();
    return res.send({
      status: 200,
      response: {
        rawFpResponse: fpResponse
      }
    });
  }
}