
import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Akamai Proxy Integration returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-react-akamai`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = await preElement.textContent();

  expect(preText).toContain('\"visitorId\":');
});