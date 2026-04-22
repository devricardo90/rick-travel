"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAdminSession } from "@/lib/authz";
import { sendBookingConfirmationEmail } from "@/lib/services/email.service";
import { prisma } from "@/lib/prisma";
import { isDomainError } from "@/lib/errors/domain-error";

type BookingStatus = Prisma.BookingGetPayload<{ select: { status: true } }>["status"];

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
    try {
        await requireAdminSession();

        const previous = await prisma.booking.findUnique({
            where: { id: bookingId },
            select: { status: true },
        });

        if (!previous) {
            return { error: "Booking nÃ£o encontrado" };
        }

        await prisma.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status,
            },
        });

        if (status === "CONFIRMED" && previous.status !== "CONFIRMED") {
            await sendBookingConfirmationEmail(bookingId);
        }

        revalidatePath("/admin/bookings");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        if (isDomainError(error)) {
            return { error: error.message };
        }

        console.error("Error updating booking:", error);
        return {
            error: "Failed to update booking status",
        };
    }
}
