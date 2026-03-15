import { Prisma, TranslationOperation } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { tripSchema, TripInput } from "@/lib/schemas";
import {
    logTranslationJob,
    translateArrayWithMeta,
    translateTextWithMeta,
} from "@/lib/translation-service";
import { DomainError } from "@/lib/errors/domain-error";

async function buildTripPayload(data: TripInput) {
    const validated = tripSchema.parse(data);

    const startDate = validated.startDate ? new Date(validated.startDate) : null;
    const endDate = validated.endDate ? new Date(validated.endDate) : null;

    const translatedTitle = await translateTextWithMeta(validated.title, "pt");
    const translatedDescription = validated.description
        ? await translateTextWithMeta(validated.description, "pt")
        : null;
    const translatedHighlights = validated.highlights?.length
        ? await translateArrayWithMeta(validated.highlights, "pt")
        : {
              translations: { pt: [], en: [], es: [], sv: [] },
              meta: {
                  provider: "MANUAL_EMPTY",
                  status: "SUCCESS" as const,
                  failures: [],
                  sourceLocale: "pt" as const,
              },
          };

    return {
        payload: {
            title: translatedTitle.translations as Prisma.InputJsonValue,
            description: translatedDescription?.translations as Prisma.InputJsonValue,
            highlights: translatedHighlights.translations as Prisma.InputJsonValue,
            city: validated.city,
            priceCents: validated.priceCents,
            imageUrl: validated.imageUrl,
            location: validated.location,
            maxGuests: validated.maxGuests,
            startDate,
            endDate,
        },
        translationParts: [
            {
                field: "title",
                provider: translatedTitle.meta.provider,
                status: translatedTitle.meta.status,
                failures: translatedTitle.meta.failures,
            },
            ...(translatedDescription
                ? [
                      {
                          field: "description",
                          provider: translatedDescription.meta.provider,
                          status: translatedDescription.meta.status,
                          failures: translatedDescription.meta.failures,
                      },
                  ]
                : []),
            {
                field: "highlights",
                provider: translatedHighlights.meta.provider,
                status: translatedHighlights.meta.status,
                failures: translatedHighlights.meta.failures,
            },
        ],
    };
}

export async function createTripRecord(data: TripInput) {
    try {
        const { payload, translationParts } = await buildTripPayload(data);
        const trip = await prisma.trip.create({ data: payload });
        await logTranslationJob({
            tripId: trip.id,
            operation: TranslationOperation.CREATE,
            parts: translationParts,
        });
        return trip;
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new DomainError(error.issues[0]?.message ?? "Dados invalidos para a viagem.", {
                code: "INVALID_TRIP_INPUT",
                status: 400,
            });
        }
        throw error;
    }
}

export async function updateTripRecord(id: string, data: TripInput) {
    try {
        const { payload, translationParts } = await buildTripPayload(data);
        const trip = await prisma.trip.update({
            where: { id },
            data: payload,
        });
        await logTranslationJob({
            tripId: trip.id,
            operation: TranslationOperation.UPDATE,
            parts: translationParts,
        });
        return trip;
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new DomainError(error.issues[0]?.message ?? "Dados invalidos para a viagem.", {
                code: "INVALID_TRIP_INPUT",
                status: 400,
            });
        }
        throw error;
    }
}

export async function deleteTripRecord(tripId: string) {
    const activeBookings = await prisma.booking.count({
        where: {
            tripId,
            status: { in: ["CONFIRMED", "PENDING"] },
        },
    });

    if (activeBookings > 0) {
        throw new DomainError(`Nao e possivel deletar: Existem ${activeBookings} reservas ativas.`, {
            code: "TRIP_HAS_ACTIVE_BOOKINGS",
            status: 400,
        });
    }

    return prisma.trip.delete({
        where: { id: tripId },
    });
}
