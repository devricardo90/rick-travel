import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { PaymentAttemptStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DomainError } from "@/lib/errors/domain-error";
import { sendPaymentConfirmedEmail } from "@/lib/services/email.service";
import { trackAnalyticsEvent } from "@/lib/services/analytics.service";

const MERCADO_PAGO_PROVIDER = "MERCADO_PAGO";

type MercadoPagoPaymentResponse = {
    id: number | string;
    status?: string;
    status_detail?: string;
    external_reference?: string;
    metadata?: {
        booking_id?: string;
    };
    point_of_interaction?: {
        transaction_data?: {
            qr_code?: string;
            qr_code_base64?: string;
            ticket_url?: string;
        };
    };
};

function getMercadoPagoAccessToken() {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
        throw new DomainError("MP_ACCESS_TOKEN nao configurado.", {
            code: "PAYMENT_PROVIDER_NOT_CONFIGURED",
            status: 500,
        });
    }

    return accessToken;
}

export function isMercadoPagoConfigured() {
    return Boolean(process.env.MP_ACCESS_TOKEN);
}

export async function getCheckoutEntryForBooking(userId: string, bookingId: string, origin: string, locale: string) {
    const booking = await assertPayableBooking(userId, bookingId);

    return {
        bookingId: booking.id,
        checkoutUrl: `${origin}/${locale}/payments/mercadopago/${booking.id}`,
    };
}

export async function createMercadoPagoPixPayment(input: {
    userId: string;
    bookingId: string;
    origin: string;
    payerDocument: string;
}) {
    const accessToken = getMercadoPagoAccessToken();
    const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        include: {
            user: true,
            trip: {
                select: { title: true, city: true },
            },
            schedule: {
                select: { startAt: true },
            },
            paymentAttempts: {
                where: {
                    provider: MERCADO_PAGO_PROVIDER,
                    status: { in: ["CREATED", "PENDING", "SUCCEEDED"] },
                },
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });

    if (!booking) {
        throw new DomainError("Reserva nao encontrada.", {
            code: "BOOKING_NOT_FOUND",
            status: 404,
        });
    }

    if (booking.userId !== input.userId) {
        throw new DomainError("Sem permissao para pagar esta reserva.", {
            code: "PAYMENT_FORBIDDEN",
            status: 403,
        });
    }

    if (booking.status === "CANCELED") {
        throw new DomainError("Nao e possivel pagar uma reserva cancelada.", {
            code: "BOOKING_CANCELED",
            status: 400,
        });
    }

    if (booking.paymentStatus === "PAID") {
        throw new DomainError("Esta reserva ja esta paga.", {
            code: "BOOKING_ALREADY_PAID",
            status: 409,
        });
    }

    const normalizedDocument = input.payerDocument.replace(/\D/g, "");
    if (normalizedDocument.length !== 11) {
        throw new DomainError("Informe um CPF valido com 11 digitos.", {
            code: "INVALID_PAYER_DOCUMENT",
            status: 400,
        });
    }

    const existingAttempt = booking.paymentAttempts[0];
    if (
        existingAttempt &&
        existingAttempt.status === "PENDING" &&
        existingAttempt.providerPaymentId &&
        existingAttempt.metadata &&
        typeof existingAttempt.metadata === "object"
    ) {
        return existingAttempt;
    }

    const [firstName, ...rest] = booking.user.name.trim().split(/\s+/);
    const lastName = rest.join(" ") || firstName;

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": randomUUID(),
        },
        body: JSON.stringify({
            transaction_amount: booking.totalPriceCents / 100,
            description: `Rick Travel - Reserva ${booking.id}`,
            payment_method_id: "pix",
            notification_url: `${input.origin}/api/payments/webhook`,
            external_reference: booking.id,
            payer: {
                email: booking.user.email,
                first_name: firstName,
                last_name: lastName,
                identification: {
                    type: "CPF",
                    number: normalizedDocument,
                },
            },
            metadata: {
                booking_id: booking.id,
                user_id: booking.userId,
            },
        }),
        cache: "no-store",
    });

    const payload = (await response.json()) as MercadoPagoPaymentResponse & {
        message?: string;
        cause?: Array<{ description?: string }>;
    };

    if (!response.ok) {
        const providerMessage = payload.message || payload.cause?.[0]?.description || "Falha ao criar pagamento Pix.";
        throw new DomainError(providerMessage, {
            code: "MERCADO_PAGO_CREATE_PAYMENT_FAILED",
            status: 502,
        });
    }

    const transactionData = payload.point_of_interaction?.transaction_data;
    const mappedStatus = mapMercadoPagoPaymentStatus(payload.status);

    const attempt = await prisma.paymentAttempt.create({
        data: {
            bookingId: booking.id,
            provider: MERCADO_PAGO_PROVIDER,
            providerPaymentId: String(payload.id),
            amountCents: booking.totalPriceCents,
            status: mappedStatus,
            metadata: {
                payerDocument: normalizedDocument,
                ticketUrl: transactionData?.ticket_url ?? null,
                qrCode: transactionData?.qr_code ?? null,
                qrCodeBase64: transactionData?.qr_code_base64 ?? null,
                mercadoPagoStatus: payload.status ?? null,
                mercadoPagoStatusDetail: payload.status_detail ?? null,
            },
        },
    });

    await trackAnalyticsEvent({
        type: "PIX_GENERATED",
        userId: booking.userId,
        tripId: booking.tripId,
        bookingId: booking.id,
        paymentAttemptId: attempt.id,
        path: `/payments/mercadopago/${booking.id}`,
        metadata: {
            provider: MERCADO_PAGO_PROVIDER,
            providerPaymentId: attempt.providerPaymentId,
            amountCents: booking.totalPriceCents,
            mercadoPagoStatus: payload.status ?? null,
        },
    });

    return attempt;
}

