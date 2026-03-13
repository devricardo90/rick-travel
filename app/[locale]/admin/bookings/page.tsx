import { prisma } from "@/lib/prisma";
import { BookingActions } from "@/components/admin/booking-actions";
import { getLocalizedField } from "@/lib/translation-service";


export default async function AdminBookingsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams;

    const bookings = await prisma.booking.findMany({
        where: q ? {
            OR: [
                { user: { name: { contains: q, mode: 'insensitive' } } },
                { user: { email: { contains: q, mode: 'insensitive' } } },
                // Temporariamente removido para isolar erro de validação
                // { trip: { title: { path: ['pt'], string_contains: q } } },
            ]
        } : {},
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
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    status: true,
                    sentAt: true,
                    error: true,
                }
            }
        },
    });

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold">Gerenciar Reservas</h1>
                
                <form className="relative w-full md:w-80">
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por cliente ou passeio..."
                        className="w-full h-10 pl-4 pr-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-sm text-center md:text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                        <tr>
                            <th className="py-4 px-4">Usuário</th>
                            <th className="py-4 px-4">Viagem / Data</th>
                            <th className="py-4 px-4">Status / E-mail</th>
                            <th className="py-4 px-4">Pessoas</th>
                            <th className="py-4 px-4">Reserva em</th>
                            <th className="py-4 px-4">Total</th>
                            <th className="py-4 px-4 text-right">Ações</th>
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
                                                {getLocalizedField<string>(booking.trip.title, 'pt')}
                                            </div>
                                            <div className="text-xs text-foreground/80 font-medium">
                                                📅 {booking.schedule 
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
                                            {lastEmail && (
                                                <div className="flex items-center gap-1 text-[10px]">
                                                    <span className="font-medium text-muted-foreground">E-mail:</span>
                                                    <span className={
                                                        lastEmail.status === 'SENT' ? 'text-emerald-600' :
                                                        lastEmail.status === 'FAILED' ? 'text-red-600' : 'text-amber-600'
                                                    }>
                                                        {lastEmail.status}
                                                    </span>
                                                    {lastEmail.error && (
                                                        <span className="text-muted-foreground" title={lastEmail.error}>⚠️</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-foreground/80 font-medium">{booking.guestCount}</td>
                                        <td className="py-4 px-4 text-muted-foreground text-xs">
                                            {new Date(booking.createdAt).toLocaleString("pt-BR", {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
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
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
