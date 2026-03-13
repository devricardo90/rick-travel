
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const titlesToDelete = [
    'Tour centro do Rio',
    'Morro da Urca',
    'Passeio Confeitaria Colombo'
  ];

  console.log('--- Iniciando limpeza de dados ---');

  for (const title of titlesToDelete) {
    // Como o título é JSON, buscamos por correspondência no campo 'pt'
    const trips = await prisma.trip.findMany({
      where: {
        title: {
          path: ['pt'],
          equals: title
        }
      }
    });

    if (trips.length > 0) {
      for (const trip of trips) {
        console.log(`Encontrado: "${title}" (ID: ${trip.id}). Excluindo...`);
        // Primeiro removemos agendamentos e reservas se houver integridade
        await prisma.booking.deleteMany({ where: { tripId: trip.id } });
        await prisma.tripSchedule.deleteMany({ where: { tripId: trip.id } });
        await prisma.trip.delete({ where: { id: trip.id } });
        console.log(`Excluído com sucesso.`);
      }
    } else {
      console.log(`Passeio "${title}" não encontrado.`);
    }
  }

  console.log('--- Limpeza concluída ---');
}

main()
  .catch((e) => {
    console.error('Erro durante a limpeza:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
