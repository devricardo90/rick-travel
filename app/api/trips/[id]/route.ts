import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Ensure only admins can update trips
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    // Reuse validation logic or simplify for now
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

    try {
        const updated = await prisma.trip.update({
            where: { id },
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

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error updating trip:', error)
        return NextResponse.json(
            { error: 'Failed to update trip' },
            { status: 500 }
        )
    }
}
