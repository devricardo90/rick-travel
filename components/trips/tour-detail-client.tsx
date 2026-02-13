'use client'

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR, enUS, es, sv, Locale } from "date-fns/locale";
import { Calendar, MapPin, Users, Clock, CheckCircle2, ChevronLeft } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';

import { Button } from "@/components/ui/button";
import { TourActions } from "@/components/trips/tour-actions";
import { getLocalizedField } from "@/lib/translation-service";

interface Trip {
    id: string;
    title: any; // JSON multilingual
    description: any | null; // JSON multilingual
    imageUrl: string | null;
    city: string;
    location: string | null;
    maxGuests: number | null;
    priceCents: number;
    highlights: any; // JSON multilingual array
}

interface TourDetailClientProps {
    trip: Trip;
    startDate: Date | null;
    endDate: Date | null;
}

export function TourDetailClient({ trip, startDate, endDate }: TourDetailClientProps) {
    const t = useTranslations('TourDetailPage');
    const locale = useLocale();

    // Map locale to date-fns locale
    const dateLocaleMap: Record<string, Locale> = {
        pt: ptBR,
        en: enUS,
        es: es,
        sv: sv
    };
    const dateLocale = dateLocaleMap[locale] || ptBR;

    // Get localized content
    const localizedTitle = getLocalizedField<string>(trip.title, locale);
    const localizedDescription = getLocalizedField<string>(trip.description, locale);
    const localizedHighlights = getLocalizedField<string[]>(trip.highlights, locale) || [];

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8">
                <Link href="/tours">
                    <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t('backToTours')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{localizedTitle}</h1>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                            {trip.location && (
                                <div className="flex items-center">
                                    <MapPin className="mr-1.5 h-4 w-4" />
                                    {trip.location}
                                </div>
                            )}
                            {startDate && (
                                <div className="flex items-center">
                                    <Calendar className="mr-1.5 h-4 w-4" />
                                    {format(startDate, "dd 'de' MMMM", { locale: dateLocale })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                        {trip.imageUrl ? (
                            <Image
                                src={trip.imageUrl}
                                alt={localizedTitle}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                {t('noImage')}
                            </div>
                        )}
                        <div className="absolute top-4 right-4 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-black shadow-sm backdrop-blur-md">
                            {trip.city}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">{t('aboutTour')}</h2>
                            <div className="mt-4 prose max-w-none text-muted-foreground">
                                <p>{localizedDescription || t('noDescription')}</p>
                            </div>
                        </div>

                        {localizedHighlights && localizedHighlights.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4">{t('highlights')}</h3>
                                <ul className="grid gap-3 sm:grid-cols-2">
                                    {localizedHighlights.map((highlight, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <TourActions tripId={trip.id} priceCents={trip.priceCents} />

                    <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{t('information')}</h3>
                        <div className="space-y-3">
                            {trip.maxGuests && (
                                <div className="flex items-center text-sm">
                                    <Users className="mr-3 h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{t('group')}</p>
                                        <p className="text-muted-foreground">{t('maxGuests', { count: trip.maxGuests })}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center text-sm">
                                <Clock className="mr-3 h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">{t('duration')}</p>
                                    <p className="text-muted-foreground">{t('durationTime')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
                        <h3 className="font-semibold text-blue-900 mb-2">{t('needHelp')}</h3>
                        <p className="text-sm text-blue-700 mb-4">
                            {t('needHelpText')}
                        </p>
                        <Link href="/contato">
                            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 ">
                                {t('contactUs')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
