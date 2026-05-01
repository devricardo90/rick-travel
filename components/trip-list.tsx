import { prisma } from "@/lib/prisma";
import { TripGrid } from "@/components/trip-grid";
import { asLocalizedList, asLocalizedText, type PhysicalLevel } from "@/lib/types";
import { getLocalizedField } from "@/lib/localized-field";

type TripWhereInput = NonNullable<Parameters<typeof prisma.trip.findMany>[0]>["where"];

export const dynamic = 'force-dynamic'; // Garantir que não faça cache estático se quisermos dados frescos

interface TripListProps {
  searchParams?: {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
    level?: string;
    children?: string;
  };
  locale?: string;
}

function normalizeSearchText(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default async function TripList({ searchParams, locale = "pt" }: TripListProps) {
  const search = normalizeSearchText(searchParams?.search);
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const duration = searchParams?.duration && searchParams.duration !== 'all' ? Number(searchParams.duration) : undefined;
  const level = searchParams?.level && searchParams.level !== 'all' ? searchParams.level : undefined;
  const children = searchParams?.children === 'true' ? true : undefined;

  const where: TripWhereInput = {
    isPublished: true,
  };

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.priceCents = {};
    if (minPrice !== undefined) where.priceCents.gte = minPrice * 100; // Convert to cents
    if (maxPrice !== undefined) where.priceCents.lte = maxPrice * 100;
  }

  if (duration !== undefined) {
    if (duration === 3) {
      where.durationDays = { gte: 3 };
    } else {
      where.durationDays = duration;
    }
  }

  if (level) {
    where.physicalLevel = level as PhysicalLevel;
  }

  if (children !== undefined) {
    where.childrenAllowed = children;
  }

  const trips = await prisma.trip.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  if (trips.length === 0) {
    return (
      <div className="surface-dark px-6 py-16 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">Nenhum passeio encontrado</h3>
          <p className="mt-3 text-[15px] leading-7 text-white/60">
            Ajuste os filtros para ampliar a busca e encontrar o roteiro ideal para sua viagem no Rio.
          </p>
        </div>
      </div>
    );
  }

  type TripRecord = (typeof trips)[number];

  const serializedTrips = trips
    .map((trip: TripRecord) => ({
      ...trip,
      title: asLocalizedText(trip.title) ?? {},
      description: asLocalizedText(trip.description),
      highlights: asLocalizedList(trip.highlights),
      startDate: trip.startDate?.toISOString() ?? null,
      endDate: trip.endDate?.toISOString() ?? null,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
      priceCents: Number(trip.priceCents), // Garantir que seja number
      // Ensure new fields are passed if they are not in the type definition yet (Prisma client might not be fully regenerated in IDE context)
      durationDays: trip.durationDays ?? 1,
      physicalLevel: trip.physicalLevel ?? 'LIGHT',
      childrenAllowed: trip.childrenAllowed ?? true,
    }))
    .filter((trip) => {
      if (!search) return true;

      const searchableText = [
        getLocalizedField<string>(trip.title, locale),
        getLocalizedField<string>(trip.description, locale),
        trip.city,
        trip.location,
      ]
        .map(normalizeSearchText)
        .join(" ");

      return searchableText.includes(search);
    });

  return <TripGrid trips={serializedTrips} />;
}

