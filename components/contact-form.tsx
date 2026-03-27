"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react"
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
                toast.success("Mensagem enviada com sucesso!", {
                    description: result.message || "Entraremos em contato em breve",
                })
                reset()
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
        <div className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] md:p-7">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d8c18f]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Contato seguro
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{tPage('title')}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">
                        {tPage('subtitle')}
                    </p>
                </div>
            </div>

            {showSuccess && (
                <div className="fade-in mt-5 flex items-center gap-3 rounded-[20px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">Mensagem enviada! Nossa equipe entrará em contato em breve.</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm text-white/78">{t('name')}</Label>
                        <Input
                            id="name"
                            placeholder={t('namePlaceholder')}
                            {...register("name")}
                            className={`h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-white/40 focus-visible:ring-white/20 ${errors.name ? "border-red-400/40" : ""}`}
                        />
                        {errors.name && (
                            <p className="fade-in text-sm text-red-300">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm text-white/78">{t('email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            {...register("email")}
                            className={`h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-white/40 focus-visible:ring-white/20 ${errors.email ? "border-red-400/40" : ""}`}
                        />
                        {errors.email && (
                            <p className="fade-in text-sm text-red-300">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-sm text-white/78">{t('phone')}</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        {...register("phone")}
                        className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="message" className="text-sm text-white/78">{t('message')}</Label>
                    <Textarea
                        id="message"
                        placeholder={t('messagePlaceholder')}
                        {...register("message")}
                        className={`min-h-[160px] rounded-2xl border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/40 focus-visible:ring-white/20 ${errors.message ? "border-red-400/40" : ""}`}
                    />
                    {errors.message && (
                        <p className="fade-in text-sm text-red-300">{errors.message.message}</p>
                    )}
                </div>

                <div className="rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm leading-7 text-white/58">
                    Use este formulário para pedir orçamento, validar disponibilidade ou explicar o perfil da sua viagem. Quanto mais contexto você enviar, melhor o time consegue orientar.
                </div>

                <Button type="submit" className="h-12 w-full rounded-2xl button-press" disabled={isSubmitting}>
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
