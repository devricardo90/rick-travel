"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { tripSchema, TripInput } from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { translateText, translateArray } from "@/lib/translation-service";

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

        // Convert dates from string to Date object if they exist
        const startDate = validated.startDate ? new Date(validated.startDate) : null;
        const endDate = validated.endDate ? new Date(validated.endDate) : null;

        // Auto-translate title, description, and highlights from PT to other languages
        console.log('📝 Translating trip content...');

        const translatedTitle = await translateText(validated.title, 'pt');
        const translatedDescription = validated.description
            ? await translateText(validated.description, 'pt')
            : null;
        const translatedHighlights = validated.highlights?.length
            ? await translateArray(validated.highlights, 'pt')
            : { pt: [], en: [], es: [], sv: [] };

        console.log('✅ Translation complete');

        await prisma.trip.create({
            data: {
                title: translatedTitle as Prisma.InputJsonValue,
                description: translatedDescription as Prisma.InputJsonValue,
                highlights: translatedHighlights as Prisma.InputJsonValue,
                city: validated.city,
                priceCents: validated.priceCents,
                imageUrl: validated.imageUrl,
                location: validated.location,
                maxGuests: validated.maxGuests,
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

        // Auto-translate title, description, and highlights from PT to other languages
        console.log('📝 Translating updated trip content...');

        const translatedTitle = await translateText(validated.title, 'pt');
        const translatedDescription = validated.description
            ? await translateText(validated.description, 'pt')
            : null;
        const translatedHighlights = validated.highlights?.length
            ? await translateArray(validated.highlights, 'pt')
            : { pt: [], en: [], es: [], sv: [] };

        console.log('✅ Translation complete');

        await prisma.trip.update({
            where: { id },
            data: {
                title: translatedTitle as Prisma.InputJsonValue,
                description: translatedDescription as Prisma.InputJsonValue,
                highlights: translatedHighlights as Prisma.InputJsonValue,
                city: validated.city,
                priceCents: validated.priceCents,
                imageUrl: validated.imageUrl,
                location: validated.location,
                maxGuests: validated.maxGuests,
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
