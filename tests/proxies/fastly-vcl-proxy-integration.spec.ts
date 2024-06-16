import { test, expect } from '@playwright/test';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Fastly VCL Proxy Integration returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-fastly-vcl`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = await preElement.textContent();

  expect(preText).toContain('\"visitorId\":');
});

test('Fastly VCL Proxy Integration Staging returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-fastly-vcl-staging`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  const preText = await preElement.textContent();

  expect(preText).toContain('\"visitorId\":');
});