import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Revalidar a cada 60 segundos
export const revalidate = 60

export async function GET() {
    try {
        const trips = await prisma.trip.findMany({
            where: {
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                city: true,
                location: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(trips, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        })
    } catch (error) {
        console.error('Error fetching trips:', error)
        return NextResponse.json(
            { error: 'Failed to fetch trips' },
            { status: 500 }
        )
    }
}
