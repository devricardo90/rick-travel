import "server-only";
import { TranslationJobStatus, TranslationOperation } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SupportedLocale = "pt" | "en" | "es" | "sv";

type TranslationResult = Record<SupportedLocale, string>;
type TranslationArrayResult = Record<SupportedLocale, string[]>;

type TranslationFailure = {
  locale: Exclude<SupportedLocale, "pt">;
  reason: string;
};

type TranslationMeta = {
  provider: string;
  status: TranslationJobStatus;
  failures: TranslationFailure[];
  sourceLocale: SupportedLocale;
};

const SOURCE_LOCALE: SupportedLocale = "pt";
const TARGET_LOCALES: Exclude<SupportedLocale, "pt">[] = ["en", "es", "sv"];
const ALL_LOCALES: SupportedLocale[] = ["pt", "en", "es", "sv"];
const TRANSLATION_PROVIDER = "MYMEMORY_FREE";

async function requestTranslation(text: string, sourceLang: SupportedLocale, targetLang: SupportedLocale) {
  const encodedText = encodeURIComponent(text);
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    responseData?: { translatedText?: string };
  };

  const translatedText = data.responseData?.translatedText?.trim();

  if (!translatedText) {
    throw new Error("EMPTY_TRANSLATION");
  }

  return translatedText;
}

function getTranslationStatus(failureCount: number): TranslationJobStatus {
  if (failureCount === 0) {
    return "SUCCESS";
  }

  if (failureCount === TARGET_LOCALES.length) {
    return "FULL_FALLBACK";
  }

  return "PARTIAL_FALLBACK";
}

export async function translateText(
  text: string,
  sourceLang: SupportedLocale = SOURCE_LOCALE
): Promise<TranslationResult> {
  const result = await translateTextWithMeta(text, sourceLang);
  return result.translations;
}

export async function translateArray(
  items: string[],
  sourceLang: SupportedLocale = SOURCE_LOCALE
): Promise<TranslationArrayResult> {
  const result = await translateArrayWithMeta(items, sourceLang);
  return result.translations;
}

export async function translateTextWithMeta(
  text: string,
  sourceLang: SupportedLocale = SOURCE_LOCALE
): Promise<{ translations: TranslationResult; meta: TranslationMeta }> {
  const normalizedSource = text.trim();
  const translations: TranslationResult = {
    pt: sourceLang === "pt" ? normalizedSource : normalizedSource,
    en: normalizedSource,
    es: normalizedSource,
    sv: normalizedSource,
  };
  const failures: TranslationFailure[] = [];

  for (const targetLang of TARGET_LOCALES) {
    try {
      translations[targetLang] = await requestTranslation(normalizedSource, sourceLang, targetLang);
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      const reason = error instanceof Error ? error.message : "UNKNOWN_TRANSLATION_ERROR";
      console.error(`Translation fallback for ${targetLang}:`, error);
      translations[targetLang] = normalizedSource;
      failures.push({ locale: targetLang, reason });
    }
  }

  return {
    translations,
    meta: {
      provider: TRANSLATION_PROVIDER,
      status: getTranslationStatus(failures.length),
      failures,
      sourceLocale: sourceLang,
    },
  };
}

export async function translateArrayWithMeta(
  items: string[],
  sourceLang: SupportedLocale = SOURCE_LOCALE
): Promise<{ translations: TranslationArrayResult; meta: TranslationMeta }> {
  const translations: TranslationArrayResult = {
    pt: [],
    en: [],
    es: [],
    sv: [],
  };
  const failures: TranslationFailure[] = [];

  for (const item of items) {
    const normalizedItem = item.trim();
    const translated = await translateTextWithMeta(normalizedItem, sourceLang);

    for (const locale of ALL_LOCALES) {
      translations[locale].push(translated.translations[locale]);
    }

    failures.push(...translated.meta.failures);
  }

  return {
    translations,
    meta: {
      provider: TRANSLATION_PROVIDER,
      status: getTranslationStatus(failures.length),
      failures,
      sourceLocale: sourceLang,
    },
  };
}

export async function logTranslationJob(input: {
  tripId?: string;
  operation: TranslationOperation;
  sourceLocale?: SupportedLocale;
  parts: Array<{
    field: string;
    provider: string;
    status: TranslationJobStatus;
    failures: TranslationFailure[];
  }>;
}) {
  const aggregatedFailures = input.parts.flatMap((part) =>
    part.failures.map((failure) => ({
      field: part.field,
      locale: failure.locale,
      reason: failure.reason,
    }))
  );

  const hasSuccess = input.parts.some((part) => part.status === "SUCCESS");
  const hasFallback = input.parts.some((part) => part.status !== "SUCCESS");
  const status: TranslationJobStatus = hasFallback
    ? hasSuccess
      ? "PARTIAL_FALLBACK"
      : "FULL_FALLBACK"
    : "SUCCESS";

  return prisma.translationJobLog.create({
    data: {
      tripId: input.tripId,
      entityType: "TRIP",
      operation: input.operation,
      provider: input.parts[0]?.provider ?? TRANSLATION_PROVIDER,
      status,
      sourceLocale: input.sourceLocale ?? SOURCE_LOCALE,
      metadata: {
        parts: input.parts,
        failures: aggregatedFailures,
        failureCount: aggregatedFailures.length,
      },
    },
  });
}
