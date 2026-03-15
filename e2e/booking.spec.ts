import { expect, test } from "@playwright/test";
import { loginAsUser } from "./helpers/auth";
import { readE2EData } from "./helpers/e2e-data";

test("creates a booking for the E2E trip", async ({ page }) => {
  const data = readE2EData();

  await loginAsUser(page, `/pt/tours/${data.tripId}`);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const bookingResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/bookings") && response.request().method() === "POST"
  );
  await page.getByRole("button", { name: /reservar agora|reserve now/i }).click();
  const bookingResponse = await bookingResponsePromise;
  expect(bookingResponse.status()).toBe(201);

  await page.goto("/pt/reservas");
  await expect(page.getByText(/TESTE E2E - NAO USAR/i)).toBeVisible();
});
