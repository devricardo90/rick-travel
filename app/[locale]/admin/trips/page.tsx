import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteTripButton } from "@/components/admin/delete-trip-button";
import { getLocalizedField } from "@/lib/translation-service";

export default async function AdminTripsPage() {
    const trips = await prisma.trip.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Gerenciar Viagens</h1>
                <Link href="/admin/trips/new">
                    <Button>+ Nova Viagem</Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-4">Título</th>
                            <th className="py-3 px-4">Descrição</th>
                            <th className="py-3 px-4">Cidade</th>
                            <th className="py-3 px-4">Preço</th>
                            <th className="py-3 px-4">Data</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {trips.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-500">
                                    Nenhuma viagem cadastrada.
                                </td>
                            </tr>
                        ) : (
                            trips.map((trip) => (
                                <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 font-semibold text-slate-900">
                                        {getLocalizedField<string>(trip.title, 'pt')}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={getLocalizedField<string>(trip.description, 'pt') || ""}>
                                        {getLocalizedField<string>(trip.description, 'pt') || "-"}
                                    </td>
                                    <td className="py-3 px-4 text-slate-700">{trip.city}</td>
                                    <td className="py-3 px-4 text-slate-700">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(trip.priceCents / 100)}
                                    </td>
                                    <td className="py-3 px-4 text-slate-700">
                                        {trip.startDate
                                            ? new Date(trip.startDate).toLocaleDateString("pt-BR")
                                            : "-"}
                                    </td>
                                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/admin/trips/${trip.id}/schedules`}>Agenda</Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/trips/${trip.id}`}>Editar</Link>
                                        </Button>
                                        <DeleteTripButton tripId={trip.id} />
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
