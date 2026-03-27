'use client'

import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ToursHeader() {
    const t = useTranslations('ToursPage');

    return (
        <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Experiencias guiadas com operação credenciada
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl lg:text-6xl">
                {t('title')}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-balance text-[15px] leading-7 text-white/68 md:text-lg md:leading-8">
                {t('subtitle')}
            </p>

            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
                <div className="chip-dark">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Compare por perfil, preço e duração
                </div>
                <div className="chip-dark">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Reserve com suporte humano e operação local
                </div>
            </div>
        </div>
    );
}
