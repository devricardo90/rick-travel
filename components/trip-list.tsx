import { prisma } from "@/lib/prisma";
import { TripGrid } from "@/components/trip-grid";

export const dynamic = 'force-dynamic'; // Garantir que não faça cache estático se quisermos dados frescos

export default async function TripList() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedTrips = trips.map(trip => ({
    ...trip,
    startDate: trip.startDate?.toISOString() ?? null,
    endDate: trip.endDate?.toISOString() ?? null,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
    priceCents: Number(trip.priceCents) // Garantir que seja number
  }));

  return <TripGrid trips={serializedTrips} />;
}

