import { NextRequest, NextResponse } from "next/server";

export type SigninPayload = {
  email: string;
  password: string;
  // Optional Turnstile token when a challenge was required (edge decides)
  turnstileToken?: string;
};

export type SigninResponse = {
  message: string;
};

// Fake server-to-server Turnstile verification for demo purposes.
async function verifyTurnstileToken(_token: string): Promise<boolean> {
  // In a real setup, you would call Cloudflare's Turnstile verify endpoint here.
  return true;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SigninResponse>> {
  const { email, password, turnstileToken } = (await request.json()) as SigninPayload;
  console.log("signin attempt (origin)", { email, password, turnstileToken });

  // If the edge didn't require Turnstile, there will be no token.
  if (!turnstileToken) {
    return NextResponse.json(
      {
        message: "Login successful",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // Edge decided to require Turnstile, so we "verify" the token here.
  const ok = await verifyTurnstileToken(turnstileToken);

  // For this demo, verification always passes.
  if (ok) {
    return NextResponse.json(
      {
        message: "Login successful",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // This branch is unreachable with the fake verifier, but kept for completeness.
  return NextResponse.json(
    {
      message: "Turnstile verification failed",
    },
    {
      status: 403,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
