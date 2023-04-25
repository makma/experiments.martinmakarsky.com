import type { NextRequest } from 'next/server'

export const config = {
    runtime: 'edge',
}

export default async function handler(req: NextRequest) {
    console.log(JSON.stringify(req))
    console.log(JSON.stringify(req.ip))
    console.log(JSON.stringify(req.body))

    return new Response()
}