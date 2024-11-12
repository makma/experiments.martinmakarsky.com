import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import redis from "../redis"

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        const userKey = `user:${username}`;
        const credentialsJSON = await redis.hGet(userKey, 'credentials');
        if (!credentialsJSON) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Parse credentials from Redis
        const credentials = JSON.parse(credentialsJSON);
        // Generate authentication options
        const options = await generateAuthenticationOptions({
            rpID: "localhost",
            allowCredentials: [{id: credentials.id}],
            userVerification: 'preferred',
        });

        // Store the challenge in Redis for later verification
        await redis.hSet(userKey, 'currentChallenge', options.challenge);

        return NextResponse.json(options);


    } catch (error) {
        console.error('Error during passkey authentication:', error);
        return NextResponse.json({ error: 'Server error during authentication' }, { status: 500 });
    }
}