import { NextResponse } from "next/server";
import { requireSession } from "@/lib/authz";
import { isDomainError } from "@/lib/errors/domain-error";
import { getCheckoutEntryForBooking } from "@/lib/services/payment.service";

export async function POST(req: Request) {
    try {
        const session = await requireSession();
        const body = await req.json();
        const bookingId = typeof body?.bookingId === "string" ? body.bookingId.trim() : "";
        const locale = typeof body?.locale === "string" ? body.locale.trim() : "pt";
        const origin = new URL(req.url).origin;

        const entry = await getCheckoutEntryForBooking(session.user.id, bookingId, origin, locale);

        return NextResponse.json({
            bookingId: entry.bookingId,
            checkoutUrl: entry.checkoutUrl,
        });
    } catch (error) {
        if (isDomainError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error(error);
        return NextResponse.json({ error: "Erro ao iniciar checkout" }, { status: 500 });
    }
}
