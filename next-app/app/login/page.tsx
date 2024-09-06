// app/login/page.tsx
"use client";

import { useState } from "react";
import FingerprintJS, { GetResult } from "@fingerprintjs/fingerprintjs-pro";
import { FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS } from "../../shared/constants";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fingerprintData, setFingerprintData] = useState<
  GetResult | string | null
>(null);
const [loginResult, setLoginResult] = useState<string | null>(null);


  const handleLogin = async () => {
    const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS,
      });
      const fp = await fpPromise;
      const data = await fp.get();
      setFingerprintData(data);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        fingerprintData,
      }),
    });

    if (response.ok) {
        setLoginResult("Login successful!");
      } else {
        setLoginResult("Login failed. Please check your credentials.");
      }
  };

  return (
    <div style={{ maxWidth: 300, margin: "auto" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleLogin} style={{ width: "100%" }}>
        Login
      </button>

      {loginResult && (
        <div style={{ marginTop: 10, color: loginResult.includes("successful") ? "green" : "red" }}>
          <strong>Login Result:</strong> {loginResult}
        </div>
      )}
    </div>
  );
}
