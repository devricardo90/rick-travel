
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
  const location = typeof body?.location === 'string' ? body.location.trim() : ''
  const description =
    typeof body?.description === 'string' ? body.description.trim() : null
  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl.trim() : null

  const priceCentsRaw = body?.priceCents
  const priceCents =
    typeof priceCentsRaw === 'number' ? Math.trunc(priceCentsRaw) : NaN

  const maxGuestsRaw = body?.maxGuests
  const maxGuests =
    typeof maxGuestsRaw === 'number' ? Math.trunc(maxGuestsRaw) : null

  const startDate = body?.startDate ? new Date(body.startDate) : null
  const endDate = body?.endDate ? new Date(body.endDate) : null

  const highlights = Array.isArray(body?.highlights) ? body.highlights : []

  if (!title || !city || !Number.isFinite(priceCents) || priceCents < 0) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: title, city, priceCents (>= 0)' },
      { status: 400 }
    )
  }

  const created = await prisma.trip.create({
    data: {
      title,
      city,
      location,
      description,
      priceCents,
      imageUrl,
      startDate,
      endDate,
      maxGuests,
      highlights
    },
  })

  return NextResponse.json(created, { status: 201 })
}
