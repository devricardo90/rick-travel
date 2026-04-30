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
const SEED_TRIP_ID_001 = 'seed-001-cristo-dona-marta'
const SEED_SCHEDULE_ID_001 = 'seed-001-schedule-001'

const SEED_TRIP_ID_002 = 'seed-002-pao-de-acucar'
const SEED_SCHEDULE_ID_002 = 'seed-002-schedule-002'

const IMAGE_PAO_DE_ACUCAR = '/images/trips/imagem-pao-de-acucar.jpg'
const IMAGE_PLACEHOLDER = '/images/placeholder.svg'

/** Returns a date N days from now at 12:00 UTC. */
function futureScheduleDate(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
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
    console.log('[seed] Starting RT-019A seed update...')

    // --- Trip 1: Cristo Redentor ---
    const trip1 = await prisma.trip.upsert({
      where: { id: SEED_TRIP_ID_001 },
      update: {
        isPublished: true,
        // Reset image if it was mistakenly set to Sugarloaf
        imageUrl: IMAGE_PLACEHOLDER,
      },
      create: {
        id: SEED_TRIP_ID_001,
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
        imageUrl: IMAGE_PLACEHOLDER,
        isPublished: true,
        durationDays: 1,
        physicalLevel: PhysicalLevel.MODERATE,
        childrenAllowed: true,
        highlights: {
          pt: ['Cristo Redentor', 'Mirante Dona Marta', 'Vista panorâmica da Baía de Guanabara', 'Guia bilíngue incluso'],
          en: ['Christ the Redeemer', 'Dona Marta Viewpoint', 'Panoramic view of Guanabara Bay', 'Bilingual guide included'],
          es: ['Cristo Redentor', 'Mirador Dona Marta', 'Vista panorámica de la Bahía de Guanabara', 'Guía bilingüe incluido'],
          sv: ['Kristusstatyn', 'Utsiktsplatsen Dona Marta', 'Panoramautsikt över Guanabarabukten', 'Tvåspråkig guide inkluderad'],
        },
      },
    })
    console.log(`[seed] Trip 1 upserted: ${trip1.id}`)

    // --- Trip 2: Pao de Acucar ---
    const trip2 = await prisma.trip.upsert({
      where: { id: SEED_TRIP_ID_002 },
      update: {
        isPublished: true,
        imageUrl: IMAGE_PAO_DE_ACUCAR,
      },
      create: {
        id: SEED_TRIP_ID_002,
        title: {
          pt: 'Pão de Açúcar ao Entardecer',
          en: 'Sugarloaf Mountain at Sunset',
          es: 'Pan de Azúcar al Atardecer',
          sv: 'Sockertoppen vid solnedgången',
        },
        description: {
          pt: 'Uma das vistas mais icônicas do mundo. Suba o teleférico e contemple o pôr do sol inesquecível sobre a Baía de Guanabara.',
          en: 'One of the most iconic views in the world. Take the cable car and witness an unforgettable sunset over Guanabara Bay.',
          es: 'Una de las vistas más icónicas del mundo. Sube al teleférico y contempla un atardecer inolvidable sobre la Bahía de Guanabara.',
          sv: 'En av de mest ikoniska utsikterna i världen. Ta linbanan och upplev en oförglömlig solnedgång över Guanabarabukten.',
        },
        city: 'Rio de Janeiro',
        location: 'Urca, Rio de Janeiro',
        priceCents: 29500,
        imageUrl: IMAGE_PAO_DE_ACUCAR,
        isPublished: true,
        durationDays: 1,
        physicalLevel: PhysicalLevel.LIGHT,
        childrenAllowed: true,
        highlights: {
          pt: ['Passeio de bondinho', 'Pôr do sol panorâmico', 'Morro da Urca', 'História do Rio'],
          en: ['Cable car ride', 'Panoramic sunset', 'Urca Hill', 'History of Rio'],
          es: ['Paseo en teleférico', 'Atardecer panorámico', 'Morro de Urca', 'Historia de Río'],
          sv: ['Linbanetur', 'Panoramisk solnedgång', 'Urca-kullen', 'Rios historia'],
        },
      },
    })
    console.log(`[seed] Trip 2 upserted: ${trip2.id}`)

    // --- Schedule 1 ---
    await prisma.tripSchedule.upsert({
      where: { id: SEED_SCHEDULE_ID_001 },
      update: { startAt: futureScheduleDate(90), status: 'OPEN' },
      create: {
        id: SEED_SCHEDULE_ID_001,
        tripId: SEED_TRIP_ID_001,
        startAt: futureScheduleDate(90),
        capacity: 10,
        pricePerPersonCents: 24500,
        status: 'OPEN',
      },
    })

    // --- Schedule 2 ---
    await prisma.tripSchedule.upsert({
      where: { id: SEED_SCHEDULE_ID_002 },
      update: { startAt: futureScheduleDate(95), status: 'OPEN' },
      create: {
        id: SEED_SCHEDULE_ID_002,
        tripId: SEED_TRIP_ID_002,
        startAt: futureScheduleDate(95),
        capacity: 12,
        pricePerPersonCents: 29500,
        status: 'OPEN',
      },
    })

    console.log('[seed] RT-019A seed update completed successfully.')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error('[seed] FATAL:', e)
  process.exit(1)
})
