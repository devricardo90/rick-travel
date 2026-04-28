'use server'

import { requireAdminSession } from "@/lib/authz";
import {
    getRecommendedBookingEmailTemplate,
    sendBookingEmail,
} from "@/lib/services/email.service";
import { listAllBookings } from "@/lib/services/booking.service";

/**
 * Busca todas as reservas para o painel administrativo.
 * Apenas leitura (RT-013C).
 */
export async function getBookingsAction() {
    await requireAdminSession();
    try {
        return await listAllBookings();
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Falha ao carregar reservas.");
    }
}

/**
 * Reenvia e-mail de reserva.
 * Mantido para compatibilidade, agora usando requireAdminSession para consistência.
 */
export async function resendBookingEmail(bookingId: string) {
    try {
        await requireAdminSession();

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
