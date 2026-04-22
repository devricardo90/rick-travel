import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteTripButton } from "@/components/admin/delete-trip-button";
import { prisma } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/localized-field";
import { asLocalizedText } from "@/lib/types";

function publicationClass(isPublished: boolean) {
  return isPublished
    ? "border-emerald-400/18 bg-emerald-500/10 text-emerald-200"
    : "border-slate-300/14 bg-slate-400/10 text-slate-200";
}

function translationClass(status: string) {
  if (status === "SUCCESS") return "border-emerald-400/18 bg-emerald-500/10 text-emerald-200";
  if (status === "PARTIAL_FALLBACK") return "border-amber-400/18 bg-amber-500/10 text-amber-200";
  return "border-red-400/18 bg-red-500/10 text-red-200";
}

function translationLabel(status: string) {
  if (status === "SUCCESS") return "OK";
  if (status === "PARTIAL_FALLBACK") return "Fallback parcial";
  return "Fallback total";
}

type TripWithRelations = Awaited<ReturnType<typeof getAdminTrips>>[number];

async function getAdminTrips() {
  return prisma.trip.findMany({
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
}

export default async function AdminTripsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const trips = await getAdminTrips();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
      <div className="mb-8 rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
              Catalogo e publicacao
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Gerenciar Viagens
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
              Acompanhe o catalogo de passeios, o estado de publicacao e os sinais de traducao com uma leitura mais clara para operacao diaria.
            </p>
          </div>

          <Link href={`/${locale}/admin/trips/new`}>
            <Button className="h-12 rounded-2xl bg-[#123a28] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#184731]">
              + Nova Viagem
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="hidden grid-cols-[1.1fr_1.35fr_0.7fr_0.7fr_0.7fr_0.75fr_0.85fr_1fr] gap-4 border-b border-white/8 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 xl:grid">
          <div>Titulo</div>
          <div>Descricao</div>
          <div>Cidade</div>
          <div>Preco</div>
          <div>Data</div>
          <div>Publicacao</div>
          <div>Traducao</div>
          <div className="text-right">Acoes</div>
        </div>

        {trips.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-white/56">
            Nenhuma viagem cadastrada.
          </div>
        ) : (
          <div className="divide-y divide-white/8">
            {trips.map((trip: TripWithRelations) => {
              const lastTranslation = trip.translationLogs[0];

              return (
                <div
                  key={trip.id}
                  className="grid gap-5 px-5 py-5 transition-colors hover:bg-white/[0.02] xl:grid-cols-[1.1fr_1.35fr_0.7fr_0.7fr_0.7fr_0.75fr_0.85fr_1fr] xl:items-start"
                >
                  <div className="font-semibold text-white">
                    {getLocalizedField<string>(asLocalizedText(trip.title), "pt")}
                  </div>

                  <div
                    className="max-w-xl text-sm leading-7 text-white/60"
                    title={getLocalizedField<string>(asLocalizedText(trip.description), "pt") || ""}
                  >
                    {getLocalizedField<string>(asLocalizedText(trip.description), "pt") || "-"}
                  </div>

                  <div className="text-sm text-white/72">{trip.city}</div>

                  <div className="text-sm font-medium text-white/82">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(trip.priceCents / 100)}
                  </div>

                  <div className="text-sm text-white/60">
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString("pt-BR") : "-"}
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${publicationClass(trip.isPublished)}`}
                    >
                      {trip.isPublished ? "Publicado" : "Oculto"}
                    </span>
                  </div>

                  <div>
                    {lastTranslation ? (
                      <div className="space-y-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${translationClass(lastTranslation.status)}`}
                        >
                          {translationLabel(lastTranslation.status)}
                        </span>
                        <div className="text-[11px] text-white/42">
                          {new Date(lastTranslation.createdAt).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-white/42">Sem log</span>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-9 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-white/72 hover:bg-white/[0.08] hover:text-white"
                    >
                      <Link href={`/${locale}/admin/trips/${trip.id}/schedules`}>Agenda</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-9 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white/72 hover:bg-white/[0.08] hover:text-white"
                    >
                      <Link href={`/${locale}/admin/trips/${trip.id}`}>Editar</Link>
                    </Button>
                    <DeleteTripButton tripId={trip.id} />
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
