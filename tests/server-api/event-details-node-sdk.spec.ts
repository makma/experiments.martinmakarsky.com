import { test, expect } from "@playwright/test";

const baseDomain = "https://experiments.martinmakarsky.com";

test("Agent v4 + Node SDK event details are rendered", async ({ page }) => {
  await page.goto(`${baseDomain}/v4/event-details-node-sdk`);

  // Wait for the server-side event details JSON to appear on the page.
  const eventDetailsPre = page
    .locator("pre")
    .filter({ hasText: '"event_id"' });

  await eventDetailsPre.waitFor({ state: "visible", timeout: 20_000 });

  const text = await eventDetailsPre.textContent();
  expect(text).toContain('"event_id"');
});

