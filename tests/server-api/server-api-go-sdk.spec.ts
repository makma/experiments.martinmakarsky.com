import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Server API returns a response via Go SDK', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-cloudflare-go-server-api-sdk`);

  const serverApiResponseElement = page.locator("#server-api-response");
  await serverApiResponseElement.waitFor({state: "visible"}, { timeout: 10 * 1000 })

  const serverApiText = await serverApiResponseElement.textContent();

  expect(serverApiText).toContain('\"visitorId\":');
});