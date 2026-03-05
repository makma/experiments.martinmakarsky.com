import type { NextApiRequest, NextApiResponse } from "next";
import { FingerprintServerApiClient, Region } from "@fingerprint/node-sdk";

const apiKey = process.env.FINGERPRINT_SECRET_API_KEY;

const client =
  apiKey &&
  new FingerprintServerApiClient({
    region: Region.EU,
    apiKey,
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!client) {
    return res
      .status(500)
      .json({ error: "Server API client not configured (missing API key)" });
  }

  const { eventId } = req.query;

  if (!eventId || Array.isArray(eventId)) {
    return res.status(400).json({ error: "eventId query parameter required" });
  }

  try {
    const event = await client.getEvent(eventId);
    return res.status(200).json({ event });
  } catch (error: any) {
    console.error("Failed to fetch event details:", error);
    return res.status(500).json({
      error: error?.message ?? "Failed to fetch event details",
    });
  }
}

