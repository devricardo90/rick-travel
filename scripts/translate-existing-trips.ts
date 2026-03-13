/**
 * Simpler script to translate existing trips
 * Run with: npm run translate-trips (add to package.json scripts)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple fetch-based translation
async function translateText(text: string, targetLang: string): Promise<string> {
    try {
        const encodedText = encodeURIComponent(text);
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=pt|${targetLang}`
        );

        if (!response.ok) return text;

        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch {
        return text;
    }
}

async function main() {
    console.log('🌍 Starting translation of existing trips...\n');

    const trips = await prisma.trip.findMany();
    console.log(`Found ${trips.length} trips\n`);

    for (const trip of trips) {
        try {
            // Check if already translated
            const titleData = trip.title as Record<string, string> | string | null;
            if (titleData && typeof titleData === 'object' && titleData.en) {
                console.log(`✅ "${(titleData as Record<string, string>).pt}" - Already translated, skipping`);
                continue;
            }

            const titlePT = typeof titleData === 'string' ? titleData : (titleData as Record<string, string>)?.pt || '';
            console.log(`\n📍 Translating: "${titlePT}"`);

            // Translate to EN, ES, SV
            const [en, es, sv] = await Promise.all([
                translateText(titlePT, 'en'),
                translateText(titlePT, 'es'),
                translateText(titlePT, 'sv'),
            ]);

            console.log(`  EN: ${en}`);
            console.log(`  ES: ${es}`);
            console.log(`  SV: ${sv}`);

            // Update with translations
            await prisma.trip.update({
                where: { id: trip.id },
                data: {
                    title: { pt: titlePT, en, es, sv },
                    // Keep description and highlights as-is for now
                },
            });

            console.log(`  ✅ Updated`);

            // Delay to avoid rate limit
            await new Promise(r => setTimeout(r, 500));
        } catch (error) {
            console.error(`  ❌ Error:`, error);
        }
    }

    console.log('\n✅ Translation complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
