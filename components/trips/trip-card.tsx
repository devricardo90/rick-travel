'use client'

import { OptimizedImage } from "@/components/ui/optimized-image";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeTripImage } from "@/lib/image-utils";
import { useLocale, useTranslations } from "next-intl";
import { ptBR, enUS, es, sv, type Locale } from "date-fns/locale";
import { TourMediaBadges } from "@/components/trips/tour-media-badges";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { getLocalizedField } from "@/lib/localized-field";
import { TripCardData } from "@/lib/types";

interface TripCardProps {
    trip: TripCardData;
}

function PhysicalLevelBadge({ level }: { level: string }) {
    const labels: Record<string, { label: string; className: string; icon: string }> = {
        LIGHT: { label: "Leve", className: "level-light", icon: "L" },
        MODERATE: { label: "Moderado", className: "level-moderate", icon: "M" },
        HARD: { label: "Dificil", className: "level-hard", icon: "H" },
        EXTREME: { label: "Extremo", className: "level-extreme", icon: "E" },
    };
    const data = labels[level] || labels.LIGHT;
    return (
        <span className={data.className}>
            {data.icon} {data.label}
        </span>
    );
}

function getCardCtaLabel(locale: string) {
    switch (locale) {
        case "en":
            return "View dates";
        case "es":
            return "Ver fechas";
        case "sv":
            return "Se datum";
        default:
            return "Ver datas";
    }
}

export function TripCard({ trip }: TripCardProps) {
    const locale = useLocale();
    const t = useTranslations("TripCard");
    const startDate = trip.startDate ? new Date(trip.startDate) : null;
    const endDate = trip.endDate ? new Date(trip.endDate) : null;
    const title = getLocalizedField<string>(trip.title, locale) || "Trip";

    const localeMap: Record<string, Locale> = {
        pt: ptBR,
        en: enUS,
        es: es,
        sv: sv,
    };
    const dateLocale = localeMap[locale] || ptBR;
    const imageAlt = `${title} - ${trip.city}${trip.location ? ", " + trip.location : ""}`;

    return (
        <div className="group overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_26px_80px_rgba(0,0,0,0.3)]">
            <div className="relative aspect-[1.18] w-full overflow-hidden bg-[#071826]">
                <OptimizedImage
                    src={normalizeTripImage(trip.imageUrl)}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08),rgba(0,0,0,0.62))]" />

                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-[#071826]/58 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-sm">
                    <MapPin className="h-3 w-3" />
                    {trip.city}
                </div>

                {trip.childrenAllowed === false ? (
                    <div className="absolute right-14 top-3 rounded-full border border-white/10 bg-red-500/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
                        +18
                    </div>
                ) : null}

                <TourMediaBadges
                    rating={trip.ratingAvg}
                    reviews={trip.reviewsCount}
                    bookings={trip.bookingsCount}
                    showFavorite
                />
            </div>

            <div className="p-5">
                <div>
                    <h3 className="text-lg font-semibold leading-tight tracking-[-0.03em] text-white">{title}</h3>
                    {trip.location ? (
                        <div className="mt-2 flex items-center text-sm text-white/62">
                            <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
                            {trip.location}
                        </div>
                    ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {trip.durationDays ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-white/72">
                            <Clock className="h-3 w-3" />
                            {trip.durationDays} {trip.durationDays === 1 ? "dia" : "dias"}
                        </span>
                    ) : null}
                    {trip.physicalLevel ? <PhysicalLevelBadge level={String(trip.physicalLevel)} /> : null}
                    {trip.maxGuests ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-white/72">
                            <Users className="h-3 w-3" />
                            {t("maxGuests", { count: trip.maxGuests })}
                        </span>
                    ) : null}
                </div>

                {startDate ? (
                    <div className="mt-4 flex items-center text-sm text-white/60">
                        <Calendar className="mr-2 h-4 w-4 shrink-0" />
                        {format(startDate, "dd 'de' MMMM", { locale: dateLocale })}
                        {endDate ? ` - ${format(endDate, "dd 'de' MMMM", { locale: dateLocale })}` : ""}
                    </div>
                ) : null}

                <div className="mt-6 rounded-[22px] border border-white/8 bg-[#091d2c] p-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <p className="text-xs text-white/52">{t("pricePerPerson")}</p>
                            <p className="mt-1 text-3xl font-semibold leading-none text-white">
                                R$ {(trip.priceCents / 100).toFixed(2).replace(".", ",")}
                            </p>
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                asChild
                                className="shrink-0 rounded-xl bg-white text-slate-900 transition-all duration-200 hover:bg-white/92"
                            >
                                <Link href={`/tours/${trip.id}`}>{getCardCtaLabel(locale)}</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <Link
                    href={`/tours/${trip.id}`}
                    className="mt-4 block rounded-sm text-center text-sm text-white/72 transition-colors duration-150 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    {t("viewDetails")}
                </Link>
            </div>
        </div>
    );
}
