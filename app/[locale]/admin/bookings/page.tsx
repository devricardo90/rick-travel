import { prisma } from "@/lib/prisma";
import { BookingActions } from "@/components/admin/booking-actions";
import { getLocalizedField } from "@/lib/localized-field";
import { asLocalizedText } from "@/lib/types";

type BookingStatus = NonNullable<Awaited<ReturnType<typeof prisma.booking.findUnique>>>["status"];
type PaymentStatus = NonNullable<Awaited<ReturnType<typeof prisma.booking.findUnique>>>["paymentStatus"];

function isBookingStatus(value: string | undefined): value is BookingStatus {
    return value === "PENDING" || value === "CONFIRMED" || value === "CANCELED";
}

function isPaymentStatus(value: string | undefined): value is PaymentStatus {
    return value === "UNPAID" || value === "PAID" || value === "REFUNDED" || value === "PARTIAL";
}

type BookingWhereInput = NonNullable<Parameters<typeof prisma.booking.findMany>[0]>["where"];

function parseDateBoundary(value: string | undefined, boundary: "start" | "end") {
    if (!value) return undefined;

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return undefined;

    if (boundary === "end") {
        date.setHours(23, 59, 59, 999);
    }

    return date;
}

function bookingStatusLabel(status: BookingStatus) {
    if (status === "CONFIRMED") return "Confirmada";
    if (status === "PENDING") return "Pendente";
    return "Cancelada";
}

function bookingStatusClass(status: BookingStatus) {
    if (status === "CONFIRMED") return "border-emerald-400/18 bg-emerald-500/10 text-emerald-200";
    if (status === "PENDING") return "border-amber-400/18 bg-amber-500/10 text-amber-200";
    return "border-red-400/18 bg-red-500/10 text-red-200";
}

function paymentStatusClass(status: PaymentStatus) {
    if (status === "PAID") return "border-emerald-400/18 bg-emerald-500/10 text-emerald-200";
    if (status === "REFUNDED") return "border-slate-300/14 bg-slate-400/10 text-slate-200";
    return "border-amber-400/18 bg-amber-500/10 text-amber-200";
}

