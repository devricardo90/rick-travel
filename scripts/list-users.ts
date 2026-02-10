
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log('--- Usuários Encontrados ---')
    if (users.length === 0) {
        console.log('Nenhum usuário encontrado no banco de dados.')
    } else {
        users.forEach((u) => {
            console.log(`ID: ${u.id} | Nome: ${u.name} | Email: ${u.email} | Role: ${u.role}`)
        })
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
