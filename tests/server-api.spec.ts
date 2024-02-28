import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Server API returns a response', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-cloudflare-server-api-sdk`);

  const preSelector = 'pre';
  const serverApiResponseElement = page.locator("#server-api-response");
  await serverApiResponseElement.waitFor({state: "visible"}, { timeout: 10 * 1000 })

  const serverApiText = await serverApiResponseElement.textContent();
  console.log(serverApiText);

  expect(serverApiText).toContain('\"visitorId\":');
});