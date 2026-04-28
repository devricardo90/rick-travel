'use server'

import { requireAdminSession } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import {
    getRecommendedBookingEmailTemplate,
    sendBookingEmail,
} from "@/lib/services/email.service";
import { listAllBookings } from "@/lib/services/booking.service";
import { listAllContacts, markContactAsRead } from "@/lib/services/contact.service";

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
 * Busca todas as mensagens de contato para o painel administrativo.
 * Apenas leitura (RT-013D).
 */
export async function getContactsAction() {
    await requireAdminSession();
    try {
        return await listAllContacts();
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw new Error("Falha ao carregar contatos.");
    }
}

/**
 * Marca uma mensagem de contato como lida.
 * (RT-013E).
 */
export async function markContactAsReadAction(id: string) {
    await requireAdminSession();
    try {
        await markContactAsRead(id);
        revalidatePath("/admin/contacts");
        return { success: true };
    } catch (error) {
        console.error("Error marking contact as read:", error);
        return { error: "Falha ao marcar como lido." };
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
