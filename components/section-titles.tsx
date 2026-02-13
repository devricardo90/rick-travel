'use client'

import { useTranslations } from 'next-intl';

interface SectionTitlesProps {
    section: 'myBookings' | 'availableTrips';
}

export function SectionTitles({ section }: SectionTitlesProps) {
    const t = useTranslations('HomePage.Reservations');

    return (
        <h3 className="mb-4 text-xl font-semibold">
            {t(section)}
        </h3>
    );
}
