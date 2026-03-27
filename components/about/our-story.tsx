'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function OurStory() {
    const t = useTranslations('AboutPage.story')

    return (
        <section className="section-spacing-sm">
            <div className="mx-auto max-w-7xl px-5 lg:px-12">
                <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                    <div className="overflow-hidden rounded-[30px] border border-white/8 bg-[#0d2436] shadow-[0_22px_70px_rgba(0,0,0,0.24)]">
                        <div className="relative aspect-[1.1] overflow-hidden md:aspect-[1.2]">
                            <Image
                                src="/images/about/founder-team.jpg"
                                alt={t('imageAlt')}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 42vw"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08),rgba(0,0,0,0.5))]" />
                        </div>
                    </div>

                    <div className="surface-dark-solid p-6 md:p-8">
                        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                            Nossa história
                        </div>

                        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                            {t('title')}
                        </h2>

                        <div className="mt-5 max-w-[64ch] space-y-4 text-[15px] leading-8 text-white/68 md:text-base">
                            <p>{t('paragraph1')}</p>
                            <p>{t('paragraph2')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
