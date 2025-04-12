// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password, fingerprintData } = await request.json();
  
  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  // Hardcoded password for simplicity
  const hardcodedPassword = "pw";

  if (password === hardcodedPassword) {
    // Handle successful login, e.g., issue a session token
    console.log("Login successful for user:", username);
    return NextResponse.json({ 
      message: "Login successful",
      headers
    });
  } else {
    // Handle failed login
    return NextResponse.json({ 
      message: "Invalid credentials", 
      headers 
    }, { status: 401 });
  }
}
