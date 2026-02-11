"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        return {
            error: "Unauthorized",
        };
    }

    try {
        await prisma.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status,
            },
        });

        revalidatePath("/admin/bookings");
        revalidatePath("/admin"); // Updates dashboard stats too
        return { success: true };
    } catch (error) {
        console.error("Error updating booking:", error);
        return {
            error: "Failed to update booking status",
        };
    }
}
