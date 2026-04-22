import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { type SupportedLocale, tripSchema, TripInput } from "@/lib/schemas";
import {
  logTranslationJob,
  translateArrayWithMeta,
  translateTextWithMeta,
} from "@/lib/translation-service";
import { DomainError } from "@/lib/errors/domain-error";

const TARGET_LOCALES: Exclude<SupportedLocale, "pt">[] = ["en", "es", "sv"];

function normalizeText(value: string | undefined | null) {
  const normalized = value?.trim() ?? "";
  return normalized;
}

function normalizeList(values: string[] | undefined | null) {
  return (values ?? []).map((item) => item.trim()).filter(Boolean);
}

async function resolveLocalizedText(
  field: string,
  manualTranslations: Partial<Record<SupportedLocale, string>> | undefined,
  legacyValue: string | undefined
) {
  const ptValue = normalizeText(manualTranslations?.pt) || normalizeText(legacyValue);

  if (!ptValue) {
    return {
      translations: { pt: "", en: "", es: "", sv: "" },
      logPart: {
        field,
        provider: "MANUAL_ADMIN",
        status: "SUCCESS" as const,
        failures: [],
      },
    };
  }

  const autoTranslation = await translateTextWithMeta(ptValue, "pt");
  const translations = {
    pt: ptValue,
    en: normalizeText(manualTranslations?.en) || autoTranslation.translations.en,
    es: normalizeText(manualTranslations?.es) || autoTranslation.translations.es,
    sv: normalizeText(manualTranslations?.sv) || autoTranslation.translations.sv,
  };

  const missingLocales = TARGET_LOCALES.filter((locale) => !normalizeText(manualTranslations?.[locale]));
  const relevantFailures = autoTranslation.meta.failures.filter((failure) => missingLocales.includes(failure.locale));

  return {
    translations,
    logPart: {
      field,
      provider: missingLocales.length === 0 ? "MANUAL_ADMIN" : autoTranslation.meta.provider,
      status:
        missingLocales.length === 0
          ? ("SUCCESS" as const)
          : relevantFailures.length === 0
            ? ("SUCCESS" as const)
            : relevantFailures.length === missingLocales.length
              ? ("FULL_FALLBACK" as const)
              : ("PARTIAL_FALLBACK" as const),
      failures: relevantFailures,
    },
  };
}

async function resolveLocalizedList(
  field: string,
  manualTranslations: Partial<Record<SupportedLocale, string[]>> | undefined,
  legacyValue: string[] | undefined
) {
  const manualPtValue = normalizeList(manualTranslations?.pt);
  const ptValue = manualPtValue.length > 0 ? manualPtValue : normalizeList(legacyValue);
  const autoTranslation = ptValue.length > 0 ? await translateArrayWithMeta(ptValue, "pt") : null;
  const manualEn = normalizeList(manualTranslations?.en);
  const manualEs = normalizeList(manualTranslations?.es);
  const manualSv = normalizeList(manualTranslations?.sv);
  const translations = {
    pt: ptValue,
    en: manualEn.length > 0 ? manualEn : autoTranslation?.translations.en || [],
    es: manualEs.length > 0 ? manualEs : autoTranslation?.translations.es || [],
    sv: manualSv.length > 0 ? manualSv : autoTranslation?.translations.sv || [],
  };

  const missingLocales = TARGET_LOCALES.filter((locale) => normalizeList(manualTranslations?.[locale]).length === 0);
  const relevantFailures = autoTranslation?.meta.failures.filter((failure) => missingLocales.includes(failure.locale)) ?? [];

  return {
    translations,
    logPart: {
      field,
      provider: missingLocales.length === 0 ? "MANUAL_ADMIN" : autoTranslation?.meta.provider ?? "MANUAL_EMPTY",
      status:
        missingLocales.length === 0
          ? ("SUCCESS" as const)
          : relevantFailures.length === 0
            ? ("SUCCESS" as const)
            : relevantFailures.length === missingLocales.length
              ? ("FULL_FALLBACK" as const)
              : ("PARTIAL_FALLBACK" as const),
      failures: relevantFailures,
    },
  };
}

async function buildTripPayload(data: TripInput) {
  const validated = tripSchema.parse(data);
  const startDate = validated.startDate ? new Date(validated.startDate) : null;
  const endDate = validated.endDate ? new Date(validated.endDate) : null;

  const title = await resolveLocalizedText("title", validated.titleTranslations, validated.title);
  const description = await resolveLocalizedText(
    "description",
    validated.descriptionTranslations,
    validated.description
  );
  const highlights = await resolveLocalizedList(
    "highlights",
    validated.highlightsTranslations,
    validated.highlights
  );

  return {
    payload: {
      title: title.translations,
      description: description.translations,
      highlights: highlights.translations,
      city: validated.city,
      priceCents: validated.priceCents,
      imageUrl: validated.imageUrl,
      isPublished: validated.isPublished,
      location: validated.location,
      maxGuests: validated.maxGuests,
      startDate,
      endDate,
    },
    translationParts: [title.logPart, description.logPart, highlights.logPart],
  };
}

export async function createTripRecord(data: TripInput) {
  try {
    const { payload, translationParts } = await buildTripPayload(data);
    const trip = await prisma.trip.create({ data: payload });
    await logTranslationJob({
      tripId: trip.id,
      operation: "CREATE",
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
      operation: "UPDATE",
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
