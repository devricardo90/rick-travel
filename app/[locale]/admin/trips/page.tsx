import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteTripButton } from "@/components/admin/delete-trip-button";
import { prisma } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/localized-field";
import { asLocalizedText } from "@/lib/types";

export default async function AdminTripsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      translationLogs: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          status: true,
          createdAt: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Viagens</h1>
        <Link href={`/${locale}/admin/trips/new`}>
          <Button>+ Nova Viagem</Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground">
            <tr>
              <th className="px-4 py-4">Titulo</th>
              <th className="px-4 py-4">Descricao</th>
              <th className="px-4 py-4">Cidade</th>
              <th className="px-4 py-4">Preco</th>
              <th className="px-4 py-4">Data</th>
              <th className="px-4 py-4">Publicacao</th>
              <th className="px-4 py-4">Traducao</th>
              <th className="px-4 py-4 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {trips.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  Nenhuma viagem cadastrada.
                </td>
              </tr>
            ) : (
              trips.map((trip) => {
                const lastTranslation = trip.translationLogs[0];

                return (
                  <tr key={trip.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-4 font-semibold text-foreground">
                      {getLocalizedField<string>(asLocalizedText(trip.title), "pt")}
                    </td>
                    <td
                      className="max-w-[200px] truncate px-4 py-4 text-muted-foreground"
                      title={getLocalizedField<string>(asLocalizedText(trip.description), "pt") || ""}
                    >
                      {getLocalizedField<string>(asLocalizedText(trip.description), "pt") || "-"}
                    </td>
                    <td className="px-4 py-4 text-foreground/80">{trip.city}</td>
                    <td className="px-4 py-4 font-medium text-foreground/80">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(trip.priceCents / 100)}
                    </td>
                    <td className="px-4 py-4 text-foreground/80">
                      {trip.startDate ? new Date(trip.startDate).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          trip.isPublished
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-slate-200 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                        }`}
                      >
                        {trip.isPublished ? "Publicado" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {lastTranslation ? (
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              lastTranslation.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : lastTranslation.status === "PARTIAL_FALLBACK"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                            }`}
                          >
                            {lastTranslation.status === "SUCCESS"
                              ? "OK"
                              : lastTranslation.status === "PARTIAL_FALLBACK"
                                ? "Fallback parcial"
                                : "Fallback total"}
                          </span>
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(lastTranslation.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem log</span>
                      )}
                    </td>
                    <td className="flex justify-end gap-2 px-4 py-4 text-right">
                      <Button variant="outline" size="sm" asChild className="rounded-lg">
                        <Link href={`/${locale}/admin/trips/${trip.id}/schedules`}>Agenda</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="rounded-lg">
                        <Link href={`/${locale}/admin/trips/${trip.id}`}>Editar</Link>
                      </Button>
                      <DeleteTripButton tripId={trip.id} />
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
