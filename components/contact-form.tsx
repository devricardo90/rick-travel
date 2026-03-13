"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useTranslations } from 'next-intl'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitContactForm } from "@/app/actions/contact"


export function ContactForm() {
    const t = useTranslations('ContactPage.form');
    const tPage = useTranslations('ContactPage');

    const contactSchema = z.object({
        name: z.string().min(2, t('nameError')),
        email: z.string().email(t('emailError')),
        phone: z.string().optional(),
        message: z.string().min(10, t('messageError')),
    })

    type ContactFormData = z.infer<typeof contactSchema>
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

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
        setShowSuccess(false)

        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("email", data.email)
        if (data.phone) formData.append("phone", data.phone)
        formData.append("message", data.message)

        try {
            const result = await submitContactForm({}, formData)

            if (result.success) {
                setShowSuccess(true)
                toast.success("Mensagem enviada com sucesso! 🎉", {
                    description: result.message || "Entraremos em contato em breve",
                })
                reset()

                // Esconder animação de sucesso após 3 segundos
                setTimeout(() => setShowSuccess(false), 3000)
            } else {
                toast.error("Erro ao enviar mensagem", {
                    description: result.message || t('errorSubmit'),
                })
            }
        } catch {
            toast.error("Erro ao enviar", {
                description: t('errorGeneric'),
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="grid gap-2 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white">{tPage('title')}</h2>
                <p className="text-balance text-white/70">
                    {tPage('subtitle')}
                </p>
            </div>

            {showSuccess && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/30 p-4 text-green-700 dark:text-green-400 fade-in">
                    <CheckCircle2 className="h-5 w-5 animate-bounce" />
                    <p className="font-medium">Mensagem enviada!</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <Input
                        id="name"
                        placeholder={t('namePlaceholder')}
                        {...register("name")}
                        className={`transition-all duration-200 ${errors.name ? "border-red-500 dark:border-red-700 shake" : ""}`}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 dark:text-red-400 fade-in">{errors.name.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        {...register("email")}
                        className={`transition-all duration-200 ${errors.email ? "border-red-500 dark:border-red-700 shake" : ""}`}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500 dark:text-red-400 fade-in">{errors.email.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        {...register("phone")}
                        className="transition-all duration-200"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="message">{t('message')}</Label>
                    <Textarea
                        id="message"
                        placeholder={t('messagePlaceholder')}
                        {...register("message")}
                        className={`transition-all duration-200 ${errors.message ? "border-red-500 dark:border-red-700 shake" : ""}`}
                    />
                    {errors.message && (
                        <p className="text-sm text-red-500 dark:text-red-400 fade-in">{errors.message.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full button-press" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('sending')}
                        </>
                    ) : (
                        t('submit')
                    )}
                </Button>
            </form>
        </div>
    )
}
