import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tripSchema } from '@/lib/schemas'
import { translateArray, translateText } from '@/lib/translation-service'
import { z } from 'zod'

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

    try {
        const body = await req.json()
        const validated = tripSchema.parse(body)
        const startDate = validated.startDate ? new Date(validated.startDate) : null
        const endDate = validated.endDate ? new Date(validated.endDate) : null
        const translatedTitle = await translateText(validated.title, 'pt')
        const translatedDescription = validated.description
            ? await translateText(validated.description, 'pt')
            : null
        const translatedHighlights = validated.highlights?.length
            ? await translateArray(validated.highlights, 'pt')
            : { pt: [], en: [], es: [], sv: [] }

        const updated = await prisma.trip.update({
            where: { id },
            data: {
                title: translatedTitle as never,
                city: validated.city,
                location: validated.location,
                description: translatedDescription as never,
                priceCents: validated.priceCents,
                imageUrl: validated.imageUrl,
                startDate,
                endDate,
                maxGuests: validated.maxGuests,
                highlights: translatedHighlights as never,
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0]?.message ?? 'Dados inválidos' },
                { status: 400 }
            )
        }

        console.error('Error updating trip:', error)
        return NextResponse.json(
            { error: 'Failed to update trip' },
            { status: 500 }
        )
    }
}
