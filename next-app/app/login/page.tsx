"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
import {
  FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS,
  CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_SEALED_CLIENT_RESULTS,
  CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_SEALED_CLIENT_RESULTS,
} from "../../shared/constants";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginResult, setLoginResult] = useState<string | null>(null);
  const [fp, setFp] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  

  useEffect(() => {
    (async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY_SEALED_RESULTS,
        scriptUrlPattern:
          CLOUDFLARE_PROXY_INTEGRATION_SCRIPT_URL_PATTERN_SEALED_CLIENT_RESULTS,
        endpoint: CLOUDFLARE_PROXY_INTEGRATION_ENDPOINT_SEALED_CLIENT_RESULTS,
      });
      const fp = await fpPromise;
      setFp(fp);
    })();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);

    const fingerprintData = await fp.get();
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
    setIsLoading(false); // Stop spinner
  };

  return (
    <div
      style={{
        maxWidth: 300,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
      <button
        onClick={handleLogin}
        style={{ width: "100%", position: "relative", height: "32px" }}
        disabled= {!fp}
      >
        {isLoading ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src="images/fingerprint-logo.svg"
              alt="Loading"
              width={20}
              height={20}
              style={{
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : (
          "Login"
        )}
      </button>

      {loginResult && (
        <div
          style={{
            marginTop: 10,
            color: loginResult.includes("successful") ? "green" : "red",
          }}
        >
          <strong>Login Result:</strong> {loginResult}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
