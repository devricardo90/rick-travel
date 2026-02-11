"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitContactForm } from "@/app/actions/contact"

const contactSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
    message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })

    async function onSubmit(data: ContactFormData) {
        setIsSubmitting(true)
        setSubmitResult(null)

        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("email", data.email)
        if (data.phone) formData.append("phone", data.phone)
        formData.append("message", data.message)

        try {
            // Initial state is not used in the action logic but required by signature if using useFormState, 
            // here we call it directly so we pass null or empty state
            const result = await submitContactForm({}, formData)

            if (result.success) {
                setSubmitResult({ success: true, message: result.message! })
                reset()
            } else {
                setSubmitResult({ success: false, message: result.message || "Erro ao enviar mensagem." })
                // If there are field errors from server, we could set them here using setError
            }
        } catch (error) {
            setSubmitResult({ success: false, message: "Erro inesperado. Tente novamente." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="grid gap-2 text-center">
                <h2 className="text-3xl font-bold">Entre em contato</h2>
                <p className="text-balance text-muted-foreground">
                    Preencha o formulário abaixo para enviar uma mensagem para nossa equipe.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        placeholder="Seu nome completo"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone (Opcional)</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="(21) 99999-9999"
                        {...register("phone")}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                        id="message"
                        placeholder="Diga como podemos ajudar..."
                        {...register("message")}
                        className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                        <p className="text-sm text-red-500">{errors.message.message}</p>
                    )}
                </div>

                {submitResult && (
                    <div
                        className={`rounded-md p-3 text-sm ${submitResult.success
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                                : "bg-red-100 text-red-600 dark:bg-red-900/30"
                            }`}
                    >
                        {submitResult.message}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        "Enviar Mensagem"
                    )}
                </Button>
            </form>
        </div>
    )
}
