'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ShieldCheck, Car, Clock, CheckCircle2 } from 'lucide-react'

export function SecuritySection() {
    const t = useTranslations('AboutPage.security')

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('title')}</h2>
                    <p className="text-base text-muted-foreground">{t('subtitle')}</p>
                </div>

                {/* 2 Cards: Certificação + Guia */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {/* Card Esquerda: Certificação */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-border">
                        {/* Logo Cadastur */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-border">
                                <Image
                                    src="/images/seals/cadastur-official.png"
                                    alt="Selo Cadastur"
                                    width={100}
                                    height={100}
                                    className="object-contain opacity-90"
                                />
                            </div>
                        </div>

                        {/* Texto */}
                        <div className="text-center space-y-3">
                            <p className="text-sm font-medium text-foreground">
                                {t('certification.registered')}
                            </p>
                            <p className="text-lg font-bold text-primary">
                                Cadastur nº {t('certification.cadasturNumber')}
                            </p>

                            <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span>{t('certification.activeStatus')}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span>{t('certification.federalCompliance')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Direita: Guia Credenciado */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-border">
                        {/* Foto do Guia */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10">
                                <Image
                                    src="/images/about/guide-ricardo.jpg"
                                    alt={t('guide.imageAlt')}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Informações */}
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-foreground">{t('guide.name')}</h3>
                            <p className="text-sm font-medium text-primary">{t('guide.title')}</p>
                            <p className="text-xs text-muted-foreground">{t('guide.subtitle')}</p>

                            <div className="pt-4 space-y-1 text-xs">
                                <p className="font-semibold text-foreground">
                                    Cadastur nº {t('guide.cadasturNumber')}
                                </p>
                                <p className="text-muted-foreground">{t('guide.credential')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid 3 Ícones: Padrões Operacionais */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-border">
                    <h3 className="text-lg font-semibold text-center mb-8 text-foreground">
                        {t('operational.title')}
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Veículos */}
                        <div className="text-center space-y-3">
                            <div className="flex justify-center">
                                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                                    <Car className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">
                                {t('operational.vehicles.title')}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {t('operational.vehicles.description')}
                            </p>
                        </div>

                        {/* Seguro */}
                        <div className="text-center space-y-3">
                            <div className="flex justify-center">
                                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                                    <ShieldCheck className="h-7 w-7 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">
                                {t('operational.insurance.title')}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {t('operational.insurance.description')}
                            </p>
                        </div>

                        {/* Pontualidade */}
                        <div className="text-center space-y-3">
                            <div className="flex justify-center">
                                <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                                    <Clock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">
                                {t('operational.support.title')}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {t('operational.support.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
