
import { test, expect } from "@playwright/test";

const baseDomain = "https://experiments.martinmakarsky.com";

test("Flow payment form POST shows Incognito text", async ({ page }) => {
  await page.goto(`${baseDomain}/payment-17-2-26`);
  await page.waitForLoadState("networkidle");

  // Click the first visible "POST" button (Fetch/XHR/HTTP Form section).
  const postButton = page.getByRole("button", { name: /POST/i }).first();
  await postButton.click();

  // After the POST response, the page should render "Incognito!" somewhere.
  await expect(page.getByText("Incognito!")).toBeVisible({ timeout: 15_000 });
});