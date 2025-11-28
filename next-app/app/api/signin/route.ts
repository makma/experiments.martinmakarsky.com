import { NextRequest, NextResponse } from "next/server";

export type SigninPayload = {
  email: string;
  password: string;
};

export type SigninResponse = {
  message: string;
  headers?: Record<string, string>;
};

const EXISTING_USERS = [
  {
    email: "hellyr@lumon.com",
  },
  {
    email: "misterm@lumon.com",
  },
];

export async function POST(
  request: NextRequest
): Promise<NextResponse<SigninResponse>> {
  const { email, password } = (await request.json()) as SigninPayload;
  console.log(email, password);

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  // Simulate origin behavior: 20% success, 80% forbidden
  const success = Math.random() < 0.2;

  if (success) {
    return NextResponse.json(
      {
        message: "Login successful",
        headers,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      message: "Forbidden from the origin server",
      headers,
    },
    { status: 403 }
  );
}
