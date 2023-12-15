import { NextRequest, NextResponse } from 'next/server';
import { URLSearchParams } from 'url';
import { isNativeError } from 'util/types';
import { parseCookies, parseHost, parseIp, randomShortString } from './utils';

export const dynamic = 'force-dynamic';

/**
 * Identification request handler
 */
export async function POST(request: NextRequest) {
    try {
        return await proxyIdentificationRequest(request);
    } catch (error) {
        console.error(error);
        return await getErrorResponse(request, error);
    }
}

const proxyIdentificationRequest = async (request: NextRequest): Promise<Response> => {
    // Call the right endpoint depending on the region parameter:
    // https://api.fpjs.io, https://eu.api.fpjs.io, or https://ap.api.fpjs.io
    const queryParams = new URLSearchParams(request.url.split('?')[1]);
    const region = queryParams.get('region');
    let prefix = ''
    switch (region) {
        case 'eu':
            prefix = 'eu.'
            break
        case 'ap':
            prefix = 'ap.'
            break
        default:
            prefix = ''
            break
    }
    const identificationUrl = new URL(`https://${prefix}api.fpjs.io`);

    // Forward all present query parameters and append the monitoring parameter
    identificationUrl.search = request.url.split('?')[1] ?? '';
    identificationUrl.searchParams.append('ii', `custom-integration/1.0/ingress`);

    // Copy all headers
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
        headers.set(key, value);
    }

    // Delete all cookies from the Cookie header but keep `_iidt` if present
    headers.delete('cookie');
    const cookieMap = parseCookies(request.headers.get('cookie'));
    const _iidtCookie = cookieMap['_iidt'];
    if (_iidtCookie) {
        headers.set('cookie', `_iidt=${_iidtCookie}`);
    }

    // Add the necessary Fingerprint headers
    const PROXY_SECRET = process.env.PROXY_SECRET;
    if (!PROXY_SECRET) {
        throw new Error('Missing PROXY_SECRET environment variable');
    }
    headers.set('FPJS-Proxy-Secret', PROXY_SECRET);
    headers.set('FPJS-Proxy-Client-IP', parseIp(request));
    headers.set('FPJS-Proxy-Forwarded-Host', parseHost(request));

    // Make the identification request
    const identificationResponse = await fetch(identificationUrl, {
        headers: headers,
        method: 'POST',
        body: await request.blob(),
    });

    const updatedHeaders = new Headers(identificationResponse.headers);
    // If your app needs to work using HTTP, remove the `strict-transport-security` header
    // updatedHeaders.delete('strict-transport-security');

    // Return the response to the client
    return new Response(await identificationResponse.blob(), {
        status: identificationResponse.status,
        statusText: identificationResponse.statusText,
        headers: updatedHeaders,
    });
};

const getErrorResponse = (request: Request, error: unknown): Response => {
    const message = isNativeError(error) ? error.message : error;
    const requestId = `${new Date().getTime()}.${randomShortString({ length: 6 })}`;
    return NextResponse.json(
        {
            v: '2',
            error: {
                code: 'IntegrationFailed',
                message: `An identification error occurred with the custom integration. Reason: ${message}`,
            },
            requestId,
            products: {},
        },
        {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': request.headers.get('origin') ?? new URL(request.url).origin,
                'Access-Control-Allow-Credentials': 'true',
            },
        }
    );
};