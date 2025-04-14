// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  
  // Extract request headers
  const headers = Object.fromEntries(request.headers);
  
  // Get fingerprint data from header
  const fingerprintData = request.headers.get('x-fingerprint-data');

  // Hardcoded password for simplicity
  const hardcodedPassword = "pw";

  if (password === hardcodedPassword) {
    // Handle successful login, e.g., issue a session token
    console.log("Login successful for user:", username);
    return NextResponse.json({ 
      message: "Login successful",
      headers,
      fingerprintData
    });
  } else {
    // Handle failed login
    return NextResponse.json({ 
      message: "Invalid credentials", 
      headers,
      fingerprintData
    }, { status: 401 });
  }
}
