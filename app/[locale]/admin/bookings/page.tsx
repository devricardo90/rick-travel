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

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-4">Usuário</th>
                            <th className="py-3 px-4">Viagem / Data</th>
                            <th className="py-3 px-4">Status / E-mail</th>
                            <th className="py-3 px-4">Pessoas</th>
                            <th className="py-3 px-4">Reserva em</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-500">
                                    Nenhuma reserva encontrada.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => {
                                const lastEmail = booking.emailLogs[0];
                                return (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-slate-900">{booking.user.name}</div>
                                            <div className="text-xs text-slate-500">{booking.user.email}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-slate-900">
                                                {getLocalizedField<string>(booking.trip.title, 'pt')}
                                            </div>
                                            <div className="text-xs text-slate-600 font-medium">
                                                📅 {booking.schedule 
                                                    ? new Date(booking.schedule.startAt).toLocaleDateString("pt-BR")
                                                    : "A combinar"}
                                            </div>
                                            <div className="text-xs text-slate-400">{booking.trip.city}</div>
                                        </td>
                                        <td className="py-3 px-4 space-y-1">
                                            <div>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === "CONFIRMED"
                                                        ? "bg-green-100 text-green-800"
                                                        : booking.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {booking.status === "CONFIRMED" ? "Confirmada" :
                                                        booking.status === "PENDING" ? "Pendente" : "Cancelada"}
                                                </span>
                                            </div>
                                            {lastEmail && (
                                                <div className="flex items-center gap-1 text-[10px]">
                                                    <span className="font-medium text-slate-500">E-mail:</span>
                                                    <span className={
                                                        lastEmail.status === 'SENT' ? 'text-green-600' :
                                                        lastEmail.status === 'FAILED' ? 'text-red-600' : 'text-amber-600'
                                                    }>
                                                        {lastEmail.status}
                                                    </span>
                                                    {lastEmail.error && (
                                                        <span className="text-slate-400" title={lastEmail.error}>⚠️</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-slate-700 font-medium">{booking.guestCount}</td>
                                        <td className="py-3 px-4 text-slate-500 text-xs">
                                            {new Date(booking.createdAt).toLocaleString("pt-BR", {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-slate-900">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(booking.totalPriceCents / 100)}
                                        </td>
                                        <td className="py-3 px-4 text-right">
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
