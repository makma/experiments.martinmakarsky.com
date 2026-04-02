
import { test, expect } from '@playwright/test';
import { reportVisitorId } from '../helpers/reportVisitorId';

const baseDomain = "https://experiments.martinmakarsky.com"

test('V4 npm direct returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/v4/fingerprint-pro-npm-direct`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});

test('V4 npm custom subdomain returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/v4/fingerprint-pro-npm-custom-subdomain`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});

test('V4 ODI NPM returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/v4/fingerprint-on-demand-identification-npm`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});