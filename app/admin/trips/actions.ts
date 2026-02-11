"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteTrip(tripId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        return {
            error: "Unauthorized",
        };
    }

    try {
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
            error: "Failed to delete trip",
        };
    }
}
