'use client'

import { useTranslations } from 'next-intl';

export function ToursHeader() {
    const t = useTranslations('ToursPage');

    return (
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">{t('title')}</h1>
            <p className="mt-4 text-muted-foreground text-lg">
                {t('subtitle')}
            </p>
        </div>
    );
}
