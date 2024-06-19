import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Server API returns a response via Dotnet SDK', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-cloudflare-dotnet-server-api-sdk`);

  const serverApiResponseElement = page.locator("#server-api-response");
  await serverApiResponseElement.waitFor({state: "visible"}, { timeout: 10 * 1000 })

  const serverApiText = await serverApiResponseElement.textContent();

  expect(serverApiText).toContain('\"visitorId\":');
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
    
    const response = await fetch(`https://experiments-martinmakarsky.azurewebsites.net/api/visitor-data?visitorId=${visitorId}&deletionSecret=${deletionSecret}`, {
      method: "DELETE",
      headers: headers,
    });

  expect(response.status).toEqual(200);
});