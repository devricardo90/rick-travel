import { expect, test } from "@playwright/test";
import { PrismaClient, type Booking, type PaymentStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { loginAsAdmin, loginAsUser } from "./helpers/auth";
import { E2E_USER_EMAIL } from "./helpers/constants";
import { readE2EData } from "./helpers/e2e-data";
import { confirmBookingByAdmin } from "../lib/services/booking.service";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set for RT-022A smoke.");
}

const databaseHost = new URL(databaseUrl).hostname;

if (!["localhost", "127.0.0.1"].includes(databaseHost)) {
  throw new Error("Refusing RT-022A smoke: DATABASE_URL is not local.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

async function createSmokeBooking(status: Booking["status"], paymentStatus: PaymentStatus) {
  const data = readE2EData();
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: E2E_USER_EMAIL },
    select: { id: true },
  });

  return prisma.booking.create({
    data: {
      userId: user.id,
      tripId: data.tripId,
      scheduleId: data.scheduleId,
      guestCount: 1,
      totalPriceCents: 19900,
      status,
      paymentStatus,
    },
  });
}

async function getBooking(id: string) {
  return prisma.booking.findUniqueOrThrow({
    where: { id },
    select: { id: true, status: true, paymentStatus: true },
  });
}

test.describe.serial("RT-022A admin booking actions local smoke", () => {
  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("anonymous and non-admin access remains blocked", async ({ page }) => {
    await page.goto("/pt/admin/bookings");
    await expect(page).toHaveURL(/\/pt\/login/);

    await loginAsUser(page, "/pt/admin/bookings");
    await expect(page.getByText(/Acesso negado|Nao autorizado|Não autorizado/i)).toBeVisible();
  });

  test("admin can list bookings, open detail, and confirm a pending booking without changing paymentStatus", async ({
    page,
  }) => {
    const booking = await createSmokeBooking("PENDING", "PAID");

    await loginAsAdmin(page, "/pt/admin/bookings");
    await expect(page.getByRole("heading", { name: "Reservas" })).toBeVisible();
    await expect(page.getByTitle(booking.id)).toBeVisible();

    await page.goto(`/pt/admin/bookings/${booking.id}`);
    await expect(page.getByRole("heading", { name: "Detalhe da Reserva" })).toBeVisible();
    await expect(page.getByText("Pendente")).toBeVisible();
    await expect(page.getByText("Pago")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Confirmar Reserva" }).click();

    await expect(page.getByText("Confirmada")).toBeVisible();
    await expect(page.getByText("Pago")).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirmar Reserva" })).toHaveCount(0);

    await expect.poll(async () => getBooking(booking.id)).toMatchObject({
      status: "CONFIRMED",
      paymentStatus: "PAID",
    });
  });

  test("admin can cancel a pending booking", async ({ page }) => {
    const booking = await createSmokeBooking("PENDING", "UNPAID");

    await loginAsAdmin(page, `/pt/admin/bookings/${booking.id}`);
    await expect(page.getByText("Pendente")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Cancelar Reserva" }).click();

    await expect(page).toHaveURL(/\/pt\/admin\/bookings$/);
    await expect.poll(async () => getBooking(booking.id)).toMatchObject({
      status: "CANCELED",
      paymentStatus: "UNPAID",
    });
  });

  test("admin can cancel a confirmed booking", async ({ page }) => {
    const booking = await createSmokeBooking("CONFIRMED", "PAID");

    await loginAsAdmin(page, `/pt/admin/bookings/${booking.id}`);
    await expect(page.getByText("Confirmada")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Cancelar Reserva" }).click();

    await expect(page).toHaveURL(/\/pt\/admin\/bookings$/);
    await expect.poll(async () => getBooking(booking.id)).toMatchObject({
      status: "CANCELED",
      paymentStatus: "PAID",
    });
  });

  test("canceled booking detail shows no invalid action", async ({ page }) => {
    const booking = await createSmokeBooking("CANCELED", "UNPAID");

    await loginAsAdmin(page, `/pt/admin/bookings/${booking.id}`);

    await expect(page.getByText("Cancelada")).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirmar Reserva" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Cancelar Reserva" })).toHaveCount(0);
  });

  test("invalid confirmation transitions are blocked server-side", async () => {
    const confirmedBooking = await createSmokeBooking("CONFIRMED", "UNPAID");
    const canceledBooking = await createSmokeBooking("CANCELED", "UNPAID");

    await expect(confirmBookingByAdmin(confirmedBooking.id)).rejects.toMatchObject({
      code: "INVALID_STATUS_FOR_CONFIRMATION",
    });
    await expect(confirmBookingByAdmin(canceledBooking.id)).rejects.toMatchObject({
      code: "INVALID_STATUS_FOR_CONFIRMATION",
    });
  });
});
