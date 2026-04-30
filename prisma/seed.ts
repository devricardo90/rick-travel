/**
 * RT-019A — Controlled Production Tour Seed
 *
 * Idempotency strategy:
 * 1. Anchors on fixed deterministic IDs for primary seed records.
 * 2. Before creating/upserting Pão de Açúcar, it searches for an existing
 *    draft with the same title to avoid semantic duplication.
 *
 * Rules:
 * - NO deleteMany on Trip, Booking, or any other table
 * - NO schema changes, NO migrations
 * - Update on re-run is minimal and non-destructive
 */

import { PrismaClient, PhysicalLevel } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

const SEED_TRIP_ID_001 = 'seed-001-cristo-dona-marta'
const SEED_SCHEDULE_ID_001 = 'seed-001-schedule-001'

const SEED_TRIP_ID_002 = 'seed-002-pao-de-acucar'
const SEED_SCHEDULE_ID_002 = 'seed-002-schedule-002'

const IMAGE_PAO_DE_ACUCAR = '/images/trips/imagem-pao-de-acucar.jpg'
// Current image in prod for Christ is actually Sugarloaf, but better than a grey placeholder.
// We keep it until a proper Christ image is available in the project.
const IMAGE_CRISTO_CURRENT = '/images/trips/imagem-morro-pao-de-acucar.jpg'

interface LocalizedText {
  pt?: string;
  en?: string;
  es?: string;
  sv?: string;
}

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
    console.log('[seed] Starting RT-019A controlled seed update...')

    // --- Trip 1: Cristo Redentor ---
    const trip1 = await prisma.trip.upsert({
      where: { id: SEED_TRIP_ID_001 },
      update: {
        isPublished: true,
        imageUrl: IMAGE_CRISTO_CURRENT,
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
          sv: 'Besök symbolen för Rio de Janeiro och njut av den privilegierade utsikten från Dona Marta com transport och tvåspråkig guide inkluderat.',
        },
        city: 'Rio de Janeiro',
        location: 'Corcovado / Morro Dona Marta, Rio de Janeiro',
        priceCents: 24500,
        imageUrl: IMAGE_CRISTO_CURRENT,
        isPublished: true,
        durationDays: 1,
        physicalLevel: PhysicalLevel.MODERATE,
        childrenAllowed: true,
        highlights: {
          pt: ['Cristo Redentor', 'Mirante Dona Marta', 'Vista panorâmica da Baía de Guanabara', 'Guia bilíngue incluso'],
          en: ['Christ the Redeemer', 'Dona Marta Viewpoint', 'Panoramic view of Guanabara Bay', 'Bilingual guide included'],
          es: ['Cristo Redentor', 'Mirador Dona Marta', 'Vista panorámica de la Bahía de Guanabara', 'Guía bilingüe incluido'],
          sv: ['Kristusstatyn', 'Utsiktsplatsen Dona Marta', 'Panoramautsikt över Guanabarabukten', 'Tvåspråkig guide inkluderada'],
        },
      },
    })
    console.log(`[seed] Trip 1 (Cristo) upserted: ${trip1.id}`)

    // --- Trip 2: Pao de Acucar (Semantic Match Logic) ---
    let trip2Id = SEED_TRIP_ID_002;

    // Attempt to find by ID first
    const existingById = await prisma.trip.findUnique({ where: { id: SEED_TRIP_ID_002 } });

    if (!existingById) {
      // If not found by ID, search by Title (PT) to avoid duplicating the existing draft in prod
      console.log('[seed] Checking for existing Pão de Açúcar draft by title...');
      const allTrips = await prisma.trip.findMany();
      const byTitle = allTrips.find(t => (t.title as unknown as LocalizedText)?.pt === 'Pão de Açúcar ao Entardecer');

      if (byTitle) {
        trip2Id = byTitle.id;
        console.log(`[seed] Semantic match found. Reusing existing ID: ${trip2Id}`);
      }
    }

    const trip2 = await prisma.trip.upsert({
      where: { id: trip2Id },
      update: {
        isPublished: true,
        imageUrl: IMAGE_PAO_DE_ACUCAR,
        city: 'Rio de Janeiro',
        priceCents: 29500,
      },
      create: {
        id: trip2Id,
        title: {
          pt: 'Pão de Açúcar ao Entardecer',
          en: 'Sugarloaf Mountain at Sunset',
          es: 'Pan de Azúcar al Atardecer',
          sv: 'Sockertoppen vid solnedgången',
        },
        description: {
          pt: 'Uma das vistas mais icônicas do mundo. Suba o teleférico e contemple o pôr do sol inesquecível sobre a Baía de Guanabara.',
          en: 'One of the most iconic views in the world. Take the cable car and witness an unforgettable sunset over Guanabara Bay.',
          es: 'Una de las vistas más icónicas del mundo. Sube al teleférico e contempla un atardecer inolvidable sobre la Bahía de Guanabara.',
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
    console.log(`[seed] Trip 2 (Pão de Açúcar) upserted: ${trip2.id}`)

    // --- Schedule 1 ---
    const s1 = await prisma.tripSchedule.upsert({
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
    console.log(`[seed] Schedule 1 upserted: ${s1.id}`)

    // --- Schedule 2 ---
    const s2 = await prisma.tripSchedule.upsert({
      where: { id: SEED_SCHEDULE_ID_002 },
      update: { startAt: futureScheduleDate(95), status: 'OPEN' },
      create: {
        id: SEED_SCHEDULE_ID_002,
        tripId: trip2.id,
        startAt: futureScheduleDate(95),
        capacity: 12,
        pricePerPersonCents: 29500,
        status: 'OPEN',
      },
    })
    console.log(`[seed] Schedule 2 upserted: ${s2.id}`)

    console.log('[seed] RT-019A controlled seed update completed successfully.');
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error('[seed] FATAL:', e)
  process.exit(1)
})