export default async function AdminBookingsPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        status?: string;
        paymentStatus?: string;
        dateFrom?: string;
        dateTo?: string;
        recovery?: string;
    }>;
}) {
    const { q, status, paymentStatus, dateFrom, dateTo, recovery } = await searchParams;

    const normalizedStatus = isBookingStatus(status) ? status : undefined;
    const normalizedPaymentStatus = isPaymentStatus(paymentStatus) ? paymentStatus : undefined;
    const startDate = parseDateBoundary(dateFrom, "start");
    const endDate = parseDateBoundary(dateTo, "end");

    const andFilters: NonNullable<BookingWhereInput>[] = [];

    if (q) {
        andFilters.push({
            OR: [
                { user: { name: { contains: q, mode: "insensitive" } } },
                { user: { email: { contains: q, mode: "insensitive" } } },
            ],
        });
    }

    if (normalizedStatus) {
        andFilters.push({ status: normalizedStatus });
    }

    if (normalizedPaymentStatus) {
        andFilters.push({ paymentStatus: normalizedPaymentStatus });
    }

    if (startDate || endDate) {
        andFilters.push({
            createdAt: {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
            },
        });
    }

    if (recovery === "abandoned") {
        andFilters.push(
            { status: "PENDING" },
            { paymentStatus: "UNPAID" },
            {
                analyticsEvents: {
                    some: { type: { in: ["CHECKOUT_STARTED", "PIX_GENERATED"] } },
                    none: { type: "PAYMENT_CONFIRMED" },
                },
            }
        );
    }

    const bookings = await prisma.booking.findMany({
        where: andFilters.length > 0 ? { AND: andFilters } : {},
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            trip: {
                select: {
                    title: true,
                    city: true,
                },
            },
            schedule: {
                select: {
                    startAt: true,
                },
            },
            emailLogs: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: {
                    template: true,
                    status: true,
                    sentAt: true,
                    error: true,
                },
            },
        },
    });

    return (
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
            <div className="mb-8 rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                    Operacao de reservas
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                    Gerenciar Reservas
                </h1>
                <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
                    Visualize reservas, acompanhe status, confira sinais de pagamento e acione o fluxo operacional sem alterar a logica existente.
                </p>
            </div>

            {recovery === "abandoned" ? (
                <div className="mb-6 rounded-[24px] border border-[#b99657]/20 bg-[#15140f] px-5 py-4 text-sm leading-7 text-[#f3e4be] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                    Exibindo fila de recuperacao: reservas com checkout iniciado ou Pix gerado sem pagamento confirmado.
                </div>
            ) : null}

            <form className="mb-6 grid gap-3 rounded-[28px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:grid-cols-5">
                {recovery === "abandoned" ? <input type="hidden" name="recovery" value="abandoned" /> : null}
                <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar por cliente..."
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/34 hover:bg-white/[0.06] focus:border-white/18 md:col-span-2"
                />

                <select
                    name="status"
                    defaultValue={normalizedStatus ?? ""}
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                >
                    <option value="" className="text-slate-900">Todos status</option>
                    <option value="PENDING" className="text-slate-900">Pendente</option>
                    <option value="CONFIRMED" className="text-slate-900">Confirmada</option>
                    <option value="CANCELED" className="text-slate-900">Cancelada</option>
                </select>

                <select
                    name="paymentStatus"
                    defaultValue={normalizedPaymentStatus ?? ""}
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                >
                    <option value="" className="text-slate-900">Todos pagamentos</option>
                    <option value="UNPAID" className="text-slate-900">Nao pago</option>
                    <option value="PAID" className="text-slate-900">Pago</option>
                    <option value="REFUNDED" className="text-slate-900">Reembolsado</option>
                    <option value="PARTIAL" className="text-slate-900">Parcial</option>
                </select>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="h-12 flex-1 rounded-2xl bg-[#123a28] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#184731]"
                    >
                        Filtrar
                    </button>
                    <a
                        href={recovery === "abandoned" ? "?recovery=abandoned" : "?"}
                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                        Limpar
                    </a>
                </div>

                <input
                    type="date"
                    name="dateFrom"
                    defaultValue={dateFrom}
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                />

                <input
                    type="date"
                    name="dateTo"
                    defaultValue={dateTo}
                    className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/18"
                />
            </form>

            <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <div className="hidden grid-cols-[1.1fr_1.25fr_1.35fr_0.5fr_0.85fr_0.75fr_0.8fr] gap-4 border-b border-white/8 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 lg:grid">
                    <div>Usuario</div>
                    <div>Viagem / Data</div>
                    <div>Status / Pagamento / E-mail</div>
                    <div>Pessoas</div>
                    <div>Reserva em</div>
                    <div>Total</div>
                    <div className="text-right">Acoes</div>
                </div>

                {bookings.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-white/56">
                        Nenhuma reserva encontrada.
                    </div>
                ) : (
                    <div className="divide-y divide-white/8">
                        {bookings.map((booking) => {
                            const lastEmail = booking.emailLogs[0];
                            const tripTitle = getLocalizedField<string>(asLocalizedText(booking.trip.title), "pt");

                            return (
                                <div
                                    key={booking.id}
                                    className="grid gap-5 px-5 py-5 transition-colors hover:bg-white/[0.02] lg:grid-cols-[1.1fr_1.25fr_1.35fr_0.5fr_0.85fr_0.75fr_0.8fr] lg:items-start"
                                >
                                    <div>
                                        <div className="font-semibold text-white">{booking.user.name}</div>
                                        <div className="mt-1 text-xs text-white/50">{booking.user.email}</div>
                                    </div>

                                    <div>
                                        <div className="font-medium text-white">{tripTitle}</div>
                                        <div className="mt-1 text-xs font-medium text-white/66">
                                            Data:{" "}
                                            {booking.schedule
                                                ? new Date(booking.schedule.startAt).toLocaleDateString("pt-BR")
                                                : "A combinar"}
                                        </div>
                                        <div className="mt-1 text-xs text-white/46">{booking.trip.city}</div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${bookingStatusClass(booking.status)}`}
                                            >
                                                {bookingStatusLabel(booking.status)}
                                            </span>
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${paymentStatusClass(booking.paymentStatus)}`}
                                            >
                                                {booking.paymentStatus}
                                            </span>
                                        </div>
                                        {lastEmail ? (
                                            <div className="text-[11px] leading-6 text-white/52">
                                                <span className="font-medium text-white/62">E-mail:</span>{" "}
                                                {lastEmail.template === "PAYMENT_CONFIRMED" ? "pagamento" : "reserva"}{" "}
                                                {lastEmail.status === "SENT" ? "ultimo envio" : "ultima tentativa"} /{" "}
                                                {lastEmail.sentAt
                                                    ? new Date(lastEmail.sentAt).toLocaleDateString("pt-BR")
                                                    : "sem data"}{" "}
                                                <span
                                                    className={
                                                        lastEmail.status === "SENT"
                                                            ? "text-emerald-300"
                                                            : lastEmail.status === "FAILED"
                                                              ? "text-red-300"
                                                              : "text-amber-300"
                                                    }
                                                >
                                                    {lastEmail.status}
                                                </span>
                                                {lastEmail.error ? (
                                                    <span className="ml-1 text-white/36" title={lastEmail.error}>
                                                        !
                                                    </span>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="text-sm font-medium text-white/72">{booking.guestCount}</div>

                                    <div className="text-xs leading-6 text-white/46">
                                        {new Date(booking.createdAt).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>

                                    <div className="text-sm font-semibold text-white">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(booking.totalPriceCents / 100)}
                                    </div>

                                    <div className="lg:justify-self-end">
                                        <BookingActions
                                            bookingId={booking.id}
                                            currentStatus={booking.status}
                                            currentPaymentStatus={booking.paymentStatus}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
