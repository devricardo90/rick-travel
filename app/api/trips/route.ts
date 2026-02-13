import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const trips = await prisma.trip.findMany({
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

        return NextResponse.json(trips)
    } catch (error) {
        console.error('Error fetching trips:', error)
        return NextResponse.json(
            { error: 'Failed to fetch trips' },
            { status: 500 }
        )
    }
}
