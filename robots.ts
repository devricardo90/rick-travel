
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/login', '/register', '/reservas', '/api'],
    },
    sitemap: 'https://ricktravel.com.br/sitemap.xml',
    host: 'https://ricktravel.com.br',
  }
}

