import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocalizedField } from "@/lib/translation-service";
import { requireSession } from "@/lib/authz";
import {
    createMercadoPagoPixPayment,
    getBookingPaymentContext,
    isMercadoPagoConfigured,
} from "@/lib/services/payment.service";
import { asLocalizedText } from "@/lib/types";
import { isDomainError } from "@/lib/errors/domain-error";

async function generatePix(formData: FormData) {
    "use server";

    const bookingId = String(formData.get("bookingId") || "");
    const locale = String(formData.get("locale") || "pt");
    const payerDocument = String(formData.get("payerDocument") || "");
    const session = await requireSession();
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.BETTER_AUTH_URL || "http://localhost:3000";

    try {
        await createMercadoPagoPixPayment({
            userId: session.user.id,
            bookingId,
            origin,
            payerDocument,
        });

        redirect(`/${locale}/payments/mercadopago/${bookingId}`);
    } catch (error) {
        const message = isDomainError(error) ? error.message : "Erro ao gerar o Pix.";
        redirect(`/${locale}/payments/mercadopago/${bookingId}?error=${encodeURIComponent(message)}`);
    }
}

export default async function MercadoPagoPaymentPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string; bookingId: string }>;
    searchParams: Promise<{ error?: string }>;
}) {
    const { locale, bookingId } = await params;
    const { error } = await searchParams;
    const session = await requireSession();
    const booking = await getBookingPaymentContext(session.user.id, bookingId);
    const tripTitle = getLocalizedField<string>(asLocalizedText(booking.trip.title), locale) || "Passeio";
    const latestAttempt = booking.paymentAttempts.find((attempt) => attempt.provider === "MERCADO_PAGO");
    const metadata =
        latestAttempt?.metadata && typeof latestAttempt.metadata === "object"
            ? (latestAttempt.metadata as {
                  qrCode?: string | null;
                  qrCodeBase64?: string | null;
                  ticketUrl?: string | null;
                  payerDocument?: string | null;
              })
            : null;

    const isConfigured = isMercadoPagoConfigured();
    const hasPixReady = Boolean(metadata?.qrCodeBase64 || metadata?.qrCode || metadata?.ticketUrl);

    return (
        <main className="mx-auto max-w-4xl px-6 py-20">
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Mercado Pago Pix</p>
                <h1 className="mt-3 text-3xl font-bold">{tripTitle}</h1>
                <p className="mt-2 text-muted-foreground">
                    Gere o QR Code do Pix para concluir a reserva. A confirmacao final depende do webhook do Mercado Pago.
                </p>

                <div className="mt-8 grid gap-4 rounded-xl border bg-muted/20 p-5 text-sm">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Reserva</span>
                        <span className="font-medium">{booking.id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Status da reserva</span>
                        <span className="font-medium">{booking.status}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Status do pagamento</span>
                        <span className="font-medium">{booking.paymentStatus}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Valor</span>
                        <span className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(booking.totalPriceCents / 100)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-medium">
                            {booking.schedule?.startAt
                                ? new Date(booking.schedule.startAt).toLocaleString("pt-BR")
                                : "A combinar"}
                        </span>
                    </div>
                </div>

                {!isConfigured ? (
                    <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                        Configure `MP_ACCESS_TOKEN` e o webhook do Mercado Pago para ativar este checkout.
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {hasPixReady ? (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
                        <div className="rounded-xl border bg-white p-4">
                            {metadata?.qrCodeBase64 ? (
                                <Image
                                    src={`data:image/png;base64,${metadata.qrCodeBase64}`}
                                    alt="QR Code Pix"
                                    width={180}
                                    height={180}
                                    className="mx-auto h-auto w-full max-w-[180px]"
                                />
                            ) : (
                                <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
                                    QR Code indisponivel
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold">Pague com o app do seu banco</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Escaneie o QR Code ou copie o codigo Pix abaixo. Depois volte para Minhas reservas.
                                </p>
                            </div>

                            {metadata?.qrCode ? (
                                <div className="rounded-xl border bg-muted/20 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Codigo Pix</p>
                                    <pre className="mt-2 whitespace-pre-wrap break-all text-xs">{metadata.qrCode}</pre>
                                </div>
                            ) : null}

                            {metadata?.ticketUrl ? (
                                <a
                                    href={metadata.ticketUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-muted/40"
                                >
                                    Abrir comprovante no Mercado Pago
                                </a>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <form action={generatePix} className="mt-8 space-y-4 rounded-xl border p-5">
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="locale" value={locale} />

                        <div>
                            <label htmlFor="payerDocument" className="block text-sm font-medium text-foreground">
                                CPF do pagador
                            </label>
                            <input
                                id="payerDocument"
                                name="payerDocument"
                                defaultValue={metadata?.payerDocument ?? ""}
                                placeholder="000.000.000-00"
                                required
                                className="mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm"
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                                O Mercado Pago costuma exigir identificacao do pagador para gerar Pix.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={!isConfigured}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Gerar Pix
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
