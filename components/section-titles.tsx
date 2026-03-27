'use client'

import { useTranslations } from 'next-intl';

interface SectionTitlesProps {
    section: 'myBookings' | 'availableTrips';
}

export function SectionTitles({ section }: SectionTitlesProps) {
    const t = useTranslations('HomePage.Reservations');

    return (
        <h3 className="mb-5 text-xl font-semibold tracking-[-0.03em] text-white md:text-2xl">
            {t(section)}
        </h3>
    );
}
