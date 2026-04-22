
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        console.error("DATABASE_URL not found in env")
        process.exit(1)
    }

    console.log('Testing DB connection...')

    const adapter = new PrismaPg({ connectionString })
    const prisma = new PrismaClient({ adapter })

    try {
        await prisma.$queryRaw`SELECT 1`
        console.log('Database connection OK')
    } catch (e) {
        console.error('Database connection failed')
        console.error(e)
        process.exitCode = 1
    } finally {
        await prisma.$disconnect()
    }
}

main()
