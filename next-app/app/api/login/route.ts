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
    const response = NextResponse.json({ 
      message: "Login successful",
      headers
    });
    // Add fingerprint data as header
    response.headers.set('x-fingerprint-data', fingerprintData);
    return response;
  } else {
    // Handle failed login
    const response = NextResponse.json({ 
      message: "Invalid credentials", 
      headers 
    }, { status: 401 });
    // Add fingerprint data as header
    response.headers.set('x-fingerprint-data', fingerprintData);
    return response;
  }
}
