'use client'

import { useTranslations } from 'next-intl';

export function ToursHeader() {
    const t = useTranslations('ToursPage');

    return (
        <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white">
                {t('title')}
            </h1>
            <p className="mt-4 text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                {t('subtitle')}
            </p>
        </div>
    );
}
