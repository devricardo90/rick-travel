import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  trip: {
    findUnique: vi.fn(),
  },
  booking: {
    count: vi.fn(),
  },
  tripSchedule: {
    create: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { DomainError } from "@/lib/errors/domain-error";
import {
  createScheduleForTrip,
  deleteSchedule,
  listSchedulesWithOccupancy,
  updateScheduleStatus,
} from "@/lib/services/schedule.service";

describe("schedule.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid schedule range", async () => {
    await expect(
      createScheduleForTrip({
        tripId: "trip-1",
        startAt: new Date("2026-03-21T10:00:00.000Z"),
        endAt: new Date("2026-03-21T09:00:00.000Z"),
        capacity: 10,
        price: 10000,
      })
    ).rejects.toMatchObject({
      code: "INVALID_SCHEDULE_RANGE",
    } satisfies Partial<DomainError>);
  });

  it("rejects negative price", async () => {
    await expect(
      createScheduleForTrip({
        tripId: "trip-1",
        startAt: new Date("2026-03-21T08:00:00.000Z"),
        endAt: new Date("2026-03-21T09:00:00.000Z"),
        capacity: 10,
        price: -1,
      })
    ).rejects.toMatchObject({
      code: "INVALID_SCHEDULE_PRICE",
    } satisfies Partial<DomainError>);
  });

  it("blocks deleting schedules with active bookings", async () => {
    prismaMock.booking.count.mockResolvedValue(2);

    await expect(deleteSchedule("schedule-1")).rejects.toMatchObject({
      code: "SCHEDULE_HAS_ACTIVE_BOOKINGS",
    } satisfies Partial<DomainError>);
  });

  it("updates schedule status when schedule exists", async () => {
    prismaMock.tripSchedule.findUnique.mockResolvedValue({ id: "schedule-1" });
    prismaMock.tripSchedule.update.mockResolvedValue({ id: "schedule-1", status: "CLOSED" });

    const result = await updateScheduleStatus("schedule-1", "CLOSED");

    expect(prismaMock.tripSchedule.update).toHaveBeenCalledWith({
      where: { id: "schedule-1" },
      data: { status: "CLOSED" },
    });
    expect(result).toMatchObject({ status: "CLOSED" });
  });

  it("calculates occupancy and remaining capacity", async () => {
    prismaMock.tripSchedule.findMany.mockResolvedValue([
      {
        id: "schedule-1",
        tripId: "trip-1",
        capacity: 10,
        startAt: new Date("2026-03-21T08:00:00.000Z"),
        endAt: new Date("2026-03-21T12:00:00.000Z"),
        status: "OPEN",
        bookings: [
          { guestCount: 2, status: "PENDING" },
          { guestCount: 3, status: "CONFIRMED" },
        ],
      },
    ]);

    const result = await listSchedulesWithOccupancy("trip-1");

    expect(result[0]).toMatchObject({
      usedCapacity: 5,
      remainingCapacity: 5,
    });
  });
});
