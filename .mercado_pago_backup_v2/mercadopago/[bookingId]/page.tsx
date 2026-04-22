import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, QrCode, BadgeCheck, Clock3 } from "lucide-react";
import { getLocalizedField } from "@/lib/localized-field";
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
        <main className="relative min-h-screen overflow-hidden bg-[#071826] text-white">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                    background:
                        "radial-gradient(1200px 560px at 50% -10%, rgba(255,255,255,0.09), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.06) 0%, transparent 18%)",
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-28 lg:px-12 lg:pt-32">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <section className="space-y-8">
                        <div className="surface-dark-solid p-6 md:p-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                                <QrCode className="h-3.5 w-3.5" />
                                Mercado Pago Pix
                            </div>

                            <h1 className="mt-6 max-w-[14ch] text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                                Finalize o pagamento da sua reserva
                            </h1>

                            <p className="mt-5 max-w-3xl text-[15px] leading-8 text-white/68 md:text-lg">
                                Gere o QR Code Pix para concluir a reserva com mais clareza. A confirmação final depende do processamento e do webhook do Mercado Pago.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <span className="chip-dark">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Reserva vinculada à sua conta
                                </span>
                                <span className="chip-dark">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Acompanhamento do status após o pagamento
                                </span>
                                <span className="chip-dark">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    Confirmação sujeita ao retorno do provedor
                                </span>
                            </div>
                        </div>

                        {error ? (
                            <div className="rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-red-100">
                                {error}
                            </div>
                        ) : null}

                        {!isConfigured ? (
                            <div className="rounded-[22px] border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
                                Configure `MP_ACCESS_TOKEN` e o webhook do Mercado Pago para ativar este checkout.
                            </div>
                        ) : null}

                        {hasPixReady ? (
                            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                                <div className="rounded-[28px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                                    <div className="rounded-[22px] border border-white/8 bg-white p-4">
                                        {metadata?.qrCodeBase64 ? (
                                            <Image
                                                src={`data:image/png;base64,${metadata.qrCodeBase64}`}
                                                alt="QR Code Pix"
                                                width={180}
                                                height={180}
                                                className="mx-auto h-auto w-full max-w-[180px]"
                                            />
                                        ) : (
                                            <div className="flex h-[180px] items-center justify-center text-sm text-slate-500">
                                                QR Code indisponivel
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Pague com o app do seu banco</h2>
                                    <p className="mt-3 text-sm leading-7 text-white/62">
                                        Escaneie o QR Code ou copie o código Pix abaixo. Depois acompanhe a atualização do pagamento em suas reservas.
                                    </p>

                                    {metadata?.qrCode ? (
                                        <div className="mt-5 rounded-[22px] border border-white/8 bg-[#091d2c] p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/46">Código Pix</p>
                                            <pre className="mt-3 whitespace-pre-wrap break-all text-xs leading-6 text-white/74">{metadata.qrCode}</pre>
                                        </div>
                                    ) : null}

                                    {metadata?.ticketUrl ? (
                                        <a
                                            href={metadata.ticketUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-5 inline-flex rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07]"
                                        >
                                            Abrir comprovante no Mercado Pago
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            <form action={generatePix} className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                                <input type="hidden" name="bookingId" value={booking.id} />
                                <input type="hidden" name="locale" value={locale} />

                                <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Gerar Pix para esta reserva</h2>
                                <p className="mt-3 text-sm leading-7 text-white/62">
                                    Informe o CPF do pagador para emitir o Pix. Essa identificação costuma ser exigida pelo Mercado Pago.
                                </p>

                                <div className="mt-5">
                                    <label htmlFor="payerDocument" className="block text-sm font-medium text-white/76">
                                        CPF do pagador
                                    </label>
                                    <input
                                        id="payerDocument"
                                        name="payerDocument"
                                        defaultValue={metadata?.payerDocument ?? ""}
                                        placeholder="000.000.000-00"
                                        required
                                        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/36 hover:bg-white/[0.06] focus:border-white/20"
                                    />
                                    <p className="mt-2 text-xs leading-6 text-white/44">
                                        O pagamento só poderá ser confirmado após o retorno do provedor.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isConfigured}
                                    className="mt-5 rounded-2xl bg-[#123a28] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#184731] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Gerar Pix
                                </button>
                            </form>
                        )}
                    </section>

                    <aside className="space-y-6 lg:sticky lg:top-24">
                        <div className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                            <h3 className="text-lg font-semibold tracking-[-0.03em] text-white">{tripTitle}</h3>

                            <div className="mt-5 space-y-3">
                                <div className="flex items-center justify-between gap-4 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm">
                                    <span className="text-white/52">Reserva</span>
                                    <span className="font-medium text-white">{booking.id}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm">
                                    <span className="text-white/52">Status da reserva</span>
                                    <span className="font-medium text-white">{booking.status}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm">
                                    <span className="text-white/52">Status do pagamento</span>
                                    <span className="font-medium text-white">{booking.paymentStatus}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm">
                                    <span className="text-white/52">Valor</span>
                                    <span className="font-medium text-white">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(booking.totalPriceCents / 100)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm">
                                    <span className="text-white/52">Data</span>
                                    <span className="font-medium text-white text-right">
                                        {booking.schedule?.startAt
                                            ? new Date(booking.schedule.startAt).toLocaleString("pt-BR")
                                            : "A combinar"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
