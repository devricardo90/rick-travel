/**
 * RT-015B — Minimal Production Tour Seed
 *
 * Idempotency strategy: Trip model has no slug or unique field besides `id`.
 * We anchor on fixed deterministic IDs. Prisma upsert on `id` is safe because
 * `id` is @id (unique). Running this script multiple times is harmless.
 *
 * Rules:
 * - NO deleteMany on Trip, Booking, or any other table
 * - NO schema changes, NO migrations
 * - Update on re-run is minimal and non-destructive
 * - Schedule startAt is computed dynamically (90 days from now) so the
 *   seed stays valid over time without manual updates
 *
 * Usage:
 *   DATABASE_URL=<neon-connection-string> npx tsx prisma/seed.ts
 *   OR:
 *   npx prisma db seed   (requires DATABASE_URL in env)
 */

import { PrismaClient, PhysicalLevel } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

// Deterministic seed IDs — the anchor for idempotent upsert.
// Changing these values would create NEW records. Do not rename.
const SEED_TRIP_ID = 'seed-001-cristo-dona-marta'
const SEED_SCHEDULE_ID = 'seed-001-schedule-001'
const SEED_TRIP_IMAGE_URL = '/images/trips/imagem-morro-pao-de-acucar.jpg'

/** Returns a date 90 days from now at 12:00 UTC. */
function futureScheduleDate(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 90)
  d.setUTCHours(12, 0, 0, 0)
  return d
}

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('[seed] ERROR: DATABASE_URL is not set. Aborting.')
    process.exit(1)
  }

  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('[seed] Starting RT-015B minimal seed...')

    // --- Trip ---
    const trip = await prisma.trip.upsert({
      where: { id: SEED_TRIP_ID },
      // On re-run: re-publish and keep the seeded image on a real local asset.
      // Title/price/city are not overwritten to avoid clobbering manual edits.
      update: {
        isPublished: true,
        imageUrl: SEED_TRIP_IMAGE_URL,
      },
      create: {
        id: SEED_TRIP_ID,
        title: {
          pt: 'Cristo Redentor + Mirante Dona Marta',
          en: 'Christ the Redeemer + Dona Marta Viewpoint',
          es: 'Cristo Redentor + Mirador Dona Marta',
          sv: 'Kristusstatyn + utsiktsplatsen Dona Marta',
        },
        description: {
          pt: 'Visite o símbolo do Rio de Janeiro e aproveite a vista privilegiada do Mirante Dona Marta com transporte e guia bilíngue inclusos.',
          en: 'Visit the symbol of Rio de Janeiro and enjoy the privileged view from Dona Marta Viewpoint with transport and bilingual guide included.',
          es: 'Visita el símbolo de Río de Janeiro y disfruta de la vista privilegiada del Mirador Dona Marta con transporte y guía bilingüe incluidos.',
          sv: 'Besök symbolen för Rio de Janeiro och njut av den privilegierade utsikten från Dona Marta med transport och tvåspråkig guide inkluderat.',
        },
        city: 'Rio de Janeiro',
        location: 'Corcovado / Morro Dona Marta, Rio de Janeiro',
        priceCents: 24500,
        imageUrl: SEED_TRIP_IMAGE_URL,
        isPublished: true,
        durationDays: 1,
        physicalLevel: PhysicalLevel.MODERATE,
        childrenAllowed: true,
        highlights: {
          pt: [
            'Cristo Redentor',
            'Mirante Dona Marta',
            'Vista panorâmica da Baía de Guanabara',
            'Guia bilíngue incluso',
          ],
          en: [
            'Christ the Redeemer',
            'Dona Marta Viewpoint',
            'Panoramic view of Guanabara Bay',
            'Bilingual guide included',
          ],
          es: [
            'Cristo Redentor',
            'Mirador Dona Marta',
            'Vista panorámica de la Bahía de Guanabara',
            'Guía bilingüe incluido',
          ],
          sv: [
            'Kristusstatyn',
            'Utsiktsplatsen Dona Marta',
            'Panoramautsikt över Guanabarabukten',
            'Tvåspråkig guide inkluderad',
          ],
        },
      },
    })

    const titlePt = (trip.title as Record<string, string>).pt
    console.log(`[seed] Trip upserted: ${trip.id} — "${titlePt}"`)

    // --- Schedule ---
    const startAt = futureScheduleDate()

    const schedule = await prisma.tripSchedule.upsert({
      where: { id: SEED_SCHEDULE_ID },
      // On re-run: refresh the future date and ensure status is OPEN.
      update: {
        startAt,
        status: 'OPEN',
      },
      create: {
        id: SEED_SCHEDULE_ID,
        tripId: SEED_TRIP_ID,
        startAt,
        capacity: 10,
        pricePerPersonCents: 24500,
        status: 'OPEN',
      },
    })

    console.log(
      `[seed] Schedule upserted: ${schedule.id} — startAt: ${schedule.startAt.toISOString()}`,
    )
    console.log('[seed] RT-015B seed completed successfully.')
    console.log('[seed] Next step: verify /tours shows the new trip (RT-015C).')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error('[seed] FATAL:', e)
  process.exit(1)
})
