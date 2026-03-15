import { BookingStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BookingActions } from "@/components/admin/booking-actions";
import { getLocalizedField } from "@/lib/translation-service";
import { asLocalizedText } from "@/lib/types";

function parseDateBoundary(value: string | undefined, boundary: "start" | "end") {
    if (!value) return undefined;

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return undefined;

    if (boundary === "end") {
        date.setHours(23, 59, 59, 999);
    }

    return date;
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
    }>;
}) {
    const { q, status, paymentStatus, dateFrom, dateTo } = await searchParams;

    const normalizedStatus =
        status && ["PENDING", "CONFIRMED", "CANCELED"].includes(status) ? (status as BookingStatus) : undefined;
    const normalizedPaymentStatus =
        paymentStatus && ["UNPAID", "PAID", "REFUNDED", "PARTIAL"].includes(paymentStatus)
            ? (paymentStatus as PaymentStatus)
            : undefined;
    const startDate = parseDateBoundary(dateFrom, "start");
    const endDate = parseDateBoundary(dateTo, "end");

    const andFilters: Prisma.BookingWhereInput[] = [];

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
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold">Gerenciar Reservas</h1>

                <form className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-5">
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por cliente..."
                        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                    />

                    <select
                        name="status"
                        defaultValue={normalizedStatus ?? ""}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos status</option>
                        <option value="PENDING">Pendente</option>
                        <option value="CONFIRMED">Confirmada</option>
                        <option value="CANCELED">Cancelada</option>
                    </select>

                    <select
                        name="paymentStatus"
                        defaultValue={normalizedPaymentStatus ?? ""}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos pagamentos</option>
                        <option value="UNPAID">Nao pago</option>
                        <option value="PAID">Pago</option>
                        <option value="REFUNDED">Reembolsado</option>
                        <option value="PARTIAL">Parcial</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="h-10 flex-1 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Filtrar
                        </button>
                        <a
                            href="?"
                            className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted/40"
                        >
                            Limpar
                        </a>
                    </div>

                    <input
                        type="date"
                        name="dateFrom"
                        defaultValue={dateFrom}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                        type="date"
                        name="dateTo"
                        defaultValue={dateTo}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </form>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-sm text-center md:text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                        <tr>
                            <th className="py-4 px-4">Usuario</th>
                            <th className="py-4 px-4">Viagem / Data</th>
                            <th className="py-4 px-4">Status / Pagamento / E-mail</th>
                            <th className="py-4 px-4">Pessoas</th>
                            <th className="py-4 px-4">Reserva em</th>
                            <th className="py-4 px-4">Total</th>
                            <th className="py-4 px-4 text-right">Acoes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                    Nenhuma reserva encontrada.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => {
                                const lastEmail = booking.emailLogs[0];
                                return (
                                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-foreground">{booking.user.name}</div>
                                            <div className="text-xs text-muted-foreground">{booking.user.email}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-foreground">
                                                {getLocalizedField<string>(asLocalizedText(booking.trip.title), "pt")}
                                            </div>
                                            <div className="text-xs text-foreground/80 font-medium">
                                                Data: {booking.schedule
                                                    ? new Date(booking.schedule.startAt).toLocaleDateString("pt-BR")
                                                    : "A combinar"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{booking.trip.city}</div>
                                        </td>
                                        <td className="py-4 px-4 space-y-1">
                                            <div>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === "CONFIRMED"
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                        : booking.status === "PENDING"
                                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                                        }`}
                                                >
                                                    {booking.status === "CONFIRMED" ? "Confirmada" :
                                                        booking.status === "PENDING" ? "Pendente" : "Cancelada"}
                                                </span>
                                            </div>
                                            <div>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.paymentStatus === "PAID"
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                        : booking.paymentStatus === "REFUNDED"
                                                            ? "bg-slate-200 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                                                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                                        }`}
                                                >
                                                    {booking.paymentStatus}
                                                </span>
                                            </div>
                                            {lastEmail ? (
                                                <div className="flex items-center gap-1 text-[10px]">
                                                    <span className="font-medium text-muted-foreground">E-mail:</span>
                                                    <span className="text-muted-foreground">
                                                        {lastEmail.template === "PAYMENT_CONFIRMED" ? "pagamento" : "reserva"}
                                                    </span>
                                                    <span className="text-muted-foreground">{lastEmail.status === "SENT" ? "ultimo envio" : "ultima tentativa"}</span>
                                                    <span className="text-muted-foreground">/</span>
                                                    <span className="text-muted-foreground">
                                                        {lastEmail.sentAt ? new Date(lastEmail.sentAt).toLocaleDateString("pt-BR") : "sem data"}
                                                    </span>
                                                    <span className={
                                                        lastEmail.status === "SENT" ? "text-emerald-600" :
                                                            lastEmail.status === "FAILED" ? "text-red-600" : "text-amber-600"
                                                    }>
                                                        {lastEmail.status}
                                                    </span>
                                                    {lastEmail.error ? (
                                                        <span className="text-muted-foreground" title={lastEmail.error}>!</span>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="py-4 px-4 text-foreground/80 font-medium">{booking.guestCount}</td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs">
                                            {new Date(booking.createdAt).toLocaleString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-foreground">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(booking.totalPriceCents / 100)}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <BookingActions
                                                bookingId={booking.id}
                                                currentStatus={booking.status}
                                                currentPaymentStatus={booking.paymentStatus}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
