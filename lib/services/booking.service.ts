import { prisma } from "@/lib/prisma";
import { DomainError } from "@/lib/errors/domain-error";

const USER_CANCELLATION_WINDOW_HOURS = 24;

export interface CreateBookingInput {
    tripId: string;
    scheduleId?: string;
    guestCount?: number;
}

export async function listBookingsForUser(userId: string) {
    return prisma.booking.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            trip: { select: { id: true, title: true, city: true, priceCents: true } },
            schedule: { select: { startAt: true } },
        },
    });
}

export async function listAllBookings() {
    return prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            trip: { select: { id: true, title: true, city: true, priceCents: true } },
            schedule: { select: { startAt: true } },
            user: { select: { name: true, email: true } },
        },
    });
}

export async function createBookingForUser(userId: string, input: CreateBookingInput) {
    const tripId = typeof input.tripId === "string" ? input.tripId.trim() : "";
    const scheduleId = typeof input.scheduleId === "string" ? input.scheduleId.trim() : undefined;
    const guestCount =
        typeof input.guestCount === "number" && input.guestCount > 0 ? Math.floor(input.guestCount) : 1;

    if (!tripId) {
        throw new DomainError("Campo obrigatorio: tripId", {
            code: "INVALID_TRIP_ID",
            status: 400,
        });
    }

    const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        select: {
            id: true,
            priceCents: true,
            maxGuests: true,
            schedules: {
                where: { status: "OPEN" },
                select: { id: true },
                take: 1,
            },
        },
    });

    if (!trip) {
        throw new DomainError("Trip nao encontrada", {
            code: "TRIP_NOT_FOUND",
            status: 404,
        });
    }

    const hasOpenSchedules = trip.schedules.length > 0;

    if (hasOpenSchedules && !scheduleId) {
        throw new DomainError("Selecione uma data disponivel para concluir a reserva.", {
            code: "SCHEDULE_REQUIRED",
            status: 400,
        });
    }

    if (trip.maxGuests && guestCount > trip.maxGuests) {
        throw new DomainError(`Maximo de ${trip.maxGuests} hospedes para esta viagem.`, {
            code: "MAX_GUESTS_EXCEEDED",
            status: 400,
        });
    }

    const duplicateBooking = await prisma.booking.findFirst({
        where: scheduleId
            ? {
                  userId,
                  scheduleId,
                  status: { in: ["PENDING", "CONFIRMED"] },
              }
            : {
                  userId,
                  tripId,
                  scheduleId: null,
                  status: { in: ["PENDING", "CONFIRMED"] },
              },
        select: { id: true },
    });

    if (duplicateBooking) {
        throw new DomainError(
            scheduleId ? "Voce ja possui reserva para esta data" : "Voce ja possui reserva para esse passeio",
            {
                code: "DUPLICATE_BOOKING",
                status: 409,
            }
        );
    }

    let totalPriceCents = trip.priceCents * guestCount;

    if (scheduleId) {
        const [schedule, bookedGuests] = await Promise.all([
            prisma.tripSchedule.findUnique({
                where: { id: scheduleId },
                select: {
                    id: true,
                    tripId: true,
                    capacity: true,
                    pricePerPersonCents: true,
                    status: true,
                },
            }),
            prisma.booking.aggregate({
                where: {
                    scheduleId,
                    status: { in: ["PENDING", "CONFIRMED"] },
                },
                _sum: { guestCount: true },
            }),
        ]);

        if (!schedule || schedule.tripId !== tripId || schedule.status === "CLOSED") {
            throw new DomainError("Agenda nao disponivel", {
                code: "SCHEDULE_UNAVAILABLE",
                status: 400,
            });
        }

        const usedCapacity = bookedGuests._sum.guestCount ?? 0;

        if (schedule.capacity > 0 && usedCapacity + guestCount > schedule.capacity) {
            throw new DomainError("Capacidade esgotada para esta data", {
                code: "SCHEDULE_CAPACITY_EXCEEDED",
                status: 400,
            });
        }

        totalPriceCents = schedule.pricePerPersonCents * guestCount;
    }

    return prisma.booking.create({
        data: {
            userId,
            tripId,
            scheduleId,
            guestCount,
            totalPriceCents,
            status: "PENDING",
            paymentStatus: "UNPAID",
        },
        include: {
            trip: { select: { id: true, title: true, city: true, priceCents: true } },
        },
    });
}

export async function cancelBookingForUser(userId: string, bookingId: string) {
    const normalizedBookingId = typeof bookingId === "string" ? bookingId.trim() : "";

    if (!normalizedBookingId) {
        throw new DomainError("bookingId invalido", {
            code: "INVALID_BOOKING_ID",
            status: 400,
        });
    }

    const booking = await prisma.booking.findUnique({
        where: { id: normalizedBookingId },
        select: {
            id: true,
            userId: true,
            status: true,
            schedule: {
                select: { startAt: true },
            },
        },
    });

    if (!booking) {
        throw new DomainError("Reserva nao encontrada", {
            code: "BOOKING_NOT_FOUND",
            status: 404,
        });
    }

    if (booking.userId !== userId) {
        throw new DomainError("Sem permissao", {
            code: "BOOKING_FORBIDDEN",
            status: 403,
        });
    }

    if (booking.status === "CANCELED") {
        return { ok: true, status: "CANCELED" as const };
    }

    if (booking.schedule?.startAt) {
        const cancellationDeadline = new Date(
            booking.schedule.startAt.getTime() - USER_CANCELLATION_WINDOW_HOURS * 60 * 60 * 1000
        );

        if (new Date() > cancellationDeadline) {
            throw new DomainError(
                `Cancelamentos online precisam ser feitos com pelo menos ${USER_CANCELLATION_WINDOW_HOURS}h de antecedencia.`,
                {
                    code: "CANCELLATION_WINDOW_EXPIRED",
                    status: 400,
                }
            );
        }
    }

    return prisma.booking.update({
        where: { id: normalizedBookingId },
        data: { status: "CANCELED" },
        select: { id: true, status: true },
    });
}
