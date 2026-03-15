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
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Editar Viagem</h1>
      <TripForm
        initialData={{
          id: trip.id,
          city: trip.city,
          location: trip.location,
          priceCents: trip.priceCents,
          imageUrl: trip.imageUrl,
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
