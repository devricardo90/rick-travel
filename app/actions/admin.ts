'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
    getRecommendedBookingEmailTemplate,
    sendBookingEmail,
} from "@/lib/services/email.service";

export async function resendBookingEmail(bookingId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Não autorizado" };
    }

    try {
        const template = await getRecommendedBookingEmailTemplate(bookingId);

        if (!template) {
            return { error: "Reserva ainda nao possui e-mail aplicavel para reenvio" };
        }

        const result = await sendBookingEmail(bookingId, template);

        if (!result.delivered) {
            return { error: "Falha ao reenviar e-mail" };
        }

        return { success: true, template };
    } catch (error: unknown) {
        console.error("Error resending email:", error);
        return { error: error instanceof Error ? error.message : "Erro ao reenviar e-mail" };
    }
}
