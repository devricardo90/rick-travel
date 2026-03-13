import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteTripButton } from "@/components/admin/delete-trip-button";
import { getLocalizedField } from "@/lib/translation-service";

export default async function AdminTripsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const trips = await prisma.trip.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Gerenciar Viagens</h1>
                <Link href={`/${locale}/admin/trips/new`}>
                    <Button>+ Nova Viagem</Button>
                </Link>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                        <tr>
                            <th className="py-4 px-4">Título</th>
                            <th className="py-4 px-4">Descrição</th>
                            <th className="py-4 px-4">Cidade</th>
                            <th className="py-4 px-4">Preço</th>
                            <th className="py-4 px-4">Data</th>
                            <th className="py-4 px-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {trips.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                    Nenhuma viagem cadastrada.
                                </td>
                            </tr>
                        ) : (
                            trips.map((trip) => (
                                <tr key={trip.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="py-4 px-4 font-semibold text-foreground">
                                        {getLocalizedField<string>(trip.title, 'pt')}
                                    </td>
                                    <td className="py-4 px-4 text-muted-foreground max-w-[200px] truncate" title={getLocalizedField<string>(trip.description, 'pt') || ""}>
                                        {getLocalizedField<string>(trip.description, 'pt') || "-"}
                                    </td>
                                    <td className="py-4 px-4 text-foreground/80">{trip.city}</td>
                                    <td className="py-4 px-4 text-foreground/80 font-medium">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(trip.priceCents / 100)}
                                    </td>
                                    <td className="py-4 px-4 text-foreground/80">
                                        {trip.startDate
                                            ? new Date(trip.startDate).toLocaleDateString("pt-BR")
                                            : "-"}
                                    </td>
                                    <td className="py-4 px-4 text-right flex justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild className="rounded-lg">
                                            <Link href={`/${locale}/admin/trips/${trip.id}/schedules`}>Agenda</Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild className="rounded-lg">
                                            <Link href={`/${locale}/admin/trips/${trip.id}`}>Editar</Link>
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
