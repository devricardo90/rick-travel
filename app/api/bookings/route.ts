
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendBookingConfirmationEmail } from "@/app/actions/email";

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
      schedule: { select: { startAt: true } },
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
  const scheduleId = typeof body?.scheduleId === "string" ? body.scheduleId.trim() : undefined;
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

    let totalPriceCents = trip.priceCents * guestCount;

    // Se tiver schedule, validar capacidade e usar preço do schedule se houver
    if (scheduleId) {
      const schedule = await prisma.tripSchedule.findUnique({
        where: { id: scheduleId },
        include: { _count: { select: { bookings: true } } }
      });

      if (!schedule || schedule.tripId !== tripId || schedule.status === "CLOSED") {
        return NextResponse.json({ error: "Agenda não disponível" }, { status: 400 });
      }

      if (schedule.capacity > 0 && (schedule._count.bookings + guestCount) > schedule.capacity) {
        return NextResponse.json({ error: "Capacidade esgotada para esta data" }, { status: 400 });
      }

      totalPriceCents = schedule.pricePerPersonCents * guestCount;
    }

    const created = await prisma.booking.create({
      data: {
        userId,
        tripId,
        scheduleId,
        guestCount,
        totalPriceCents,
        status: "CONFIRMED"
      },
      include: {
        trip: { select: { id: true, title: true, city: true, priceCents: true } },
      },
    });

    // Disparar e-mail em background (não aguardar para não travar a resposta)
    sendBookingConfirmationEmail(created.id).catch(console.error);

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

