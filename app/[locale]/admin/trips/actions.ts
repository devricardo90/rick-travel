"use server";

import { revalidatePath } from "next/cache";
import { TripInput } from "@/lib/schemas";
import { requireAdminSession } from "@/lib/authz";
import { createTripRecord, deleteTripRecord, updateTripRecord } from "@/lib/services/trip.service";
import { isDomainError } from "@/lib/errors/domain-error";

export async function createTrip(data: TripInput) {
    try {
        await requireAdminSession();
        await createTripRecord(data);
        revalidatePath("/admin/trips");
        return { success: true };
    } catch (error) {
        console.error("Error creating trip:", error);

        if (isDomainError(error)) {
            return { error: error.message };
        }

        return { error: "Failed to create trip" };
    }
}

export async function updateTrip(id: string, data: TripInput) {
    try {
        await requireAdminSession();
        await updateTripRecord(id, data);
        revalidatePath("/admin/trips");
        revalidatePath(`/admin/trips/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating trip:", error);

        if (isDomainError(error)) {
            return { error: error.message };
        }

        return { error: "Failed to update trip" };
    }
}

export async function deleteTrip(tripId: string) {
    try {
        await requireAdminSession();
        await deleteTripRecord(tripId);
        revalidatePath("/admin/trips");
        return { success: true };
    } catch (error) {
        console.error("Error deleting trip:", error);
        return {
            error: isDomainError(error)
                ? error.message
                : error instanceof Error
                    ? error.message
                    : "Failed to delete trip",
        };
    }
}
