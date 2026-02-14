import { prisma } from '../lib/prisma';

async function checkImagePaths() {
    console.log('🔍 Verificando imageUrls no banco...\n');

    const trips = await prisma.trip.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true,
            city: true
        }
    });

    console.log(`Total: ${trips.length} trips\n`);

    for (const trip of trips) {
        let title = 'Sem título';
        if (typeof trip.title === 'string') {
            title = trip.title;
        } else if (trip.title && typeof trip.title === 'object') {
            const titleObj: any = trip.title;
            title = titleObj.pt || titleObj.en || 'N/A';
        }

        console.log(`\n📍 ${title} - ${trip.city}`);
        console.log(`   ImageUrl: "${trip.imageUrl || 'NULL'}"`);

        if (!trip.imageUrl) {
            console.log(`   ⚠️  NULL`);
        } else if (!trip.imageUrl.includes('.')) {
            console.log(`   🔴 ERRO: Sem extensão de arquivo!`);
        } else {
            console.log(`   ✅ OK`);
        }
    }

    await prisma.$disconnect();
}

checkImagePaths().catch(console.error);
