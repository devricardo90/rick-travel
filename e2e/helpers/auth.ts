import type { Page } from "@playwright/test";
import {
  E2E_ADMIN_EMAIL,
  E2E_ADMIN_PASSWORD,
  E2E_USER_EMAIL,
  E2E_USER_PASSWORD,
} from "./constants";

async function login(page: Page, email: string, password: string, redirectTo: string) {
  await page.goto(`/pt/login?redirect=${encodeURIComponent(redirectTo)}`);
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/senha|password/i).fill(password);
  const signInResponse = page.waitForResponse(
    (response) => response.url().includes("/api/auth/sign-in/email") && response.request().method() === "POST"
  );
  await page.getByRole("button", { name: /entrar|login/i }).click();
  await signInResponse;
  await page.waitForLoadState("networkidle");
  await page.goto(redirectTo);
}

export async function loginAsAdmin(page: Page, redirectTo: string = "/pt/admin") {
  await login(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, redirectTo);
}

export async function loginAsUser(page: Page, redirectTo: string = "/pt") {
  await login(page, E2E_USER_EMAIL, E2E_USER_PASSWORD, redirectTo);
}
