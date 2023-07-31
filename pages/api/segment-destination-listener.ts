import { NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'

export default async function handler(req: NextRequest, res: NextApiResponse) {
    return res.send({ status: 200 });
}