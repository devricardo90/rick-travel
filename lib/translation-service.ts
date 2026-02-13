/**
 * Translation Service using Google Translate (free tier via unofficial API)
 * Alternative: Can use oficial Google Cloud Translation API ou DeepL com API key
 */

type SupportedLocale = 'pt' | 'en' | 'es' | 'sv';

interface TranslationResult {
    [key: string]: string;
}

/**
 * Translates text from Portuguese to all supported languages
 * Uses free translation service - for production, consider paid API
 */
export async function translateText(
    text: string,
    sourceLang: SupportedLocale = 'pt'
): Promise<TranslationResult> {
    const targetLanguages: SupportedLocale[] = ['en', 'es', 'sv'];
    const translations: TranslationResult = {
        [sourceLang]: text, // Original text
    };

    // Simple translation using a free service (MyMemory Translation API)
    // Limit: 5000 chars per day per IP (free tier)
    for (const targetLang of targetLanguages) {
        try {
            const encodedText = encodeURIComponent(text);
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`
            );

            if (!response.ok) {
                console.error(`Translation failed for ${targetLang}`);
                translations[targetLang] = text; // Fallback to original
                continue;
            }

            const data = await response.json();
            translations[targetLang] = data.responseData.translatedText || text;

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Error translating to ${targetLang}:`, error);
            translations[targetLang] = text; // Fallback to original
        }
    }

    return translations;
}

/**
 * Translates an array of strings
 */
export async function translateArray(
    items: string[],
    sourceLang: SupportedLocale = 'pt'
): Promise<Record<SupportedLocale, string[]>> {
    const targetLanguages: SupportedLocale[] = ['pt', 'en', 'es', 'sv'];
    const result: Record<string, string[]> = {};

    // Initialize with empty arrays
    targetLanguages.forEach(lang => {
        result[lang] = [];
    });

    // Translate each item
    for (const item of items) {
        const translations = await translateText(item, sourceLang);

        targetLanguages.forEach(lang => {
            result[lang].push(translations[lang]);
        });
    }

    return result as Record<SupportedLocale, string[]>;
}

/**
 * Gets localized value from a multilingual field
 */
export function getLocalizedField<T = string>(
    field: T | Record<string, T> | null | undefined,
    locale: string,
    fallbackLocale: string = 'pt'
): T {
    // Handle null/undefined
    if (!field) {
        return (typeof field === 'string' ? '' : (Array.isArray(field) ? [] : '')) as T;
    }

    // If it's already a simple value (backward compatibility)
    if (typeof field === 'string' || Array.isArray(field)) {
        return field as T;
    }

    // If it's an object (multilingual JSON)
    if (typeof field === 'object') {
        const localizedValue = (field as Record<string, T>)[locale];
        if (localizedValue !== undefined && localizedValue !== null) {
            return localizedValue;
        }

        // Fallback to default locale
        const fallbackValue = (field as Record<string, T>)[fallbackLocale];
        if (fallbackValue !== undefined && fallbackValue !== null) {
            return fallbackValue;
        }
    }

    // Ultimate fallback
    return (typeof field === 'string' ? '' : (Array.isArray(field) ? [] : '')) as T;
}
