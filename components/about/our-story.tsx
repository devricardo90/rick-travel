'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function OurStory() {
    const t = useTranslations('AboutPage.story')

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-12 md:grid-cols-5 md:gap-16 items-center">

                    {/* Imagem - 40% width desktop */}
                    <div className="md:col-span-2">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-soft">
                            <Image
                                src="/images/about/founder-team.jpg"
                                alt={t('imageAlt')}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            {/* Overlay sutil para dar profundidade */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/30 via-transparent to-transparent" />
                        </div>
                    </div>

                    {/* Texto - 60% width desktop */}
                    <div className="md:col-span-3 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white">
                            {t('title')}
                        </h2>

                        <div className="space-y-4 max-w-[62ch] text-white/75 leading-relaxed text-base md:text-lg">
                            <p>{t('paragraph1')}</p>
                            <p>{t('paragraph2')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
