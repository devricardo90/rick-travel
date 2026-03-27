'use client'

import { useEffect, useRef } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { format } from "date-fns";
import { ptBR, enUS, es, sv, Locale } from "date-fns/locale";
import { Calendar, MapPin, Users, Clock, CheckCircle2, ChevronLeft, ShieldCheck, BadgeCheck, MessageCircleMore } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';

import { trackClientEvent } from "@/lib/analytics/client";
import { Button } from "@/components/ui/button";
import { getLocalizedField } from "@/lib/localized-field";
import { TourActions } from "@/components/trips/tour-actions";
import { normalizeTripImage } from "@/lib/image-utils";
import { Link } from "@/i18n/routing";

interface Trip {
    id: string;
    title: Record<string, string> | string;
    description: Record<string, string> | string | null;
    imageUrl: string | null;
    city: string;
    location: string | null;
    maxGuests: number | null;
    priceCents: number;
    highlights: Record<string, string[]> | string[] | null;
}

interface TourDetailClientProps {
    trip: Trip;
    startDate: Date | null;
    schedules: Array<{
        id: string;
        startAt: string;
        endAt: string | null;
        capacity: number;
        pricePerPersonCents: number;
    }>;
}

function getReserveConfidenceCopy(locale: string) {
    switch (locale) {
        case "en":
            return {
                title: "Why book with Rick Travel",
                item1: "Licensed guide operation with support before your tour",
                item2: "Booking flow with clear payment confirmation and live status",
                item3: "If you prefer, our team can shape the itinerary with you on WhatsApp",
            };
        case "es":
            return {
                title: "Por que reservar con Rick Travel",
                item1: "Operacion con guia acreditado y soporte antes del tour",
                item2: "Reserva con confirmacion clara del pago y seguimiento del estado",
                item3: "Si prefieres, nuestro equipo puede montar el itinerario contigo por WhatsApp",
            };
        case "sv":
            return {
                title: "Varfor boka med Rick Travel",
                item1: "Certifierad guideverksamhet med support innan din tur",
                item2: "Bokning med tydlig betalningsbekraftelse och statusuppfoljning",
                item3: "Om du foredrar det kan vart team forma resplanen med dig via WhatsApp",
            };
        default:
            return {
                title: "Por que reservar com a Rick Travel",
                item1: "Operacao com guia credenciado e suporte antes do passeio",
                item2: "Reserva com confirmacao clara de pagamento e acompanhamento do status",
                item3: "Se preferir, nossa equipe monta um roteiro e tira duvidas pelo WhatsApp",
            };
    }
}

