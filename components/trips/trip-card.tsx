'use client'

import { OptimizedImage } from "@/components/ui/optimized-image";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Loader2, Clock } from "lucide-react";
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
    onReserve: (id: string) => void;
    loading?: boolean;
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

export function TripCard({ trip, onReserve, loading }: TripCardProps) {
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
        <div className="group overflow-hidden rounded-2xl border border-transparent bg-white dark:bg-[#0B2233] dark:border-white/8 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 dark:hover:border-white/15 dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-[#071826]">
                <OptimizedImage
                    src={normalizeTripImage(trip.imageUrl)}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute top-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-sm flex items-center gap-1 border border-white/10">
                    <MapPin className="h-3 w-3" />
                    {trip.city}
                </div>

                {trip.childrenAllowed === false ? (
                    <div className="absolute top-3 right-14 rounded-full bg-red-500/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm border border-white/10">
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-foreground leading-tight">{title}</h3>
                    {trip.location ? (
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
                            {trip.location}
                        </div>
                    ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {trip.durationDays ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted dark:bg-white/5 dark:border dark:border-white/10 px-2.5 py-0.5 text-xs font-medium text-muted-foreground dark:text-[#A8B7C6]">
                            <Clock className="h-3 w-3" />
                            {trip.durationDays} {trip.durationDays === 1 ? "dia" : "dias"}
                        </span>
                    ) : null}
                    {trip.physicalLevel ? <PhysicalLevelBadge level={String(trip.physicalLevel)} /> : null}
                    {trip.maxGuests ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted dark:bg-white/5 dark:border dark:border-white/10 px-2.5 py-0.5 text-xs font-medium text-muted-foreground dark:text-[#A8B7C6]">
                            <Users className="h-3 w-3" />
                            {t("maxGuests", { count: trip.maxGuests })}
                        </span>
                    ) : null}
                </div>

                {startDate ? (
                    <div className="mt-3 flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4 shrink-0" />
                        {format(startDate, "dd 'de' MMMM", { locale: dateLocale })}
                        {endDate ? ` - ${format(endDate, "dd 'de' MMMM", { locale: dateLocale })}` : ""}
                    </div>
                ) : null}

                <div className="mt-5 rounded-xl dark:bg-gradient-to-r dark:from-[#0B2E1E] dark:to-[#0F3B27] dark:border dark:border-[#1A4D2E]/60 p-0 dark:p-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <p className="text-xs text-muted-foreground dark:text-[#A8B7C6]/70">{t("pricePerPerson")}</p>
                            <p className="text-3xl font-black text-primary dark:text-[#EAF2F7] leading-none mt-0.5">
                                R$ {(trip.priceCents / 100).toFixed(2).replace(".", ",")}
                            </p>
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => onReserve(trip.id)}
                                disabled={loading}
                                className="shrink-0 transition-all duration-200 dark:bg-transparent dark:border dark:border-white/20 dark:text-[#EAF2F7] dark:hover:bg-white/8 dark:hover:border-white/35"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {t("reserveNow")}
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <Link
                    href={`/tours/${trip.id}`}
                    className="mt-3 block text-center text-sm text-primary/80 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm transition-colors duration-150"
                >
                    {t("viewDetails")} -
                </Link>
            </div>
        </div>
    );
}
