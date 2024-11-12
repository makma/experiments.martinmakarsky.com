"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { startAuthentication } from '@simplewebauthn/browser';


export default function LoginPage() {
    const [authenticationResult, setAuthenticationResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    useEffect(() => {
        // This runs only on the client side
        const value = localStorage.getItem("hackathon-ato-username");
        setUsername(value);
      }, []);

    const handleAuthentication = async () => {
        setIsLoading(true);

        const response = await fetch("/api/passkey-authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });
        const options = await response.json();
        // 3. Start WebAuthn authentication on the client
        const credentialResponse = await startAuthentication({optionsJSON: options});
        // 4. Send `credentialResponse` to the verification endpoint
        const verificationResponse = await fetch('/api/passkey-authenticate/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username, 
                credentialResponse, // The response we get from `startAuthentication`
            }),
        });

        if (verificationResponse.ok) {
            console.log('User authenticated successfully!');
            setAuthenticationResult("Authenticated successfully with your passkey")
        } else {
            console.error('Authentication failed with passkey failed');
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
            <h2>Authenticate with passkey</h2>
            <button
                onClick={handleAuthentication}
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
                    `Authenticate user: ${username} with passkey`
                )}
            </button>
            <br /><center><a href="/login">Back to login</a></center>

            {authenticationResult && (
                <div
                    style={{
                        marginTop: 10,
                        color: authenticationResult.includes("successfully") ? "green" : "red",
                    }}
                >
                    <strong>Result:</strong> {authenticationResult}
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
