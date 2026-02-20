'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

const benefits = [
    { id: 'personalized', icon: 'personalized.svg' },
    { id: 'certified', icon: 'certified.svg' },
    { id: 'security', icon: 'security.svg' },
    { id: 'local', icon: 'local.svg' },
    { id: 'multilingual', icon: 'multilingual.svg' },
    { id: 'optimized', icon: 'optimized.svg' },
]

export function WhyChooseUs() {
    const t = useTranslations('AboutPage.whyChoose')

    return (
        <section className="section-spacing bg-zinc-50 dark:bg-zinc-900/50">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <h2 className="heading-2 mb-4">{t('title')}</h2>
                    <p className="body-lg text-muted-foreground">{t('subtitle')}</p>
                </div>

                {/* Grid 3x2 (desktop) / 1 coluna (mobile) */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.id}
                            className="group bg-white dark:bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover"
                        >
                            {/* Ícone SVG - placeholder */}
                            <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Image
                                    src={`/icons/benefits/${benefit.icon}`}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                            </div>

                            <h3 className="heading-4 mb-2">{t(`${benefit.id}.title`)}</h3>
                            <p className="body-sm text-muted-foreground">
                                {t(`${benefit.id}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
