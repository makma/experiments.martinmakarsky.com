import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Cloudflare Proxy Integration returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-react-cloudflare`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = await preElement.textContent();

  expect(preText).toContain('\"visitorId\":');
});

test('Cloudflare Proxy Integration on staging returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-cloudflare-staging`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = await preElement.textContent();

  expect(preText).toContain('\"visitorId\":');
});