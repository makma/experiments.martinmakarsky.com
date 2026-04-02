import { test, expect } from '@playwright/test';
import { reportVisitorId } from '../helpers/reportVisitorId';

const baseDomain = "https://experiments.martinmakarsky.com"

test.skip('On demand integrations returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-on-demand-identification-pro-cdn`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});