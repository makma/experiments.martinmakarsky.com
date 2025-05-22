import { NextRequest, NextResponse } from "next/server";

export type SignupPayload = {
  email: string;
  password: string;
};

const EXISTING_USERS = [
  {
    email: "hellyr@gmail.com",
  },
  {
    email: "misterm@gmail.com",
  },
];

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as SignupPayload;
  console.log(email, password);

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
