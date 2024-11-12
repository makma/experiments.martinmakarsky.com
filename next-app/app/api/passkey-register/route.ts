import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import redis from "../redis"

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { username } = await req.json();

    const options = await generateRegistrationOptions({
      rpID: "experiments.martinmakarsky.com",
      rpName: 'Hackathon 2024 ATO Login Demo',
      userName: username,
    });
    // Store the passkey challenge in memory cache for now
    // TODO: We should use a random user_id here instead
    const userKey = `user:${username}`;
    await redis.hSet(userKey, 'currentChallenge', options.challenge);
    return NextResponse.json(options);
  } else {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
}
