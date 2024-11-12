// /pages/api/verify-registration.js
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { NextRequest, NextResponse } from 'next/server';
import redis from "../redis"

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { username, attestationResponse } = await req.json();

    // Retrieve the expected challenge that was saved during the passkey registration request
    // It looks like the challenge needs a short-term storage with a TTL
    // as it's only needed to register the credentials
    const userKey = `user:${username}`;
    const currentChallenge = await redis.hGet(userKey, 'currentChallenge');
    try {
      const verification = await verifyRegistrationResponse({
        response: attestationResponse,
        expectedChallenge: currentChallenge as string,
        expectedOrigin: 'https://experiments.martinmakarsky.com',
        expectedRPID: 'experiments.martinmakarsky.com',
      });

      if (verification.verified && verification.registrationInfo) {
        const credentialId = verification.registrationInfo?.credential.id;
        const credentialPublicKey =
          uint8ArrayToBase64(verification.registrationInfo.credential.publicKey);
        const credentialCounter = verification.registrationInfo?.credential.counter;

        // Save the authenticator details (public key, etc.) for future logins
        await redis.hSet(userKey, {
          credentials: JSON.stringify({ 
            id: credentialId, 
            publicKey: credentialPublicKey,
            counter: credentialCounter
          }),
        });
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ message: "Registration verification failed" }, { status: 400 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Server error: verification failed" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
}
function uint8ArrayToBase64(uint8Array: Uint8Array) {
  return Buffer.from(uint8Array).toString('base64');
}
