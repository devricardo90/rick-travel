import { prisma } from "@/lib/prisma";
import { BookingActions } from "@/components/admin/booking-actions";
import { getLocalizedField } from "@/lib/translation-service";

export default async function AdminBookingsPage() {
    const bookings = await prisma.booking.findMany({
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
        },
    });

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Gerenciar Reservas</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-4">Usuário</th>
                            <th className="py-3 px-4">Viagem</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Pessoas</th>
                            <th className="py-3 px-4">Data Reserva</th>
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
                            bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="font-semibold text-slate-900">{booking.user.name}</div>
                                        <div className="text-xs text-slate-500">{booking.user.email}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-slate-900">
                                            {getLocalizedField<string>(booking.trip.title, 'pt')}
                                        </div>
                                        <div className="text-xs text-slate-500">{booking.trip.city}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === "CONFIRMED"
                                                ? "bg-green-100 text-green-800"
                                                : booking.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {booking.status === "CONFIRMED" ? "Confirmada" :
                                                booking.status === "PENDING" ? "Pendente" : "Cancelada"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-700">{booking.guestCount}</td>
                                    <td className="py-3 px-4 text-slate-700">
                                        {new Date(booking.createdAt).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-slate-900">
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
