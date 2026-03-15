import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { request, type FullConfig } from "@playwright/test";
import {
  E2E_ADMIN_EMAIL,
  E2E_ADMIN_PASSWORD,
  E2E_DATA_FILE,
  E2E_TRIP_TITLE,
  E2E_USER_EMAIL,
  E2E_USER_PASSWORD,
} from "./helpers/constants";

export default async function globalSetup(config: FullConfig) {
  const baseURL =
    config.projects[0]?.use?.baseURL?.toString() ??
    process.env.PLAYWRIGHT_BASE_URL ??
    "http://127.0.0.1:3000";

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

  const api = await request.newContext({ baseURL });

  await prisma.user.deleteMany({
    where: {
      email: {
        in: [E2E_ADMIN_EMAIL, E2E_USER_EMAIL],
      },
    },
  });

  async function ensureUser(name: string, email: string, password: string) {
    const response = await api.post("/api/auth/sign-up/email", {
      data: { name, email, password },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to ensure E2E user ${email}: ${text}`);
    }

    return prisma.user.findUniqueOrThrow({ where: { email } });
  }

  const [adminUser, normalUser] = await Promise.all([
    ensureUser("E2E Admin", E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD),
    ensureUser("E2E User", E2E_USER_EMAIL, E2E_USER_PASSWORD),
  ]);

  await prisma.user.update({
    where: { id: adminUser.id },
    data: { role: "ADMIN" },
  });

  const trip =
    (await prisma.trip.findFirst({
      where: {
        city: "Rio de Janeiro",
        location: "Playwright Pier",
      },
    })) ??
    (await prisma.trip.create({
      data: {
        city: "Rio de Janeiro",
        location: "Playwright Pier",
        priceCents: 19900,
        isPublished: false,
        title: {
          pt: E2E_TRIP_TITLE,
          en: "Playwright E2E Tour",
          es: "Tour E2E Playwright",
          sv: "Playwright E2E Tur",
        },
        description: {
          pt: "Passeio criado para testes E2E.",
          en: "Tour created for E2E tests.",
          es: "Tour creado para pruebas E2E.",
          sv: "Tur skapad for E2E-tester.",
        },
        highlights: {
          pt: ["Reserva automatizada"],
          en: ["Automated booking"],
          es: ["Reserva automatizada"],
          sv: ["Automatiserad bokning"],
        },
        imageUrl: "/images/placeholder.svg",
      },
    }));

  await prisma.trip.update({
    where: { id: trip.id },
    data: {
      isPublished: false,
      title: {
        pt: E2E_TRIP_TITLE,
        en: "E2E TEST - DO NOT USE",
        es: "PRUEBA E2E - NO USAR",
        sv: "E2E-TEST - ANVAND INTE",
      },
      location: "Playwright Pier",
    },
  });

  const futureStart = new Date();
  futureStart.setDate(futureStart.getDate() + 10);
  futureStart.setHours(9, 0, 0, 0);
  const futureEnd = new Date(futureStart);
  futureEnd.setHours(futureStart.getHours() + 4);

  const schedule =
    (await prisma.tripSchedule.findFirst({
      where: {
        tripId: trip.id,
        status: "OPEN",
        startAt: { gte: new Date() },
      },
      orderBy: { startAt: "asc" },
    })) ??
    (await prisma.tripSchedule.create({
      data: {
        tripId: trip.id,
        startAt: futureStart,
        endAt: futureEnd,
        capacity: 12,
        pricePerPersonCents: 19900,
        status: "OPEN",
      },
    }));

  await prisma.booking.deleteMany({
    where: {
      userId: normalUser.id,
      tripId: trip.id,
    },
  });

  fs.writeFileSync(
    path.join(process.cwd(), E2E_DATA_FILE),
    JSON.stringify(
      {
        tripId: trip.id,
        scheduleId: schedule.id,
        adminEmail: E2E_ADMIN_EMAIL,
        userEmail: E2E_USER_EMAIL,
      },
      null,
      2
    )
  );

  await api.dispose();
  await prisma.$disconnect();
}
