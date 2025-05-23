import { NextRequest, NextResponse } from "next/server";

export type SignupPayload = {
  email: string;
  password: string;
};

export type SignupResponse = {
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
): Promise<NextResponse<SignupResponse>> {
  const { email, password } = (await request.json()) as SignupPayload;
  console.log(email, password);

  // Wait for 300ms to avoid UI flickering
  await new Promise((resolve) => setTimeout(resolve, 300));

  const existingUser = EXISTING_USERS.find((user) => user.email === email);

  if (existingUser) {
    return NextResponse.json(
      { message: "Account with this email already exists" },
      { status: 403 }
    );
  }

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "Account created successfully",
    headers,
  });
}
