"use client";

import "../../styles/preflight-scoped.css";
import { Label } from "@radix-ui/react-label";
import { cn } from "../../components/lib/utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { PaymentPayload, PaymentResponse } from "../api/pay/route";
import { ErrorAlert, SuccessAlert } from "../../components/ui/alert";

type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("4111111111111111");
  const [cvv, setCvv] = useState("123");
  const [expirationDate, setExpirationDate] = useState("12/25");

  const [currentResponse, setCurrentResponse] = useState<PaymentResponse | null>(null);
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMethod, setLastMethod] = useState<HttpMethod | null>(null);

  const handleRequest = async (method: HttpMethod) => {
    setIsLoading(true);
    setLastMethod(method);
    setCurrentError(null);
    setCurrentResponse(null);

    try {
      const payload: PaymentPayload = {
        cardNumber,
        cvv: parseInt(cvv),
        expirationDate,
      };

      let response: Response;
      
      if (method === "GET") {
        // For GET, send data as query parameters
        const params = new URLSearchParams({
          cardNumber,
          cvv,
          expirationDate,
        });
        response = await fetch(`/api/pay?${params.toString()}`, {
          method: "GET",
        });
      } else {
        // For other methods, send data in JSON body
        response = await fetch("/api/pay", {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
      }

      const data = await response.json();
      setCurrentResponse(data);
    } catch (error) {
      setCurrentError(error instanceof Error ? error : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Payment Form</h1>
                  <p className="text-balance text-muted-foreground">
                    Test different HTTP methods
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111111111111111"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="12/25"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => handleRequest("POST")}
                    disabled={isLoading}
                    variant="default"
                    className="w-full"
                  >
                    POST
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleRequest("GET")}
                    disabled={isLoading}
                    variant="default"
                    className="w-full"
                  >
                    GET
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleRequest("PUT")}
                    disabled={isLoading}
                    variant="default"
                    className="w-full"
                  >
                    PUT
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleRequest("PATCH")}
                    disabled={isLoading}
                    variant="default"
                    className="w-full"
                  >
                    PATCH
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleRequest("DELETE")}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    DELETE
                  </Button>
                </div>
                {isLoading && (
                  <p className="text-center text-sm text-muted-foreground">
                    Sending {lastMethod} request...
                  </p>
                )}
                {currentError && <ErrorAlert message={currentError.message} />}
                {currentResponse && (
                  <SuccessAlert 
                    message={`${lastMethod} ${currentResponse.message}`}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
