import { PhysicalLevel, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { TripGrid } from "@/components/trip-grid";
import { asLocalizedList, asLocalizedText } from "@/lib/types";

export const dynamic = 'force-dynamic'; // Garantir que não faça cache estático se quisermos dados frescos

interface TripListProps {
  searchParams?: {
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
    level?: string;
    children?: string;
  };
}

export default async function TripList({ searchParams }: TripListProps) {
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const duration = searchParams?.duration && searchParams.duration !== 'all' ? Number(searchParams.duration) : undefined;
  const level = searchParams?.level && searchParams.level !== 'all' ? searchParams.level : undefined;
  const children = searchParams?.children === 'true' ? true : undefined;

  const where: Prisma.TripWhereInput = {
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
      <div className="text-center py-10">
        <p className="text-muted-foreground text-lg">Nenhum passeio encontrado com esses filtros.</p>
      </div>
    );
  }

  const serializedTrips = trips.map(trip => ({
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
  }));

  return <TripGrid trips={serializedTrips} />;
}

