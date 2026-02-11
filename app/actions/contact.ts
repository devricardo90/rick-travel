'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const contactSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

export type ContactState = {
    success?: boolean
    message?: string
    errors?: {
        name?: string[]
        email?: string[]
        phone?: string[]
        message?: string[]
    }
}

export async function submitContactForm(prevState: ContactState, formData: FormData): Promise<ContactState> {
    // Add artificial delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
        const rawData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: (formData.get('phone') as string) || undefined,
            message: formData.get('message') as string,
        }

        const validatedData = contactSchema.parse(rawData)

        await prisma.contactSubmission.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone || null,
                message: validatedData.message,
            },
        })

        // TODO: Send email notification

        return { success: true, message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, errors: error.flatten().fieldErrors }
        }
        console.error('Contact form error:', error)

        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        return { success: false, message: `Erro ao enviar: ${errorMessage}` }
    }
}
