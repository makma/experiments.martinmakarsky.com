import redis from "../../redis"
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

export async function POST(req: NextRequest) {
    try {
        const { username, credentialResponse } = await req.json();

        // Retrieve stored challenge and authenticator data from Redis
        const userKey = `user:${username}`;
        const expectedChallenge = await redis.hGet(userKey, 'currentChallenge');
        const credentialsJSON = await redis.hGet(userKey, 'credentials');

        if (!expectedChallenge || !credentialsJSON) {
            return NextResponse.json({ error: 'User or challenge not found' }, { status: 400 });
        }

        // Parse credentials data from Redis
        const credentials = JSON.parse(credentialsJSON);
        console.log(credentials)
        credentials.publicKey = base64ToUint8Array(credentials.publicKey);
        console.log(credentials)

        // Verify the authentication response
        const verification = await verifyAuthenticationResponse({
            response: credentialResponse,
            expectedChallenge,
            expectedOrigin: 'https://experiments.martinmakarsky.com',
            expectedRPID: 'experiments.martinmakarsky.com',
            credential: credentials,
        });
        console.log(verification)

        if (verification.verified) {
            // Authentication successful
            return NextResponse.json({ success: true });
        } else {
            // Authentication failed
            return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error during authentication verification:', error);
        return NextResponse.json({ error: 'Server error during authentication' }, { status: 500 });
    }
}
function base64ToUint8Array(base64String: string) {
    return new Uint8Array(Buffer.from(base64String, 'base64'));
  }

