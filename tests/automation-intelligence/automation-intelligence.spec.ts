import { test, expect } from '@playwright/test';

// Needs a running server with FINGERPRINT_SECRET_API_KEY / FINGERPRINT_REGION set;
// the page calls the real Automation Intelligence API. Usage:
//   BASE_URL=http://localhost:3000 npx playwright test tests/automation-intelligence --project=chromium
// Asserts structure only: whether this browser is detected as a bot is what the page is for observing.
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(baseUrl);

// Locally there is no proxy adding a client-IP header, so supply one.
if (isLocal) {
  test.use({ extraHTTPHeaders: { 'x-forwarded-for': '8.8.8.8' } });
}

const url = (query = '') => `${baseUrl}/automation-intelligence${query}`;

async function readRaw(page) {
  const raw = page.locator('#ai-raw pre');
  await raw.waitFor({ state: 'visible', timeout: 15 * 1000 });
  return JSON.parse((await raw.textContent()) ?? '');
}

test('analysis result is rendered with the raw edge response', async ({ page }) => {
  await page.goto(url());

  await expect(page.locator('#ai-error')).toHaveCount(0);
  const eventId = (await page.locator('#ai-event-id').textContent())?.trim();
  expect(eventId).toBeTruthy();

  const raw = await readRaw(page);
  expect(raw.source).toBe('edge');
  expect(raw.event_id).toBe(eventId);
  expect(raw.ip_info).toBeTruthy();

  // Either a bot is described, or the page says none was detected.
  const botInfo = await page.locator('#ai-bot-info').count();
  const noBot = await page.locator('#ai-no-bot').count();
  expect(botInfo + noBot).toBe(1);
  await expect(page.locator('#ai-ip-source')).toBeVisible();
});

test('a valid agent label is shown and sent as a tag', async ({ page }) => {
  await page.goto(url('?agent=playwright-chromium'));

  await expect(page.locator('#ai-agent-label')).toHaveText('playwright-chromium');
  const raw = await readRaw(page);
  expect(raw.tags).toMatchObject({ agent: 'playwright-chromium' });
});

test('an invalid agent label is ignored', async ({ page }) => {
  await page.goto(url('?agent=%3Cscript%3E'));

  await expect(page.locator('#ai-agent-label')).toHaveCount(0);
  const raw = await readRaw(page);
  expect(raw.tags?.agent).toBeUndefined();
});

test('each visit is analyzed independently', async ({ page }) => {
  await page.goto(url());
  const first = {
    eventId: await page.locator('#ai-event-id').textContent(),
    linkedId: await page.locator('#ai-linked-id').textContent(),
  };

  await page.goto(url());
  const second = {
    eventId: await page.locator('#ai-event-id').textContent(),
    linkedId: await page.locator('#ai-linked-id').textContent(),
  };

  expect(second.eventId).not.toBe(first.eventId);
  expect(second.linkedId).not.toBe(first.linkedId);
});
