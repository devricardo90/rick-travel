'use client'

import { useTranslations } from 'next-intl';

interface ReservationHeadersProps {
    children: React.ReactNode;
}

export function ReservationHeaders({ children }: ReservationHeadersProps) {
    const t = useTranslations('HomePage.Reservations');

    return (
        <section id="reservas" className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-[-0.02em] text-white">{t('title')}</h2>
                <p className="mt-3 text-white/65">
                    {t('subtitle')}
                </p>
            </div>

            {children}
        </section>
    );
}
