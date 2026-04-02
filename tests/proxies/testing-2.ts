import { test, expect } from '@playwright/test';
import { reportVisitorId } from '../helpers/reportVisitorId';

const baseDomain = "https://experiments.cfi-fingerprint.com"

test('Cloudflare Proxy Integration returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/testing-2`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});