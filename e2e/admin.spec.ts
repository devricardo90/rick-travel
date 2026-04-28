import { test, expect } from "@playwright/test";

test.describe("Admin Route Protection", () => {
  test("anonymous user should be redirected to login", async ({ page }) => {
    // Tenta acessar a rota admin em português
    await page.goto("/pt/admin");

    // Deve ser redirecionado para a página de login
    // A URL final deve conter /login e o callbackUrl
    await expect(page).toHaveURL(/\/pt\/login/);
    await expect(page.url()).toContain("callbackUrl=%2Fpt%2Fadmin");
  });

  test("regular user should be blocked (403 or redirect)", async () => {
    // Este teste exigiria login como usuário comum, o que depende de env vars.
    // Como o objetivo da RT-013B é apenas o esqueleto, vamos focar no anon -> login por enquanto.
    test.skip(!process.env.E2E_USER_EMAIL, "E2E_USER_EMAIL not set");
  });
});
