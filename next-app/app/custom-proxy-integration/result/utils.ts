import { NextRequest } from 'next/server';

export const parseCookies = (cookieHeader?: string | null) => {
    if (!cookieHeader) {
        return {};
    }
    const cookies = cookieHeader.split(';');
    const result: Record<string, string> = {};
    cookies.forEach((cookie) => {
        const [name, value] = cookie.split('=');
        result[name.trim()] = value.trim();
    });
    return result;
};

export const parseIp = (request: NextRequest) => {
    return (
        request.ip ??
        request.headers.get('x-real-ip') ??
        request.headers.get('x-forwarded-for')?.split(',')[0] ??
        '127.0.0.1'
    );
};

export const parseHost = (request: Request) => {
    return request.headers.get('host') ?? new URL(request.url).hostname;
};

export const randomShortString = ({
    length,
}: {
    length: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}) => {
    return Math.random()
        .toString(36)
        .substring(2, 2 + length);
};