import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  console.log(username, password);

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "Account created successfully",
    headers,
  });
}
