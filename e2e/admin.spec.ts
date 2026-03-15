import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

test("redirects admin to login when unauthenticated", async ({ page }) => {
  await page.goto("/pt/admin");

  await expect(page).toHaveURL(/\/pt\/login/);
});

test("loads admin dashboard after login", async ({ page }) => {
  await loginAsAdmin(page, "/pt/admin");

  await expect(page).toHaveURL(/\/pt\/admin/);
  await expect(page.getByRole("heading", { level: 1, name: /Dashboard Admin/i })).toBeVisible();
});
