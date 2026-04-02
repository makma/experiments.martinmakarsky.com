import { test, expect } from '@playwright/test';
import { reportVisitorId } from '../helpers/reportVisitorId';

const baseDomain = "https://experiments.martinmakarsky.com"

test('Cloudflare Proxy Integration returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-react-cloudflare`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});

test('Custom Proxy Integration returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/custom-proxy-integration`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});

test('Custom Proxy Integration Open Client Response returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/custom-proxy-integration-open-client-response`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});

test('Custom subdomain returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-full-subdomain`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});

test('Custom subdomain on sample environment returns the visitorId', async ({ page }) => {
  await page.goto(`${baseDomain}/fingerprint-pro-full-subdomain-sample-environment`);

  const preSelector = 'pre';

  await page.waitForSelector(preSelector, { timeout: 10 * 1000 });
  const preElement = await page.$(preSelector);
  expect(preElement).not.toBeNull();
  const preText = await preElement!.textContent();
  await reportVisitorId(test.info(), preText);

  expect(preText).toContain('\"visitorId\":');
});