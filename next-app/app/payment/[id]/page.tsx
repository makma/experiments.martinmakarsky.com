import { PaymentFormClient } from "./PaymentFormClient";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const { id } = await params;
  const pageId = id && typeof id === "string" ? id : "default";
  const apiRoute = `/api/pay-${pageId}`;

  // Capture all request headers from the initial GET request for the HTML document
  // This runs on the SERVER, so it captures all headers including those added by proxies (Cloudflare, etc.)
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  
  // Convert headers to a plain object
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  // Log headers server-side to verify proxy headers are captured
  console.log("Server-side headers captured:", Object.keys(allHeaders));

  return (
    <PaymentFormClient
      apiRoute={apiRoute}
      initialHeaders={allHeaders}
    />
  );
}
