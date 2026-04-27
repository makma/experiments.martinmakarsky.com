import type { TestInfo } from '@playwright/test';

function extractVisitorId(raw: string | null | undefined): string | undefined {
  if (raw == null || !raw.trim()) return undefined;
  const trimmed = raw.trim();
  try {
    const data = JSON.parse(trimmed) as Record<string, unknown>;
    const id = data.visitorId ?? data.visitor_id;
    if (typeof id === 'string' && id.length > 0) return id;
  } catch {
    // Root may not be JSON (e.g. partial markup); fall through to regex.
  }
  const m =
    trimmed.match(/"visitorId"\s*:\s*"([^"\\]*)"/) ??
    trimmed.match(/"visitor_id"\s*:\s*"([^"\\]*)"/);
  return m?.[1];
}

/** Adds visitorId to the HTML report (attachment + annotation) when present in rendered text. */
export async function reportVisitorId(
  info: TestInfo,
  raw: string | null | undefined,
): Promise<void> {
  const visitorId = extractVisitorId(raw);
  if (!visitorId) return;
  console.log(`[visitorId] ${info.title}: ${visitorId}`);
  await info.attach('visitorId.txt', {
    body: visitorId,
    contentType: 'text/plain',
  });
  info.annotations.push({ type: 'visitorId', description: visitorId });
}
