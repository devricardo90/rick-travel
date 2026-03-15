"use client";

import { useState, useEffect } from "react";
import { trackClientEvent } from "@/lib/analytics/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';

interface TourActionsProps {
    tripId: string;
    priceCents: number;
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

export function TourActions({ tripId, priceCents, schedules = [] }: TourActionsProps) {
    const t = useTranslations('TourActions');
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>(schedules[0]?.id ?? "");

    useEffect(() => {
        setSelectedScheduleId(schedules[0]?.id ?? "");
    }, [schedules]);

    const selectedSchedule = schedules.find((schedule) => schedule.id === selectedScheduleId);
    const displayedPrice = selectedSchedule?.pricePerPersonCents ?? priceCents;

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
                        Escolha a data
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

            {message && (
                <p className={`text-center text-sm ${message === t('successMessage') ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            <p className="text-center text-xs text-muted-foreground">
                {t('freeCancellation')}
            </p>
        </div>
    );
}
