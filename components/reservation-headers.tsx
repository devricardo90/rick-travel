'use client'

import { useTranslations } from 'next-intl';

interface ReservationHeadersProps {
    children: React.ReactNode;
}

export function ReservationHeaders({ children }: ReservationHeadersProps) {
    const t = useTranslations('HomePage.Reservations');

    return (
        <section id="reservas" className="mx-auto max-w-7xl px-5 py-18 lg:px-12 lg:py-24">
            <div className="mx-auto mb-12 max-w-3xl text-center">
                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                    Reservas e planejamento
                </div>
                <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">{t('title')}</h2>
                <p className="mt-4 text-[15px] leading-7 text-white/64 md:text-base">
                    {t('subtitle')}
                </p>
            </div>

            {children}
        </section>
    );
}
