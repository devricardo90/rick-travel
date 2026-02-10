
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      trip: { select: { id: true, title: true, city: true, priceCents: true } },
    },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const userId = session.user.id;
  const tripId = typeof body?.tripId === "string" ? body.tripId.trim() : "";
  const guestCount = typeof body?.guestCount === "number" && body.guestCount > 0 ? Math.floor(body.guestCount) : 1;

  if (!tripId) {
    return NextResponse.json({ error: "Campo obrigatório: tripId" }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true, priceCents: true, maxGuests: true },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip não encontrada" }, { status: 404 });
    }

    if (trip.maxGuests && guestCount > trip.maxGuests) {
      return NextResponse.json({ error: `Máximo de ${trip.maxGuests} hóspedes para esta viagem.` }, { status: 400 });
    }

    const totalPriceCents = trip.priceCents * guestCount;

    const created = await prisma.booking.create({
      data: {
        userId,
        tripId,
        guestCount,
        totalPriceCents,
        status: "CONFIRMED" // Assumindo confirmado para simplificar, ou PENDING se tiver pagamento real
      },
      include: {
        trip: { select: { id: true, title: true, city: true, priceCents: true } },
      },
      // Removida a restrição implícita de unique se o schema permitir, mas se o schema ainda tiver @@unique([userId, tripId]), isso falhará se tentar reservar a mesma trip.
      // Vou manter o tratamento de erro P2002 para garantir.
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Você já possui reserva para esse passeio" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar booking" }, { status: 500 });
  }
}

