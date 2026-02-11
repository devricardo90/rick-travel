
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

async function main() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        console.error("DATABASE_URL not found in env")
        process.exit(1)
    }

    console.log('Testing DB connection with adapter...')

    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
        const submission = await prisma.contactSubmission.create({
            data: {
                name: 'Test Script',
                email: 'test-script@example.com',
                message: 'Test message from script with adapter',
            },
        })
        console.log('Successfully created submission:', submission)
    } catch (e) {
        console.error('Error creating submission:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
