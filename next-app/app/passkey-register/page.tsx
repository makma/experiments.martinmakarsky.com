"use client";

import Image from "next/image";
import { useState } from "react";
import { startRegistration } from '@simplewebauthn/browser';


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [registrationResult, setRegistrationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleRegistration = async () => {
    setIsLoading(true);

    const response = await fetch("/api/passkey-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    const options = await response.json();

    const attResp = await startRegistration({optionsJSON: options});
    // Send response back to the server to verify
    const verificaitonResponse = await fetch('/api/passkey-register-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username, 
        attestationResponse: attResp}),
    });

    if (verificaitonResponse.ok) {
      setRegistrationResult("Passkey registered successfully");
    } else {
      setRegistrationResult("Passkey registration failed");
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
      <h2>Register passkey</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <button
        onClick={handleRegistration}
        style={{ width: "100%", position: "relative", height: "32px" }}
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
          "Add my passkey"
        )}
      </button>
      <br /><center><a href="/login">Back to login</a></center>

      {registrationResult && (
        <div
          style={{
            marginTop: 10,
            color: registrationResult.includes("successfully") ? "green" : "red",
          }}
        >
          <strong>Result:</strong> {registrationResult}
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
