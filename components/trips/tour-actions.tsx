"use client";

import { useState, useEffect } from "react";
import { trackClientEvent } from "@/lib/analytics/client";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircleMore, CalendarDays } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { buildWhatsAppQuoteUrl } from "@/lib/whatsapp";

interface TourActionsProps {
    tripId: string;
    priceCents: number;
    tripTitle?: string;
    city?: string;
    schedules?: Array<{
        id: string;
        startAt: string;
        endAt: string | null;
        capacity: number;
        pricePerPersonCents: number;
    }>;
}

function formatScheduleLabel(date: string, locale: string) {
    return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

function getTourActionCopy(locale: string) {
    switch (locale) {
        case "en":
            return {
                selectDate: "Choose a date",
                whatsappQuote: "Ask for itinerary on WhatsApp",
                whatsappHelpText: "Use WhatsApp if you want to confirm dates, trip format or personalized support.",
            };
        case "es":
            return {
                selectDate: "Elige la fecha",
                whatsappQuote: "Solicitar itinerario por WhatsApp",
                whatsappHelpText: "Usa WhatsApp si quieres validar fecha, formato del paseo o soporte personalizado.",
            };
        case "sv":
            return {
                selectDate: "Valj datum",
                whatsappQuote: "Begar resplan pa WhatsApp",
                whatsappHelpText: "Anvand WhatsApp om du vill bekrfta datum, upplagg eller fa personlig hjalp.",
            };
        default:
            return {
                selectDate: "Escolha a data",
                whatsappQuote: "Solicitar roteiro no WhatsApp",
                whatsappHelpText: "Use o WhatsApp se quiser validar agenda, formato do passeio ou atendimento personalizado.",
            };
    }
}

export function TourActions({ tripId, priceCents, tripTitle, city, schedules = [] }: TourActionsProps) {
    const t = useTranslations('TourActions');
    const locale = useLocale();
    const copy = getTourActionCopy(locale);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>(schedules[0]?.id ?? "");

    useEffect(() => {
        setSelectedScheduleId(schedules[0]?.id ?? "");
    }, [schedules]);

    const selectedSchedule = schedules.find((schedule) => schedule.id === selectedScheduleId);
    const displayedPrice = selectedSchedule?.pricePerPersonCents ?? priceCents;
    const whatsappUrl = buildWhatsAppQuoteUrl({
        locale,
        tripTitle,
        city,
        source: "tour_detail",
        scheduleLabel: selectedSchedule ? formatScheduleLabel(selectedSchedule.startAt, locale) : undefined,
    });

    async function handleReserve() {
        setLoading(true);
        setMessage(null);
        void trackClientEvent({
            type: "RESERVE_CLICKED",
            tripId,
            metadata: {
                scheduleId: selectedScheduleId || null,
                hasSchedules: schedules.length > 0,
                displayedPrice,
            },
        });

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tripId,
                    scheduleId: selectedScheduleId || undefined,
                }),
            });

            if (res.status === 401) {
                window.location.href = `/${locale}/login?redirect=/${locale}/tours/${tripId}`;
                return;
            }

            const data = await res.json().catch(() => ({}));

            if (res.status === 409) {
                setMessage(data?.error ?? t('alreadyReserved'));
                return;
            }

            if (!res.ok) {
                setMessage(data?.error ?? t('errorMessage'));
                return;
            }

            if (typeof data?.id === "string" && data.id.trim()) {
                window.dispatchEvent(new Event("bookings:refresh"));
                window.location.href = `/${locale}/reservas/${encodeURIComponent(data.id)}`;
                return;
            }

            setMessage(data?.status === "PENDING" ? t('pendingMessage') : t('successMessage'));
            window.dispatchEvent(new Event("bookings:refresh"));
        } catch {
            setMessage(t('connectionError'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <div className="rounded-[22px] border border-white/8 bg-[#091d2c] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/46">{t('pricePerPerson')}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(displayedPrice / 100)}
                </div>
            </div>

            {schedules.length > 0 && (
                <div className="mt-5 space-y-2">
                    <label htmlFor="schedule-select" className="block text-sm font-medium text-white/74">
                        {copy.selectDate}
                    </label>
                    <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/42" />
                        <select
                            id="schedule-select"
                            value={selectedScheduleId}
                            onChange={(event) => setSelectedScheduleId(event.target.value)}
                            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-2 text-sm text-white outline-none transition-colors hover:bg-white/[0.06] focus:border-white/20"
                        >
                            {schedules.map((schedule) => (
                                <option key={schedule.id} value={schedule.id} className="bg-[#10283c] text-white">
                                    {formatScheduleLabel(schedule.startAt, locale)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="mt-5 space-y-3">
                <Button
                    className="h-12 w-full rounded-2xl"
                    size="lg"
                    onClick={handleReserve}
                    disabled={loading || (schedules.length > 0 && !selectedScheduleId)}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('processing')}
                        </>
                    ) : (
                        t('reserveNow')
                    )}
                </Button>

                <Button asChild variant="outline" className="h-12 w-full rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.07] hover:text-white">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircleMore className="mr-2 h-4 w-4" />
                        {copy.whatsappQuote}
                    </a>
                </Button>
            </div>

            {message && (
                <p className={`mt-4 text-center text-sm ${message === t('successMessage') ? "text-emerald-300" : "text-red-300"}`}>
                    {message}
                </p>
            )}

            <div className="mt-5 space-y-2 border-t border-white/8 pt-5 text-center">
                <p className="text-xs text-white/52">
                    {t('freeCancellation')}
                </p>
                <p className="text-xs leading-6 text-white/44">
                    {copy.whatsappHelpText}
                </p>
            </div>
        </div>
    );
}
