"use client";

import "../../styles/preflight-scoped.css";
import { Label } from "@radix-ui/react-label";
import { cn } from "../../components/lib/utils";
import { Button } from "../../components/ui/button";
import { FormEvent } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ErrorAlert, SuccessAlert } from "../../components/ui/alert";
import { TURNSTILE_SITE_KEY } from "../../shared/constants";

type SigninPayload = {
  email: string;
  password: string;
  // Turnstile token, named in a worker-friendly way
  "cf-turnstile-response"?: string;
};

type SigninResponse = {
  message: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        selector: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
        }
      ) => void;
    };
  }
}

export default function SignInPage() {
  const [email, setEmail] = useState("marks@lumon.com");
  const [password, setPassword] = useState("password");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);

  // Helper to render the Turnstile widget into the container.
  const renderTurnstile = () => {
    if (!window.turnstile) return;
    window.turnstile.render("#turnstile-container", {
      sitekey: TURNSTILE_SITE_KEY,
      action: "login",
      callback: (token: string) => {
        setTurnstileToken(token);
      },
    });
  };

  // Load Turnstile script once we know we need the challenge (based on API response).
  useEffect(() => {
    if (!showTurnstile) return;

    if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.body.appendChild(script);
    } else {
      renderTurnstile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTurnstile]);

  // Save previous response and error to avoid flickering on retry
  const [currentResponse, setCurrentResponse] = useState<SigninResponse | null>(null);
  const [currentError, setCurrentError] = useState<string | null>(null);

  const { mutate: signin, isPending } = useMutation({
    mutationFn: async (credentials: SigninPayload) => {
      const response = await fetch("/api/signin", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Try to read JSON, but fall back gracefully.
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      const turnstileRequired =
        response.status === 403 &&
        (response.headers.get("X-Turnstile-Required") === "1" ||
          data?.code === "turnstile_required");

      return {
        status: response.status,
        turnstileRequired,
        body: data as SigninResponse | null,
      };
    },
    onSuccess: (result) => {
      if (result.turnstileRequired) {
        setShowTurnstile(true);
        setCurrentError("Please complete the security check and try again.");
        setCurrentResponse(null);
        return;
      }

      if (result.status >= 200 && result.status < 300 && result.body) {
        setCurrentResponse(result.body);
        setCurrentError(null);
      } else {
        setCurrentError(result.body?.message ?? "Sign in failed");
        setCurrentResponse(null);
      }
    },
    onError: () => {
      setCurrentError("Unexpected error during sign in");
      setCurrentResponse(null);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signin({
      email,
      password,
      "cf-turnstile-response": turnstileToken ?? undefined,
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Sign in to your account</h1>
                    <p className="text-balance text-muted-foreground">
                      Start with $20 in free credits
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {showTurnstile && (
                    <div className="grid gap-2">
                      <Label>Security check</Label>
                      <div className="mt-1" id="turnstile-container" />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="signin-password">Password</Label>
                    </div>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    id="signin-submit"
                    type="submit"
                    className="w-full my-1"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? "Signing in..." : "Sign in"}
                  </Button>
                  {currentError && <ErrorAlert message={currentError} />}
                  {currentResponse && <SuccessAlert message={currentResponse.message} />}
                </div>
              </form>
              <div className="hidden bg-muted/70 md:flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="images/lumon-globe-logo.svg"
                  alt="Lumon Globe Logo"
                  className="w-[250px] h-[100px] opacity-20"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Please enjoy each credit equally. By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