export async function getBookingPaymentContext(userId: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            trip: {
                select: { title: true, city: true },
            },
            schedule: {
                select: { startAt: true },
            },
            paymentAttempts: {
                orderBy: { createdAt: "desc" },
                take: 5,
            },
        },
    });

    if (!booking) {
        throw new DomainError("Reserva nao encontrada.", {
            code: "BOOKING_NOT_FOUND",
            status: 404,
        });
    }

    if (booking.userId !== userId) {
        throw new DomainError("Sem permissao para acessar esta reserva.", {
            code: "PAYMENT_FORBIDDEN",
            status: 403,
        });
    }

    return booking;
}

export async function processMercadoPagoWebhookNotification(input: {
    resourceId: string;
    providerEventId?: string;
}) {
    const accessToken = getMercadoPagoAccessToken();

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${input.resourceId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    const payload = (await response.json()) as MercadoPagoPaymentResponse;

    if (!response.ok) {
        throw new DomainError("Nao foi possivel consultar o pagamento no Mercado Pago.", {
            code: "MERCADO_PAGO_FETCH_PAYMENT_FAILED",
            status: 502,
        });
    }

    const bookingId = payload.external_reference || payload.metadata?.booking_id;

    if (!bookingId) {
        throw new DomainError("O pagamento recebido nao possui referencia de reserva.", {
            code: "PAYMENT_BOOKING_REFERENCE_MISSING",
            status: 400,
        });
    }

    return processPaymentWebhook({
        bookingId,
        status: mapMercadoPagoPaymentStatus(payload.status),
        provider: MERCADO_PAGO_PROVIDER,
        providerEventId: input.providerEventId,
        providerPaymentId: String(payload.id),
    });
}

export async function processPaymentWebhook(input: {
    bookingId: string;
    status: PaymentAttemptStatus;
    provider?: string;
    providerEventId?: string;
    providerPaymentId?: string;
}) {
    const provider = input.provider ?? MERCADO_PAGO_PROVIDER;

    const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        include: {
            paymentAttempts: {
                where: input.providerPaymentId
                    ? {
                          provider,
                          providerPaymentId: input.providerPaymentId,
                      }
                    : undefined,
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });

    if (!booking) {
        throw new DomainError("Reserva nao encontrada para webhook.", {
            code: "BOOKING_NOT_FOUND",
            status: 404,
        });
    }

    let activeAttempt = booking.paymentAttempts[0];

    if (!activeAttempt) {
        activeAttempt = await prisma.paymentAttempt.create({
            data: {
                bookingId: booking.id,
                provider,
                providerPaymentId: input.providerPaymentId,
                amountCents: booking.totalPriceCents,
                status: input.status,
            },
        });
    }

    const nextPaymentStatus = mapAttemptToPaymentStatus(input.status);
    const nextBookingStatus =
        input.status === "SUCCEEDED"
            ? "CONFIRMED"
            : booking.status === "CONFIRMED"
                ? "CONFIRMED"
                : booking.status;

    const updated = await prisma.$transaction(async (tx) => {
        const updatedAttempt = await tx.paymentAttempt.update({
            where: { id: activeAttempt.id },
            data: {
                provider,
                providerEventId: input.providerEventId,
                providerPaymentId: input.providerPaymentId ?? activeAttempt.providerPaymentId,
                status: input.status,
                paidAt: input.status === "SUCCEEDED" ? new Date() : null,
            },
        });

        const updatedBooking = await tx.booking.update({
            where: { id: booking.id },
            data: {
                paymentStatus: nextPaymentStatus,
                status: nextBookingStatus,
            },
        });

        return { updatedAttempt, updatedBooking };
    });

    if (input.status === "SUCCEEDED" && booking.status !== "CONFIRMED") {
        await sendPaymentConfirmedEmail(booking.id);
        await trackAnalyticsEvent({
            type: "PAYMENT_CONFIRMED",
            userId: booking.userId,
            tripId: booking.tripId,
            bookingId: booking.id,
            paymentAttemptId: updated.updatedAttempt.id,
            path: "/api/payments/webhook",
            metadata: {
                provider,
                providerEventId: input.providerEventId ?? null,
                providerPaymentId: input.providerPaymentId ?? null,
            },
        });
    }

    return updated;
}

export function validateMercadoPagoWebhookSignature({
    body,
    signatureHeader,
    requestId,
}: {
    body: unknown;
    signatureHeader: string | null;
    requestId: string | null;
}) {
    const secret = process.env.MP_WEBHOOK_SECRET;

    if (!secret || !signatureHeader || !requestId) {
        return true;
    }

    const parts = Object.fromEntries(
        signatureHeader.split(",").map((part) => {
            const [key, value] = part.split("=");
            return [key?.trim(), value?.trim()];
        })
    );

    const ts = parts.ts;
    const v1 = parts.v1;
    const resourceId =
        typeof body === "object" && body !== null && "data" in body
            ? String((body as { data?: { id?: string | number } }).data?.id ?? "")
            : "";

    if (!ts || !v1 || !resourceId) {
        return false;
    }

    const manifest = `id:${resourceId};request-id:${requestId};ts:${ts};`;
    const expected = createHmac("sha256", secret).update(manifest).digest("hex");

    return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

function mapMercadoPagoPaymentStatus(status?: string): PaymentAttemptStatus {
    switch (status) {
        case "approved":
        case "authorized":
            return "SUCCEEDED";
        case "refunded":
        case "charged_back":
            return "REFUNDED";
        case "cancelled":
            return "CANCELED";
        case "rejected":
            return "FAILED";
        case "in_process":
        case "pending":
        default:
            return "PENDING";
    }
}

function mapAttemptToPaymentStatus(status: PaymentAttemptStatus): PaymentStatus {
    switch (status) {
        case "SUCCEEDED":
            return "PAID";
        case "REFUNDED":
            return "REFUNDED";
        case "FAILED":
        case "CANCELED":
        case "CREATED":
        case "PENDING":
        default:
            return "UNPAID";
    }
}

async function assertPayableBooking(userId: string, bookingId: string) {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new DomainError("Reserva nao encontrada.", {
            code: "BOOKING_NOT_FOUND",
            status: 404,
        });
    }

    if (booking.userId !== userId) {
        throw new DomainError("Sem permissao para pagar esta reserva.", {
            code: "PAYMENT_FORBIDDEN",
            status: 403,
        });
    }

    if (booking.status === "CANCELED") {
        throw new DomainError("Nao e possivel pagar uma reserva cancelada.", {
            code: "BOOKING_CANCELED",
            status: 400,
        });
    }

    if (booking.paymentStatus === "PAID") {
        throw new DomainError("Esta reserva ja esta paga.", {
            code: "BOOKING_ALREADY_PAID",
            status: 409,
        });
    }

    return booking;
}
