import { NextRequest, NextResponse } from "next/server";
import { getEventDetail } from "../../../automation-intelligence/server-api";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json(
      { error: "eventId query parameter required" },
      { status: 400 }
    );
  }

  const result = await getEventDetail({
    eventId,
    secretKey: process.env.FINGERPRINT_SECRET_API_KEY,
    region: process.env.FINGERPRINT_REGION,
  });

  if (result.kind === "ok") {
    return NextResponse.json(
      { event: result.event },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  if (result.kind === "skipped") {
    return NextResponse.json(
      { error: result.message, reason: result.reason },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: result.message, code: result.code },
    { status: result.status ?? 502 }
  );
}
