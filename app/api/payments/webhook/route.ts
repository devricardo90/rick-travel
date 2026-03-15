import { NextResponse } from "next/server";
import { isDomainError } from "@/lib/errors/domain-error";
import {
    processMercadoPagoWebhookNotification,
    validateMercadoPagoWebhookSignature,
} from "@/lib/services/payment.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const type = typeof body?.type === "string" ? body.type : "";
        const action = typeof body?.action === "string" ? body.action : "";

        if (!validateMercadoPagoWebhookSignature({
            body,
            signatureHeader: req.headers.get("x-signature"),
            requestId: req.headers.get("x-request-id"),
        })) {
            return NextResponse.json({ error: "Webhook Mercado Pago invalido" }, { status: 401 });
        }

        if (type !== "payment" && action !== "payment.created" && action !== "payment.updated") {
            return NextResponse.json({ ok: true, ignored: true });
        }

        const resourceId =
            typeof body?.data?.id === "string" || typeof body?.data?.id === "number"
                ? String(body.data.id)
                : "";

        if (!resourceId) {
            return NextResponse.json({ error: "Payload de webhook invalido" }, { status: 400 });
        }

        const result = await processMercadoPagoWebhookNotification({
            resourceId,
            providerEventId: typeof body?.id === "number" || typeof body?.id === "string" ? String(body.id) : undefined,
        });

        return NextResponse.json({ ok: true, booking: result.updatedBooking, attempt: result.updatedAttempt });
    } catch (error) {
        if (isDomainError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error(error);
        return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 });
    }
}
