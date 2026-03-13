'use client'

import { MyBookings } from "@/components/my-bookings";
import { useTranslations } from 'next-intl';

export default function ReservasPage() {
  const t = useTranslations('BookingsPage');

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>
      <MyBookings />
    </main>
  );
}
