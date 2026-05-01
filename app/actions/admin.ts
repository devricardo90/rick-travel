'use server'

import { requireAdminSession } from "@/lib/authz";
import { isDomainError } from "@/lib/errors/domain-error";
import { revalidatePath } from "next/cache";
import {
    getRecommendedBookingEmailTemplate,
    sendBookingEmail,
} from "@/lib/services/email.service";
import {
    listAllBookings,
    getBookingById,
    cancelBookingByAdmin,
    confirmBookingByAdmin,
} from "@/lib/services/booking.service";
import { listAllContacts, markContactAsRead } from "@/lib/services/contact.service";
import { createTripRecord } from "@/lib/services/trip.service";
import { TripInput } from "@/lib/schemas";

/**
 * Cria um novo tour pelo admin.
 * Todo novo tour nasce com isPublished: false (RT-017C).
 */
export async function createTripAction(data: TripInput, locale: string) {
    await requireAdminSession();
    try {
        // Forçar isPublished como false independentemente do input (regra RT-017C)
        const tourData = { ...data, isPublished: false };
        const trip = await createTripRecord(tourData);
        revalidatePath(`/${locale}/admin/tours`);
        revalidatePath(`/${locale}/tours`);
        revalidatePath("/api/trips");
        return { success: true, id: trip.id };
    } catch (error: unknown) {
        console.error("Error creating trip:", error);
        return {
            error: error instanceof Error ? error.message : "Falha ao criar tour."
        };
    }
}

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
 * Busca uma reserva pelo ID para o painel administrativo.
 * Apenas leitura (RT-013G).
 */
export async function getBookingByIdAction(id: string) {
    await requireAdminSession();
    try {
        return await getBookingById(id);
    } catch (error) {
        console.error("Error fetching booking by id:", error);
        throw new Error("Falha ao carregar reserva.");
    }
}

/**
 * Cancela uma reserva pelo admin.
 * Somente PENDING e CONFIRMED. Nao altera paymentStatus. (RT-014B).
 */
export async function cancelBookingByAdminAction(id: string, locale?: string) {
    await requireAdminSession();
    try {
        await cancelBookingByAdmin(id);
        revalidatePath(`/admin/bookings/${id}`);
        revalidatePath("/admin/bookings");
        if (locale) {
            revalidatePath(`/${locale}/admin/bookings/${id}`);
            revalidatePath(`/${locale}/admin/bookings`);
        }
        return { success: true };
    } catch (error) {
        console.error("Error canceling booking:", error);
        return { error: isDomainError(error) ? error.message : "Falha ao cancelar reserva." };
    }
}

/**
 * Confirma uma reserva pelo admin.
 * Somente PENDING. Nao altera paymentStatus. (RT-022A).
 */
export async function confirmBookingByAdminAction(id: string, locale?: string) {
    await requireAdminSession();
    try {
        await confirmBookingByAdmin(id);
        revalidatePath(`/admin/bookings/${id}`);
        revalidatePath("/admin/bookings");
        if (locale) {
            revalidatePath(`/${locale}/admin/bookings/${id}`);
            revalidatePath(`/${locale}/admin/bookings`);
        }
        return { success: true };
    } catch (error) {
        console.error("Error confirming booking:", error);
        return { error: isDomainError(error) ? error.message : "Falha ao confirmar reserva." };
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
