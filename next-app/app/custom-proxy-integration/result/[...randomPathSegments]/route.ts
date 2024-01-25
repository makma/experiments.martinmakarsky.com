import { isNativeError } from 'util/types';

export const dynamic = 'force-dynamic';

/**
 * Browser cache request handler
 */
export async function GET(
    request: Request,
    { params }: { params: { randomPathSegments: string[] } }
) {
    try {
        // Call the right endpoint depending on the region parameter, with the same random path segments
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
        const randomPath = params.randomPathSegments.join('/');
        const browserCacheUrl = new URL(`https://${prefix}api.fpjs.io/${randomPath}`);

        // Forward all query parameters
        browserCacheUrl.search = request.url.split('?')[1];

        // Forward all headers except the cookie header
        const headers = new Headers();
        for (const [key, value] of request.headers.entries()) {
            headers.set(key, value);
        }
        headers.delete('cookie');

        // Make the browser cache request
        const browserCacheResponse = await fetch(browserCacheUrl, {
            headers,
        });

        // Forward the response unchanged
        return browserCacheResponse;
    } catch (error) {
        console.error(error);
        return new Response(isNativeError(error) ? error.message : `Browser cache error: ${error} `, {
            status: 500,
        });
    }
}