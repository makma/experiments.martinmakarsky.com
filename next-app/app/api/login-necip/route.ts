// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password, fingerprintData } = await request.json();

  // Hardcoded password for simplicity
  const hardcodedPassword = "pw";

  if (password === hardcodedPassword) {
    // Handle successful login, e.g., issue a session token
    console.log("Login successful for user:", username);
    return NextResponse.json({ message: "Login successful" });
  } else {
    // Handle failed login
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}
