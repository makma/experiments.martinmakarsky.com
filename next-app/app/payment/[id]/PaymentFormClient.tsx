"use client";

import "../../../styles/preflight-scoped.css";
import { Label } from "@radix-ui/react-label";
import { cn } from "../../../components/lib/utils";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useEffect, useRef, useState } from "react";
import { PaymentPayload, PaymentResponse } from "../../api/payment/[id]/route";
import { ErrorAlert, SuccessAlert } from "../../../components/ui/alert";

type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
type TransportMethod = "fetch" | "xhr" | "form";

interface PaymentFormClientProps {
  apiRoute: string;
  initialHeaders?: Record<string, string>;
}

export function PaymentFormClient({ apiRoute, initialHeaders }: PaymentFormClientProps) {
  const [cardNumber, setCardNumber] = useState("4111111111111111");
  const [cvv, setCvv] = useState("123");
  const [expirationDate, setExpirationDate] = useState("12/25");

  const [currentResponse, setCurrentResponse] = useState<PaymentResponse | null>(null);
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMethod, setLastMethod] = useState<HttpMethod | null>(null);
  const [lastTransport, setLastTransport] = useState<TransportMethod | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleRequest = async (method: HttpMethod) => {
    setIsLoading(true);
    setLastMethod(method);
    setLastTransport("fetch");
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
        response = await fetch(`${apiRoute}?${params.toString()}`, {
          method: "GET",
        });
      } else {
        // For other methods, send data in JSON body
        response = await fetch(apiRoute, {
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

  const handleXhrRequest = (method: HttpMethod) => {
    setIsLoading(true);
    setLastMethod(method);
    setLastTransport("xhr");
    setCurrentError(null);
    setCurrentResponse(null);

    const xhr = new XMLHttpRequest();
    const payload: PaymentPayload = {
      cardNumber,
      cvv: parseInt(cvv),
      expirationDate,
    };

    xhr.onload = () => {
      setIsLoading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setCurrentResponse(data);
        } catch (error) {
          setCurrentError(new Error("Failed to parse response"));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          setCurrentError(new Error(error.message || "Request failed"));
        } catch {
          setCurrentError(new Error(`Request failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      setIsLoading(false);
      setCurrentError(new Error("Network error occurred"));
    };

    xhr.ontimeout = () => {
      setIsLoading(false);
      setCurrentError(new Error("Request timeout"));
    };

    if (method === "GET") {
      // For GET, send data as query parameters
      const params = new URLSearchParams({
        cardNumber,
        cvv,
        expirationDate,
      });
      xhr.open("GET", `${apiRoute}?${params.toString()}`);
      xhr.send();
    } else {
      // For other methods, send data in JSON body
      xhr.open(method, apiRoute);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(payload));
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument;
        const responseText = doc?.body?.innerText?.trim();

        if (!responseText) {
          throw new Error("Empty response from form submission");
        }

        const data = JSON.parse(responseText) as PaymentResponse;
        setCurrentResponse(data);
        setCurrentError(null);
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error("Failed to parse form submission response");
        setCurrentError(err);
        setCurrentResponse(null);
      } finally {
        setIsLoading(false);
      }
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <form
                className="flex flex-col gap-6"
                method="POST"
                action={apiRoute}
                target="paymentFormTarget"
                encType="application/x-www-form-urlencoded"
                onSubmit={() => {
                  setIsLoading(true);
                  setLastMethod("POST");
                  setLastTransport("form");
                  setCurrentError(null);
                  setCurrentResponse(null);
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Payment Form</h1>
                  <p className="text-balance text-muted-foreground">
                    Test different HTTP methods
                  </p>
                </div>
                {initialHeaders && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Initial Request Headers (from HTML GET)</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-auto text-xs border max-h-64">
                      {JSON.stringify(initialHeaders, null, 2)}
                    </pre>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
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
                    name="cvv"
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
                    name="expirationDate"
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="12/25"
                    required
                  />
                </div>
                <div className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Fetch API</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
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
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">XHR</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <Button
                        type="button"
                        onClick={() => handleXhrRequest("POST")}
                        disabled={isLoading}
                        variant="default"
                        className="w-full"
                      >
                        POST
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleXhrRequest("GET")}
                        disabled={isLoading}
                        variant="default"
                        className="w-full"
                      >
                        GET
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleXhrRequest("PUT")}
                        disabled={isLoading}
                        variant="default"
                        className="w-full"
                      >
                        PUT
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleXhrRequest("PATCH")}
                        disabled={isLoading}
                        variant="default"
                        className="w-full"
                      >
                        PATCH
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleXhrRequest("DELETE")}
                        disabled={isLoading}
                        variant="destructive"
                        className="w-full"
                      >
                        DELETE
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">HTTP Form</h3>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                        <Button
                          type="submit"
                          variant="outline"
                          className="w-full md:w-auto"
                          disabled={isLoading}
                        >
                          POST (form-encoded)
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Uses a plain HTML form submission to POST directly to {apiRoute}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {isLoading && (
                  <p className="text-center text-sm text-muted-foreground">
                    Sending {lastMethod} request via {lastTransport?.toUpperCase()}...
                  </p>
                )}
                {currentError && <ErrorAlert message={currentError.message} />}
                {currentResponse && (
                  <>
                    <SuccessAlert 
                      message={`${lastMethod} (${lastTransport?.toUpperCase()}) ${currentResponse.message}`}
                    />
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Response Body</h3>
                      <pre className="bg-muted p-4 rounded-md overflow-auto text-xs border">
                        {JSON.stringify(currentResponse, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <iframe
        name="paymentFormTarget"
        ref={iframeRef}
        title="payment-form-target"
        style={{ display: "none" }}
      />
    </div>
  );
}

