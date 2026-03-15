import { expect, test } from "@playwright/test";

test("renders tours listing", async ({ page }) => {
  await page.goto("/pt/tours");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/tour|passeio|experi/i);
});

test("redirects reservas to login when unauthenticated", async ({ page }) => {
  await page.goto("/pt/reservas");

  await expect(page).toHaveURL(/\/pt\/login/);
});
