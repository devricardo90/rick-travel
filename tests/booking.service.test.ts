import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  trip: {
    findUnique: vi.fn(),
  },
  booking: {
    findFirst: vi.fn(),
    aggregate: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  tripSchedule: {
    findUnique: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { DomainError } from "@/lib/errors/domain-error";
import { cancelBookingForUser, createBookingForUser } from "@/lib/services/booking.service";

describe("booking.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("requires a schedule when the trip has open schedules", async () => {
    prismaMock.trip.findUnique.mockResolvedValue({
      id: "trip-1",
      priceCents: 10000,
      maxGuests: 10,
      schedules: [{ id: "schedule-1" }],
    });

    await expect(createBookingForUser("user-1", { tripId: "trip-1" })).rejects.toMatchObject({
      code: "SCHEDULE_REQUIRED",
    } satisfies Partial<DomainError>);
  });

  it("blocks duplicate bookings for the same schedule", async () => {
    prismaMock.trip.findUnique.mockResolvedValue({
      id: "trip-1",
      priceCents: 10000,
      maxGuests: 10,
      schedules: [{ id: "schedule-1" }],
    });
    prismaMock.booking.findFirst.mockResolvedValue({ id: "booking-1" });

    await expect(
      createBookingForUser("user-1", { tripId: "trip-1", scheduleId: "schedule-1" })
    ).rejects.toMatchObject({
      code: "DUPLICATE_BOOKING",
    } satisfies Partial<DomainError>);
  });

  it("blocks booking when schedule capacity is exceeded", async () => {
    prismaMock.trip.findUnique.mockResolvedValue({
      id: "trip-1",
      priceCents: 10000,
      maxGuests: 10,
      schedules: [{ id: "schedule-1" }],
    });
    prismaMock.booking.findFirst.mockResolvedValue(null);
    prismaMock.tripSchedule.findUnique.mockResolvedValue({
      id: "schedule-1",
      tripId: "trip-1",
      capacity: 4,
      pricePerPersonCents: 12000,
      status: "OPEN",
    });
    prismaMock.booking.aggregate.mockResolvedValue({
      _sum: { guestCount: 3 },
    });

    await expect(
      createBookingForUser("user-1", {
        tripId: "trip-1",
        scheduleId: "schedule-1",
        guestCount: 2,
      })
    ).rejects.toMatchObject({
      code: "SCHEDULE_CAPACITY_EXCEEDED",
    } satisfies Partial<DomainError>);
  });

  it("creates a pending unpaid booking with schedule price when valid", async () => {
    prismaMock.trip.findUnique.mockResolvedValue({
      id: "trip-1",
      priceCents: 10000,
      maxGuests: 10,
      schedules: [{ id: "schedule-1" }],
    });
    prismaMock.booking.findFirst.mockResolvedValue(null);
    prismaMock.tripSchedule.findUnique.mockResolvedValue({
      id: "schedule-1",
      tripId: "trip-1",
      capacity: 10,
      pricePerPersonCents: 15000,
      status: "OPEN",
    });
    prismaMock.booking.aggregate.mockResolvedValue({
      _sum: { guestCount: 2 },
    });
    prismaMock.booking.create.mockResolvedValue({
      id: "booking-2",
      status: "PENDING",
      paymentStatus: "UNPAID",
      totalPriceCents: 30000,
    });

    const result = await createBookingForUser("user-1", {
      tripId: "trip-1",
      scheduleId: "schedule-1",
      guestCount: 2,
    });

    expect(prismaMock.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PENDING",
          paymentStatus: "UNPAID",
          totalPriceCents: 30000,
        }),
      })
    );
    expect(result).toMatchObject({
      id: "booking-2",
      status: "PENDING",
    });
  });

  it("blocks cancellation inside the 24h window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-20T10:00:00.000Z"));

    prismaMock.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      userId: "user-1",
      status: "PENDING",
      schedule: {
        startAt: new Date("2026-03-21T05:00:00.000Z"),
      },
    });

    await expect(cancelBookingForUser("user-1", "booking-1")).rejects.toMatchObject({
      code: "CANCELLATION_WINDOW_EXPIRED",
    } satisfies Partial<DomainError>);
  });
});
