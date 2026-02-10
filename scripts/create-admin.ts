

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = "ricardosouza@gmail.com";
  const password = "12345678";
  const name = "Ricardo Souza";

  console.log(` Tentando criar (ou atualizar) usuário ${email}...`);

  // 1. Tentar criar usuário via API do app (que lida com o hash da senha)
  // O app precisa estar rodando em localhost:3000
  try {
    console.log("-> Chamando API de cadastro (http://localhost:3000/api/auth/sign-up)...");
    const res = await fetch("http://localhost:3000/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (res.ok) {
      console.log("-> Usuário criado via API com sucesso!");
    } else {
      const err = await res.text();
      // Ignorar erro se for "usuário já existe", pois queremos promover mesmo assim
      console.log("-> Resposta da API:", err);
    }
  } catch (e) {
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
    // console.log(` Pode fazer login com: ${email} / ${password}`);
  } catch (e: any) {
    console.error("Erro ao atualizar banco:", e.message);
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
