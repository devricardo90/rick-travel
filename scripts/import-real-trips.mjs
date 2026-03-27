import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

function buildLocalizedText(value) {
  const text = String(value || "").trim();
  return { pt: text, en: text, es: text, sv: text };
}

function buildLocalizedList(items) {
  const list = Array.isArray(items) ? items.map((item) => String(item).trim()).filter(Boolean) : [];
  return { pt: list, en: list, es: list, sv: list };
}

function buildDescription(trip) {
  const parts = [];

  if (trip.descricao) {
    parts.push(String(trip.descricao).trim());
  }

  if (trip.duracao) {
    parts.push(`Duracao: ${String(trip.duracao).trim()}.`);
  }

  if (trip.categoria) {
    parts.push(`Categoria: ${String(trip.categoria).trim()}.`);
  }

  if (Array.isArray(trip.inclusoes) && trip.inclusoes.length > 0) {
    parts.push(`Inclusoes: ${trip.inclusoes.join(", ")}.`);
  }

  if (Array.isArray(trip.exclusoes) && trip.exclusoes.length > 0) {
    parts.push(`Exclusoes: ${trip.exclusoes.join(", ")}.`);
  }

  return parts.join("\n\n");
}

async function upsertTrip(realTrip) {
  const existing = await prisma.trip.findFirst({
    where: {
      OR: [
        {
          title: {
            path: ["pt"],
            equals: realTrip.matchByTitlePt,
          },
        },
        {
          title: {
            path: ["pt"],
            equals: realTrip.nome,
          },
        },
      ],
    },
  });

  const data = {
    title: buildLocalizedText(realTrip.nome),
    description: buildLocalizedText(buildDescription(realTrip)),
    highlights: buildLocalizedList(realTrip.highlights),
    city: String(realTrip.local || "Rio de Janeiro").trim(),
    location: realTrip.location ? String(realTrip.location).trim() : String(realTrip.local || "").trim(),
    priceCents: Math.round(Number(realTrip.preco_base || 0) * 100),
    imageUrl: String(realTrip.imageUrl || "/images/placeholder.svg").trim(),
    isPublished: true,
    startDate: null,
    endDate: null,
    maxGuests: null,
  };

  let trip;

  if (existing) {
    trip = await prisma.trip.update({
      where: { id: existing.id },
      data,
    });
    console.log(`Atualizado: ${realTrip.nome} -> ${existing.id}`);
  } else {
    trip = await prisma.trip.create({ data });
    console.log(`Criado: ${realTrip.nome} -> ${trip.id}`);
  }

  await prisma.translationJobLog.create({
    data: {
      tripId: trip.id,
      entityType: "TRIP",
      operation: existing ? "UPDATE" : "CREATE",
      provider: "MANUAL_IMPORT",
      status: "SUCCESS",
      sourceLocale: "pt",
      metadata: {
        slug: realTrip.slug,
        categoria: realTrip.categoria,
        importedAt: new Date().toISOString(),
      },
    },
  });

  return trip;
}

async function main() {
  const filePath = path.join(process.cwd(), "data", "real-trips.json");
  const input = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const realTrip of input) {
    await upsertTrip(realTrip);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
