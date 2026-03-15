import { prisma } from "@/lib/prisma";
import { DomainError } from "@/lib/errors/domain-error";

export interface CreateScheduleInput {
    tripId: string;
    startAt: Date;
    endAt: Date;
    capacity: number;
    price?: number | null;
}

export async function createScheduleForTrip(input: CreateScheduleInput) {
    if (Number.isNaN(input.startAt.getTime()) || Number.isNaN(input.endAt.getTime())) {
        throw new DomainError("Preencha datas validas para a agenda.", {
            code: "INVALID_SCHEDULE_DATE",
            status: 400,
        });
    }

    if (input.endAt <= input.startAt) {
        throw new DomainError("O termino da agenda precisa ser posterior ao inicio.", {
            code: "INVALID_SCHEDULE_RANGE",
            status: 400,
        });
    }

    if (!Number.isFinite(input.capacity) || input.capacity <= 0) {
        throw new DomainError("A capacidade precisa ser maior que zero.", {
            code: "INVALID_SCHEDULE_CAPACITY",
            status: 400,
        });
    }

    if (input.price !== null && input.price !== undefined && (!Number.isFinite(input.price) || input.price < 0)) {
        throw new DomainError("O preco da agenda nao pode ser negativo.", {
            code: "INVALID_SCHEDULE_PRICE",
            status: 400,
        });
    }

    const trip = await prisma.trip.findUnique({
        where: { id: input.tripId },
        select: { priceCents: true },
    });

    if (!trip) {
        throw new DomainError("Trip nao encontrada.", {
            code: "TRIP_NOT_FOUND",
            status: 404,
        });
    }

    const pricePerPersonCents =
        input.price !== null && input.price !== undefined ? input.price : trip.priceCents;

    return prisma.tripSchedule.create({
        data: {
            tripId: input.tripId,
            startAt: input.startAt,
            endAt: input.endAt,
            capacity: input.capacity,
            pricePerPersonCents,
        },
    });
}

export async function deleteSchedule(scheduleId: string) {
    const activeBookings = await prisma.booking.count({
        where: {
            scheduleId,
            status: { in: ["PENDING", "CONFIRMED"] },
        },
    });

    if (activeBookings > 0) {
        throw new DomainError("Nao e possivel excluir uma agenda com reservas ativas.", {
            code: "SCHEDULE_HAS_ACTIVE_BOOKINGS",
            status: 400,
        });
    }

    return prisma.tripSchedule.delete({
        where: { id: scheduleId },
    });
}

export async function updateScheduleStatus(scheduleId: string, status: "OPEN" | "CLOSED") {
    const schedule = await prisma.tripSchedule.findUnique({
        where: { id: scheduleId },
        select: { id: true },
    });

    if (!schedule) {
        throw new DomainError("Agenda nao encontrada.", {
            code: "SCHEDULE_NOT_FOUND",
            status: 404,
        });
    }

    return prisma.tripSchedule.update({
        where: { id: scheduleId },
        data: { status },
    });
}

export async function listSchedulesWithOccupancy(tripId: string) {
    const schedules = await prisma.tripSchedule.findMany({
        where: { tripId },
        orderBy: { startAt: "asc" },
        include: {
            bookings: {
                where: {
                    status: { in: ["PENDING", "CONFIRMED"] },
                },
                select: {
                    guestCount: true,
                    status: true,
                },
            },
        },
    });

    return schedules.map((schedule) => {
        const usedCapacity = schedule.bookings.reduce((sum, booking) => sum + booking.guestCount, 0);
        const remainingCapacity = Math.max(schedule.capacity - usedCapacity, 0);

        return {
            ...schedule,
            usedCapacity,
            remainingCapacity,
        };
    });
}
