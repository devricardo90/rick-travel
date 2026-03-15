"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { isDomainError } from "@/lib/errors/domain-error";

export async function updateContactStatus(contactId: string, status: "PENDING" | "READ" | "REPLIED") {
    try {
        await requireAdminSession();

        await prisma.contactSubmission.update({
            where: { id: contactId },
            data: { status },
        });

        revalidatePath("/admin/contacts");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        if (isDomainError(error)) {
            return { error: error.message };
        }

        console.error("Error updating contact status:", error);
        return { error: "Failed to update contact status" };
    }
}
