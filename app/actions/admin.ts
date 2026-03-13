'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendBookingConfirmationEmail } from "./email";

export async function resendBookingEmail(bookingId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Não autorizado" };
    }

    try {
        await sendBookingConfirmationEmail(bookingId);
        return { success: true };
    } catch (error: any) {
        console.error("Error resending email:", error);
        return { error: error.message || "Erro ao reenviar e-mail" };
    }
}
