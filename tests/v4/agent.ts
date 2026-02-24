
import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('V4 npm direct returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/v4/fingerprint-pro-npm-direct`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = await preElement.textContent();

  expect(preText).toContain('\"visitorId\":');
});

test('V4 npm custom subdomain returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/v4/fingerprint-pro-npm-custom-subdomain`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = await preElement.textContent();

  expect(preText).toContain('\"visitorId\":');
});