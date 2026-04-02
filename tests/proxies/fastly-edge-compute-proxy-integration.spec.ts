import { test, expect } from '@playwright/test';
import { reportVisitorId } from '../helpers/reportVisitorId';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Fastly Edge Compute Proxy Integration returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-fastly-compute-edge-proxy-integration-open-client-response`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"sealedResult\":');
});