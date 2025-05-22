"use client";

import { Label } from "@radix-ui/react-label";
import { cn } from "../../components/lib/utils";
import { Button } from "../../components/ui/button";
import { FormEvent } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SignupPayload } from "../api/signup/route";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

export default function SignUpPage() {
  const [email, setEmail] = useState("marks@gmail.com");
  const [password, setPassword] = useState("password");

  const {
    mutate: signup,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: async (credentials: SignupPayload) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup({ email, password });
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
                    <h1 className="text-2xl font-bold">
                      Create a trial account
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      Start with $20 in free credits
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full my-1"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? "Signing up..." : "Sign up"}
                  </Button>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                  )}
                  {data && (
                    <Alert variant="success">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>
                        Account created successfully
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </form>
              <div className="hidden bg-muted md:flex items-center justify-center">
                <img
                  src="images/lumon-globe-logo.svg"
                  alt="Lumon Globe Logo"
                  className="w-[250px] h-[100px] opacity-20"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Please enjoy each credit equally. By clicking continue, you agree to
            our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
