
import { test, expect } from "@playwright/test";

const baseDomain = "https://experiments.martinmakarsky.com";

test("Flow payment form POST shows Incognito text", async ({ page }) => {
  await page.goto(`${baseDomain}/payment-17-2-26`);
  await page.waitForLoadState("networkidle");

  // Click the first visible "POST" button (Fetch/XHR/HTTP Form section).
  const postButton = page.getByRole("button", { name: /POST/i }).first();
  await postButton.click();

  // After the POST response, the page should render "Incognito!" somewhere.
  await expect(page.getByText("Bot!")).toBeVisible({ timeout: 15_000 });
});

test("Flow - 401 DevTools detection", async ({ page }) => {
  await page.goto(`${baseDomain}/payment-17-2-26`);
  await page.waitForLoadState("networkidle");

  await page.waitForTimeout(2000);

  const postButton = page.getByRole("button", { name: /POST/i }).first();

  const [response] = await Promise.all([
    page.waitForResponse((res) => res.request().method() === "POST", { timeout: 15_000 }),
    postButton.click(),
  ]);

  expect(response.status()).toBe(401);

  const body = await response.json();
  expect(body).toEqual({ message: "Welcome to GH Action Test" });
});