import { notFound } from "next/navigation";
import TripForm from "@/components/admin/trip-form";
import { prisma } from "@/lib/prisma";
import { asLocalizedList, asLocalizedText } from "@/lib/types";

interface EditTripPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  if (!trip) {
    notFound();
  }

  const titleTranslations = asLocalizedText(trip.title);
  const descriptionTranslations = asLocalizedText(trip.description);
  const highlightsTranslations = asLocalizedList(trip.highlights);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
      <div className="mb-8 rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
          Edicao de passeio
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
          Editar Viagem
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
          Atualize dados editoriais, publicacao e conteudo traduzido com uma leitura mais organizada para operacao interna.
        </p>
      </div>

      <TripForm
        initialData={{
          id: trip.id,
          city: trip.city,
          location: trip.location,
          priceCents: trip.priceCents,
          imageUrl: trip.imageUrl,
          isPublished: trip.isPublished,
          startDate: trip.startDate,
          endDate: trip.endDate,
          maxGuests: trip.maxGuests,
          titleTranslations:
            titleTranslations && typeof titleTranslations === "object" && !Array.isArray(titleTranslations)
              ? titleTranslations
              : null,
          descriptionTranslations:
            descriptionTranslations &&
            typeof descriptionTranslations === "object" &&
            !Array.isArray(descriptionTranslations)
              ? descriptionTranslations
              : null,
          highlightsTranslations:
            highlightsTranslations &&
            typeof highlightsTranslations === "object" &&
            !Array.isArray(highlightsTranslations)
              ? highlightsTranslations
              : null,
        }}
      />
    </div>
  );
}
