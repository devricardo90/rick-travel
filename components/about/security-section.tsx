'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ShieldCheck, Car, Clock, CheckCircle2 } from 'lucide-react'

export function SecuritySection() {
    const t = useTranslations('AboutPage.security')

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">

                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white mb-3">
                        {t('title')}
                    </h2>
                    <p className="text-white/60 text-base max-w-xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* 2 Cards: Certificação + Guia */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">

                    {/* Card Esquerda: Certificação Cadastur */}
                    <div className="card-dark p-8">
                        {/* Logo Cadastur */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-28 h-28 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Image
                                    src="/images/seals/cadastur-official.png"
                                    alt="Selo Cadastur"
                                    width={90}
                                    height={90}
                                    className="object-contain opacity-90"
                                />
                            </div>
                        </div>

                        {/* Texto */}
                        <div className="text-center space-y-2">
                            <p className="text-sm font-medium text-white/80">
                                {t('certification.registered')}
                            </p>
                            <p className="text-base font-semibold text-emerald-400/90">
                                Cadastur nº {t('certification.cadasturNumber')}
                            </p>

                            <div className="pt-4 space-y-2 text-xs text-white/60">
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400/80 flex-shrink-0" />
                                    <span>{t('certification.activeStatus')}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400/80 flex-shrink-0" />
                                    <span>{t('certification.federalCompliance')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Direita: Guia Credenciado */}
                    <div className="card-dark p-8">
                        {/* Foto do Guia */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/10">
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
                            <h3 className="text-xl font-bold text-white">{t('guide.name')}</h3>
                            <p className="text-sm font-medium text-emerald-400/80">{t('guide.title')}</p>
                            <p className="text-xs text-white/50">{t('guide.subtitle')}</p>

                            <div className="pt-4 space-y-1 text-xs">
                                <p className="font-semibold text-white/80">
                                    Cadastur nº {t('guide.cadasturNumber')}
                                </p>
                                <p className="text-white/50">{t('guide.credential')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid 3 Ícones: Padrões Operacionais */}
                <div className="card-dark p-8 md:p-10">
                    <h3 className="text-lg font-semibold text-center mb-10 text-white">
                        {t('operational.title')}
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Veículos */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="icon-chip-dark">
                                    <Car className="h-6 w-6 text-white/80" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-1">
                                    {t('operational.vehicles.title')}
                                </h4>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    {t('operational.vehicles.description')}
                                </p>
                            </div>
                        </div>

                        {/* Seguro */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="icon-chip-dark">
                                    <ShieldCheck className="h-6 w-6 text-emerald-400/80" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-1">
                                    {t('operational.insurance.title')}
                                </h4>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    {t('operational.insurance.description')}
                                </p>
                            </div>
                        </div>

                        {/* Pontualidade */}
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="icon-chip-dark">
                                    <Clock className="h-6 w-6 text-white/80" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-1">
                                    {t('operational.support.title')}
                                </h4>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    {t('operational.support.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
