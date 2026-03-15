"use client";

import { useState, useEffect } from "react";
import { trackClientEvent } from "@/lib/analytics/client";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircleMore } from "lucide-react";
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

            setMessage(data?.status === "PENDING" ? t('pendingMessage') : t('successMessage'));
            window.dispatchEvent(new Event("bookings:refresh"));
        } catch {
            setMessage(t('connectionError'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('pricePerPerson')}</span>
                <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(displayedPrice / 100)}
                </span>
            </div>

            {schedules.length > 0 && (
                <div className="space-y-2">
                    <label htmlFor="schedule-select" className="block text-sm font-medium text-foreground">
                        {copy.selectDate}
                    </label>
                    <select
                        id="schedule-select"
                        value={selectedScheduleId}
                        onChange={(event) => setSelectedScheduleId(event.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    >
                        {schedules.map((schedule) => (
                            <option key={schedule.id} value={schedule.id}>
                                {formatScheduleLabel(schedule.startAt, locale)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <Button
                className="w-full"
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

            <Button asChild variant="outline" className="w-full">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircleMore className="mr-2 h-4 w-4" />
                    {copy.whatsappQuote}
                </a>
            </Button>

            {message && (
                <p className={`text-center text-sm ${message === t('successMessage') ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            <p className="text-center text-xs text-muted-foreground">
                {t('freeCancellation')}
            </p>
            <p className="text-center text-xs text-muted-foreground">
                {copy.whatsappHelpText}
            </p>
        </div>
    );
}
