'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export function CtaFinal() {
    const t = useTranslations('AboutPage.ctaFinal')

    return (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            {/* Background Image sutil */}
            <Image
                src="/images/about/cta-rio-background.jpg"
                alt=""
                fill
                className="object-cover opacity-30"
                sizes="100vw"
            />

            {/* Overlay Gradient Azul */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center px-6">
                <div className="max-w-3xl text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        {t('title')}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90">
                        {t('subtitle')}
                    </p>

                    {/* CTA Button - Verde Accent */}
                    <Button
                        asChild
                        size="lg"
                        className="h-14 px-8 text-lg rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <Link href="/tours">
                            <span>{t('button')}</span>
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
