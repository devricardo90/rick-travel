import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ricktravel.com.br'

    // Rotas estáticas
    const routes = [
        '',
        '/tours',
        '/login',
        '/register',
        '/quem-somos',
        '/contato',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Rotas dinâmicas (Tours)
    // Usando createdAt como fallback para lastModified se updatedAt não estiver disponível no tipo gerado
    const trips = await prisma.trip.findMany({
        select: { id: true, createdAt: true }
    })

    const tripRoutes = trips.map((trip) => ({
        url: `${baseUrl}/tours/${trip.id}`,
        lastModified: trip.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...tripRoutes]
}
