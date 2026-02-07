
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(trips)
}

export async function POST(req: Request) {
  const body = await req.json()

  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const city = typeof body?.city === 'string' ? body.city.trim() : ''
  const description =
    typeof body?.description === 'string' ? body.description.trim() : null

  const priceCentsRaw = body?.priceCents
  const priceCents =
    typeof priceCentsRaw === 'number' ? Math.trunc(priceCentsRaw) : NaN

  if (!title || !city || !Number.isFinite(priceCents) || priceCents < 0) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: title, city, priceCents (>= 0)' },
      { status: 400 }
    )
  }

  const created = await prisma.trip.create({
    data: { title, city, description, priceCents },
  })

  return NextResponse.json(created, { status: 201 })
}
