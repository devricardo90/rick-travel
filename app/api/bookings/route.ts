

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      trip: { select: { id: true, title: true, city: true, priceCents: true } },
    },
  })

  return NextResponse.json(bookings)
}

export async function POST(req: Request) {
  const body = await req.json()

  const userId = typeof body?.userId === 'string' ? body.userId.trim() : ''
  const tripId = typeof body?.tripId === 'string' ? body.tripId.trim() : ''

  if (!userId || !tripId) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: userId, tripId' },
      { status: 400 }
    )
  }

  try {
    // valida se existem (melhor erro 404 do que explodir FK)
    const [user, trip] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } }),
    ])

    if (!user) return NextResponse.json({ error: 'User não encontrado' }, { status: 404 })
    if (!trip) return NextResponse.json({ error: 'Trip não encontrada' }, { status: 404 })

    const created = await prisma.booking.create({
      data: { userId, tripId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        trip: { select: { id: true, title: true, city: true, priceCents: true } },
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    // unique constraint (userId, tripId)
    if (err?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Esse usuário já possui reserva para essa trip' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Erro ao criar booking' }, { status: 500 })
  }
}

