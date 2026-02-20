'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'

export function AboutHero() {
    const t = useTranslations('AboutPage.hero')

    return (
        <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] w-full overflow-hidden">
            {/* Background Image - placeholder para imagem do usuário */}
            <Image
                src="/images/about/hero-team.jpg"
                alt={t('imageAlt')}
                fill
                className="object-cover"
                priority
                sizes="100vw"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

            {/* Content Centered */}
            <div className="relative z-10 h-full flex items-center justify-center px-6">
                <div className="max-w-4xl text-center space-y-6 md:space-y-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                        {t('title')}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-3xl mx-auto">
                        {t('subtitle')}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 min-w-[200px] rounded-full pl-5 pr-3 text-base shadow-lg btn-hover-lift bg-primary hover:bg-primary/90"
                        >
                            <Link href="/tours">
                                <span>{t('cta1')}</span>
                                <ChevronRight className="ml-1" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-12 min-w-[200px] rounded-full pl-5 pr-3 text-base border-2 border-white text-white hover:bg-white/10 shadow-lg btn-hover-lift"
                        >
                            <Link href="/contato">
                                <span>{t('cta2')}</span>
                                <ChevronRight className="ml-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
