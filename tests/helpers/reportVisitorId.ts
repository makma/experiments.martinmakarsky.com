import type { TestInfo } from '@playwright/test';

function extractField(raw: string | null | undefined, ...keys: string[]): string | undefined {
  if (raw == null || !raw.trim()) return undefined;
  const trimmed = raw.trim();
  try {
    const data = JSON.parse(trimmed) as Record<string, unknown>;
    for (const key of keys) {
      const val = data[key];
      if (typeof val === 'string' && val.length > 0) return val;
    }
  } catch {
    // fall through to regex
  }
  for (const key of keys) {
    const m = trimmed.match(new RegExp(`"${key}"\\s*:\\s*"([^"\\\\]*)"`));
    if (m) return m[1];
  }
  return undefined;
}

/** Adds visitorId to the HTML report (attachment + annotation) when present in rendered text. */
export async function reportVisitorId(
  info: TestInfo,
  raw: string | null | undefined,
): Promise<void> {
  const visitorId = extractField(raw, 'visitorId', 'visitor_id');
  if (!visitorId) return;
  const eventId = extractField(raw, 'event_id', 'requestId');
  const eventKey = raw?.includes('"event_id"') ? 'event_id' : 'requestId';
  if (eventId) console.log(`[${eventKey}] ${info.title}: ${eventId}`);
  await info.attach('visitorId.txt', {
    body: visitorId,
    contentType: 'text/plain',
  });
  info.annotations.push({ type: 'visitorId', description: visitorId });
}
