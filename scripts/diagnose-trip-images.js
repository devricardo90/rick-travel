const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnoseTripImages() {
    console.log('🔍 Diagnosticando imageUrls no banco de dados...\n');

    const trips = await prisma.trip.findMany({
        select: { id: true, title: true, imageUrl: true, city: true }
    });

    console.log(`📊 Total de trips encontradas: ${trips.length}\n`);

    let hasIssues = false;

    for (const trip of trips) {
        // Extrair título do JSON multilíngue
        let displayTitle = 'Sem título';
        if (typeof trip.title === 'string') {
            displayTitle = trip.title;
        } else if (trip.title && typeof trip.title === 'object') {
            displayTitle = trip.title.pt || trip.title.en || JSON.stringify(trip.title).substring(0, 50);
        }

        console.log(`\n📌 ${displayTitle} (${trip.city})`);
        console.log(`   ID: ${trip.id}`);
        console.log(`   ImageUrl: "${trip.imageUrl || 'NULL'}"`);

        // Verificar problemas
        if (!trip.imageUrl) {
            console.log(`   ⚠️  PROBLEMA: Campo imageUrl está NULL`);
            hasIssues = true;
        } else if (!trip.imageUrl.includes('.')) {
            console.log(`   🔴 ERRO CRÍTICO: Caminho incompleto! Falta extensão (.jpg, .png, etc)`);
            hasIssues = true;
        } else if (trip.imageUrl.startsWith('public/')) {
            console.log(`   ⚠️  PROBLEMA: Caminho inclui 'public/' (deve começar com /images/)`);
            hasIssues = true;
        } else if (!trip.imageUrl.startsWith('/')) {
            console.log(`   ⚠️  PROBLEMA: Caminho relativo (deve começar com /)`);
            hasIssues = true;
        } else {
            console.log(`   ✅ OK`);
        }
    }

    console.log('\n' + '='.repeat(60));
    if (hasIssues) {
        console.log('❌ Foram encontrados problemas nos caminhos de imagem!');
        console.log('💡 Execute o script fix-image-paths.js para corrigir.');
    } else {
        console.log('✅ Todos os caminhos de imagem estão corretos!');
    }

    await prisma.$disconnect();
}

diagnoseTripImages().catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
});
