import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Server API returns a response via Node SDK', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-cloudflare-server-api-sdk`);

  const serverApiResponseElement = page.locator("#server-api-response");
  await serverApiResponseElement.waitFor({state: "visible"}, { timeout: 10 * 1000 })

  const serverApiText = await serverApiResponseElement.textContent();

  expect(serverApiText).toContain('\"visitorId\":');
});

test('Check status of the webhook sgnature', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-cloudflare`);

  const preSelector = 'pre';
  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = JSON.parse(await preElement.textContent());

  const requestId = preText.requestId;

  await page.goto(`${baseDomain}/fingerprint-pro-webhook-event?requestId=${requestId}`);

  const webhookSignatureVerificationStatus = page.locator("#signature-verification-result-node-sdk");
  await webhookSignatureVerificationStatus.waitFor({state: "visible"}, { timeout: 10 * 1000 })

  const serverApiText = await webhookSignatureVerificationStatus.textContent();

  expect(serverApiText).toEqual("Valid");
});

test('Delete the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-cloudflare`);

  const preSelector = 'pre';
  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = JSON.parse(await preElement.textContent());

  const visitorId = preText.visitorId;

    const headers = {
      "Content-Type": "application/json",
    };

    const deletionSecret = process.env.DELETION_SECRET;

    if (!deletionSecret) {
      throw Error("Deletion secret not found")
    }

    const response = await fetch(`${baseDomain}/delete-by-visitorId/delete/`, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({ visitorIdToDelete: visitorId, deletionSecret: deletionSecret }),
    });

  expect(response.status).toEqual(200);
});