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

const normalizePaymentPayload = (raw: Partial<Record<keyof PaymentPayload, unknown>>): PaymentPayload => {
  const parseCvv = (value: unknown): number => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    const parsed = parseInt(String(value ?? ""), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  return {
    cardNumber: typeof raw.cardNumber === "string" ? raw.cardNumber : "",
    cvv: parseCvv(raw.cvv),
    expirationDate: typeof raw.expirationDate === "string" ? raw.expirationDate : "",
  };
};

const parsePayload = async (request: NextRequest): Promise<PaymentPayload> => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const entries: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        entries[key] = value;
      }
    });
    return normalizePaymentPayload(entries);
  }

  const textBody = await request.text();

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(textBody);
    return normalizePaymentPayload(Object.fromEntries(params.entries()));
  }

  if (!textBody) {
    return normalizePaymentPayload({});
  }

  try {
    const jsonPayload = JSON.parse(textBody) as Partial<PaymentPayload>;
    return normalizePaymentPayload(jsonPayload);
  } catch {
    const params = new URLSearchParams(textBody);
    return normalizePaymentPayload(Object.fromEntries(params.entries()));
  }
};

const createResponse = (request: NextRequest, method: string, payload: PaymentPayload) => {
  console.log(`${method} payment payload:`, payload);
  const headers = Object.fromEntries(request.headers);

  return NextResponse.json({
    message: "ok",
    headers,
  });
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = await parsePayload(request);
  return createResponse(request, "POST", payload);
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = await parsePayload(request);
  return createResponse(request, "DELETE", payload);
}

export async function PATCH(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = await parsePayload(request);
  return createResponse(request, "PATCH", payload);
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<PaymentResponse>> {
  const payload = await parsePayload(request);
  return createResponse(request, "PUT", payload);
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
