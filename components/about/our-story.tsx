'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function OurStory() {
    const t = useTranslations('AboutPage.story')

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-background">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-12 md:grid-cols-5 md:gap-16 items-center">
                    {/* Imagem - 40% width desktop */}
                    <div className="md:col-span-2">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <Image
                                src="/images/about/founder-team.jpg"
                                alt={t('imageAlt')}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                    </div>

                    {/* Texto - 60% width desktop */}
                    <div className="md:col-span-3 space-y-5">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{t('title')}</h2>

                        <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                            <p>{t('paragraph1')}</p>
                            <p>{t('paragraph2')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
