
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const bookingId = (id || "").trim();

  if (!bookingId) {
    return NextResponse.json({ error: "bookingId inválido" }, { status: 400 });
  }

  // 1) Verifica se existe e se é do usuário logado
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, userId: true, status: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  }

  if (booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  // 2) Se já estiver cancelada, só retorna ok (idempotente)
  if (booking.status === "CANCELED") {
    return NextResponse.json({ ok: true, status: "CANCELED" });
  }

  // 3) Cancela
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELED" },
    select: { id: true, status: true },
  });

  return NextResponse.json(updated);
}

