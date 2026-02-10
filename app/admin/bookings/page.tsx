import { prisma } from "@/lib/prisma";

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

            <div className="bg-white rounded-lg shadow overflow-hidden border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                        <tr>
                            <th className="py-3 px-4">Usuário</th>
                            <th className="py-3 px-4">Viagem</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Pessoas</th>
                            <th className="py-3 px-4">Data Reserva</th>
                            <th className="py-3 px-4">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    Nenhuma reserva encontrada.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{booking.user.name}</div>
                                        <div className="text-xs text-gray-500">{booking.user.email}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{booking.trip.title}</div>
                                        <div className="text-xs text-gray-500">{booking.trip.city}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${booking.status === "CONFIRMED"
                                                ? "bg-green-100 text-green-800"
                                                : booking.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{booking.guestCount}</td>
                                    <td className="py-3 px-4">
                                        {new Date(booking.createdAt).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="py-3 px-4 font-medium">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(booking.totalPriceCents / 100)}
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
