import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

            <div className="bg-white rounded-lg shadow overflow-hidden border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                        <tr>
                            <th className="py-3 px-4">Título</th>
                            <th className="py-3 px-4">Cidade</th>
                            <th className="py-3 px-4">Preço</th>
                            <th className="py-3 px-4">Data</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {trips.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    Nenhuma viagem cadastrada.
                                </td>
                            </tr>
                        ) : (
                            trips.map((trip) => (
                                <tr key={trip.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{trip.title}</td>
                                    <td className="py-3 px-4">{trip.city}</td>
                                    <td className="py-3 px-4">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(trip.priceCents / 100)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {trip.startDate
                                            ? new Date(trip.startDate).toLocaleDateString("pt-BR")
                                            : "-"}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            {/* TODO: Implementar edição */}
                                            <Link href={`/admin/trips/${trip.id}`}>Editar</Link>
                                        </Button>
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
