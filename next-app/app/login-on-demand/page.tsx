"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import * as OnDemand from "@fingerprintjs/fingerprintjs-pro-static"
import { FINGERPRINT_PUBLIC_API_KEY } from "../../shared/constants";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginResult, setLoginResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collectedBrowserData, setCollectedBrowserData] = useState<any>(null);
  
  useEffect(() => {
    (async () => {
      const fpPromise = OnDemand.load({
        apiKey: FINGERPRINT_PUBLIC_API_KEY,
        region: "eu",
        modules: [
          OnDemand.makeIdentificationModule(), 
          OnDemand.makeBotdModule(),
          OnDemand.makeLatencyReportModule(),
        ],
      });
      const fp = await fpPromise;
      try {
        const browserData = await fp.collect();
        setCollectedBrowserData(browserData);
        
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        fingerprintData: collectedBrowserData,
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
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 380,
          width: "90%",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ 
          marginBottom: "30px", 
          color: "#333",
          fontSize: "24px",
          fontWeight: 600,
        }}>Welcome Back</h2>
        
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontSize: "14px",
            color: "#555"
          }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              display: "block", 
              width: "100%", 
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
            }}
          />
        </div>
        
        <div style={{ width: "100%", marginBottom: "30px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontSize: "14px",
            color: "#555"
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              display: "block", 
              width: "100%", 
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              transition: "border-color 0.3s ease",
              outline: "none",
            }}
          />
        </div>
        
        <button
          onClick={handleLogin}
          style={{ 
            width: "100%", 
            position: "relative", 
            height: "48px",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3457e0")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4a6cf7")}
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
                width={24}
                height={24}
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        {loginResult && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "6px",
              width: "100%",
              textAlign: "center",
              backgroundColor: loginResult.includes("successful") ? "#e6f7e6" : "#ffeded",
              color: loginResult.includes("successful") ? "#2e7d32" : "#d32f2f",
            }}
          >
            {loginResult}
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
    </div>
  );
}