export function TourDetailClient({ trip, startDate, schedules }: TourDetailClientProps) {
    const t = useTranslations('TourDetailPage');
    const locale = useLocale();
    const hasTrackedViewRef = useRef(false);
    const reserveConfidence = getReserveConfidenceCopy(locale);

    const dateLocaleMap: Record<string, Locale> = {
        pt: ptBR,
        en: enUS,
        es: es,
        sv: sv
    };
    const dateLocale = dateLocaleMap[locale] || ptBR;

    const localizedTitle = getLocalizedField<string>(trip.title, locale);
    const localizedDescription = getLocalizedField<string>(trip.description, locale);
    const localizedHighlights = getLocalizedField<string[]>(trip.highlights, locale) || [];

    useEffect(() => {
        if (hasTrackedViewRef.current) {
            return;
        }

        hasTrackedViewRef.current = true;
        void trackClientEvent({
            type: "TOUR_VIEWED",
            tripId: trip.id,
            metadata: {
                locale,
                city: trip.city,
                hasSchedules: schedules.length > 0,
            },
        });
    }, [locale, schedules.length, trip.city, trip.id]);

    return (
        <main className="mx-auto max-w-7xl px-5 pb-14 pt-28 lg:px-12 lg:pt-32">
            <Link href="/tours" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/64 transition-colors hover:text-white">
                <ChevronLeft className="h-4 w-4" />
                {t('backToTours')}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_360px] lg:items-start">
                <div className="space-y-8">
                    <section className="surface-dark-solid overflow-hidden p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="chip-dark">{trip.city}</span>
                            {trip.location ? <span className="chip-dark">{trip.location}</span> : null}
                            {startDate ? (
                                <span className="chip-dark">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {format(startDate, "dd 'de' MMMM", { locale: dateLocale })}
                                </span>
                            ) : null}
                        </div>

                        <h1 className="mt-5 max-w-[14ch] text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                            {localizedTitle}
                        </h1>

                        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/68 md:text-lg md:leading-8">
                            {localizedDescription || t('noDescription')}
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d8c18f]">Operação</div>
                                <div className="mt-2 text-sm leading-6 text-white/72">Guia credenciado e suporte humano antes do passeio.</div>
                            </div>
                            <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d8c18f]">Reserva</div>
                                <div className="mt-2 text-sm leading-6 text-white/72">Fluxo claro com seleção de agenda e confirmação de pagamento.</div>
                            </div>
                            <div className="rounded-[22px] border border-white/8 bg-[#091d2c] px-4 py-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d8c18f]">Atendimento</div>
                                <div className="mt-2 text-sm leading-6 text-white/72">Ajustes de roteiro e apoio direto via WhatsApp.</div>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-[30px] border border-white/8 bg-[#0d2436] shadow-[0_22px_70px_rgba(0,0,0,0.24)]">
                        <div className="relative aspect-[1.32] overflow-hidden md:aspect-[1.7]">
                            <OptimizedImage
                                src={normalizeTripImage(trip.imageUrl)}
                                alt={localizedTitle}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 66vw"
                                quality={90}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.08),rgba(0,0,0,0.6))]" />
                            <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                                <div className="chip-dark">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {trip.city}
                                </div>
                                {trip.location ? (
                                    <div className="chip-dark">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {trip.location}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </section>

                    <section className="surface-dark-solid p-6 md:p-8">
                        <div className="flex flex-col gap-8">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">{t('aboutTour')}</h2>
                                <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/68">
                                    {localizedDescription || t('noDescription')}
                                </p>
                            </div>

                            {localizedHighlights && localizedHighlights.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{t('highlights')}</h3>
                                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                        {localizedHighlights.map((highlight, index) => (
                                            <li key={index} className="flex items-start gap-3 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-white/76">
                                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d8c18f]" />
                                                <span className="text-sm leading-7">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6 lg:sticky lg:top-24">
                    <TourActions
                        tripId={trip.id}
                        priceCents={trip.priceCents}
                        tripTitle={String(localizedTitle)}
                        city={trip.city}
                        schedules={schedules}
                    />

                    <div className="rounded-[26px] border border-[#d8c18f]/15 bg-[#102938] p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                            {reserveConfidence.title}
                        </h3>
                        <div className="space-y-4 text-sm text-white/78">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d8c18f]" />
                                <span className="leading-6">{reserveConfidence.item1}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d8c18f]" />
                                <span className="leading-6">{reserveConfidence.item2}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MessageCircleMore className="mt-0.5 h-4 w-4 shrink-0 text-[#d8c18f]" />
                                <span className="leading-6">{reserveConfidence.item3}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[26px] border border-white/8 bg-[#0d2436] p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/52">{t('information')}</h3>
                        <div className="mt-5 space-y-4">
                            {trip.maxGuests && (
                                <div className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm">
                                    <Users className="h-5 w-5 text-[#d8c18f]" />
                                    <div>
                                        <p className="font-medium text-white">{t('group')}</p>
                                        <p className="text-white/58">{t('maxGuests', { count: trip.maxGuests })}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-[#091d2c] px-4 py-4 text-sm">
                                <Clock className="h-5 w-5 text-[#d8c18f]" />
                                <div>
                                    <p className="font-medium text-white">{t('duration')}</p>
                                    <p className="text-white/58">{t('durationTime')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[26px] border border-white/8 bg-[#0d2436] p-6">
                        <h3 className="font-semibold text-white">{t('needHelp')}</h3>
                        <p className="mt-3 text-sm leading-7 text-white/60">
                            {t('needHelpText')}
                        </p>
                        <Link href="/contato" className="mt-5 block">
                            <Button variant="outline" className="w-full rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.07] hover:text-white">
                                {t('contactUs')}
                            </Button>
                        </Link>
                    </div>
                </aside>
            </div>
        </main>
    );
}
