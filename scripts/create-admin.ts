
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
})

async function createAdmin() {
  const email = "rick@gmail.com";
  const password = "58547866";
  const name = "Rick Admin";

  console.log(`\n🚀 Iniciando processo para o usuário: ${email}`);

  // 1. Tentar criar usuário via API do app (que lida com o hash da senha)
  // O app precisa estar rodando em localhost:3000
  try {
    console.log("-> Chamando API de cadastro (http://localhost:3000/api/auth/signup)...");
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    console.log(`-> Status da API: ${res.status} ${res.statusText}`);
    const data = await res.text();
    if (data) console.log("-> Resposta da API:", data);
  } catch {
    console.log("-> ALERTA: Não foi possível conectar na API local.");
    console.log("   Certifique-se de que o servidor está rodando (npm run dev).");
    console.log("   Se o usuário não existir, o próximo passo falhará.");
  }

  // 2. Atualizar role no banco
  console.log("\n Promovendo para ADMIN...");
  try {
    // Tenta encontrar o usuário primeiro para garantir
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error("ERRO: Usuário não encontrado no banco. Não foi possível criar via API.");
      return;
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(` SUCESSO! Usuário ${updated.email} agora é ADMIN.`);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Erro ao atualizar banco:", e.message);
    }
  }
}

createAdmin()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
