"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { tripSchema, TripInput } from "@/lib/schemas";
import { z } from "zod";

async function checkAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function createTrip(data: TripInput) {
    try {
        await checkAdmin();

        const validated = tripSchema.parse(data);

        // Converter datas de string para Date object se existirem
        const startDate = validated.startDate ? new Date(validated.startDate) : null;
        const endDate = validated.endDate ? new Date(validated.endDate) : null;

        await prisma.trip.create({
            data: {
                ...validated,
                startDate,
                endDate,
            },
        });

        revalidatePath("/admin/trips");
        return { success: true };
    } catch (error) {
        console.error("Error creating trip:", error);
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        return { error: "Failed to create trip" };
    }
}

export async function updateTrip(id: string, data: TripInput) {
    try {
        await checkAdmin();

        const validated = tripSchema.parse(data);

        const startDate = validated.startDate ? new Date(validated.startDate) : null;
        const endDate = validated.endDate ? new Date(validated.endDate) : null;

        await prisma.trip.update({
            where: { id },
            data: {
                ...validated,
                startDate,
                endDate,
            },
        });

        revalidatePath("/admin/trips");
        revalidatePath(`/admin/trips/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating trip:", error);
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        return { error: "Failed to update trip" };
    }
}

export async function deleteTrip(tripId: string) {
    try {
        await checkAdmin();

        /* VALIDATION: Check for active bookings before deleting */
        const activeBookings = await prisma.booking.count({
            where: {
                tripId: tripId,
                status: {
                    in: ["CONFIRMED", "PENDING"]
                }
            }
        });

        if (activeBookings > 0) {
            return { error: `Não é possível deletar: Existem ${activeBookings} reservas ativas.` };
        }

        await prisma.trip.delete({
            where: {
                id: tripId,
            },
        });

        revalidatePath("/admin/trips");
        return { success: true };
    } catch (error) {
        console.error("Error deleting trip:", error);
        return {
            error: error instanceof Error ? error.message : "Failed to delete trip",
        };
    }
}
