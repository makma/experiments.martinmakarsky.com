import { NextRequest, NextResponse } from "next/server";

export type PaymentPayload = {
  cardNumber: string;
  cvv: number;
  expirationDate: string;
};

export type PaymentResponse = {
  message: string;
  headers?: Record<string, string>;
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = (await request.json()) as PaymentPayload;
  console.log("POST payment payload:", payload);

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "ok",
    headers,
  });
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = (await request.json()) as PaymentPayload;
  console.log("DELETE payment payload:", payload);

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "ok",
    headers,
  });
}

export async function PATCH(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = (await request.json()) as PaymentPayload;
  console.log("PATCH payment payload:", payload);

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "ok",
    headers,
  });
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = (await request.json()) as PaymentPayload;
  console.log("PUT payment payload:", payload);

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "ok",
    headers,
  });
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const searchParams = request.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());
  console.log("GET payment params:", params);

  // Extract request headers
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "ok",
    headers,
  });
}
