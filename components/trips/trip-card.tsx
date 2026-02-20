import { OptimizedImage } from "@/components/ui/optimized-image";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocalizedField } from "@/lib/translation-service";
import { normalizeTripImage } from "@/lib/image-utils";
import { useLocale, useTranslations } from 'next-intl';
import { ptBR, enUS, es, sv, type Locale } from "date-fns/locale";

interface TripCardProps {
    trip: {
        id: string;
        title: any; // JSON multilingual field
        city: string;
        location?: string | null;
        description?: any | null; // JSON multilingual field
        priceCents: number;
        imageUrl?: string | null;
        startDate?: string | Date | null;
        endDate?: string | Date | null;
        maxGuests?: number | null;
        durationDays?: number;
        physicalLevel?: string;
        childrenAllowed?: boolean;
    };
    onReserve: (id: string) => void;
    loading?: boolean;
    reserved?: boolean;
}

export function TripCard({ trip, onReserve, loading, reserved }: TripCardProps) {
    const locale = useLocale();
    const t = useTranslations('TripCard');
    const startDate = trip.startDate ? new Date(trip.startDate) : null;
    const endDate = trip.endDate ? new Date(trip.endDate) : null;

    // Get localized title
    const localizedTitle = getLocalizedField<string>(trip.title, locale);

    // Locale mapping for date-fns
    const localeMap: Record<string, Locale> = {
        'pt': ptBR,
        'en': enUS,
        'es': es,
        'sv': sv,
    };
    const dateLocale = localeMap[locale] || ptBR;

    // Descriptive alt text for accessibility (WCAG 1.1.1)
    const imageAlt = `${localizedTitle} - ${trip.city}${trip.location ? ', ' + trip.location : ''}`;

    return (
        <div className="group overflow-hidden rounded-2xl border bg-white dark:bg-card shadow-sm transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-muted">
                <OptimizedImage
                    src={normalizeTripImage(trip.imageUrl)}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                />
                <div className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-black/50 px-3 py-1 text-xs font-medium text-black dark:text-white shadow-sm backdrop-blur-sm">
                    {trip.city}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">{localizedTitle}</h3>
                        {trip.location && (
                            <div className="mt-1 flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-1 h-3.5 w-3.5" />
                                {trip.location}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    {startDate && (
                        <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {format(startDate, "dd 'de' MMMM", { locale: dateLocale })}
                            {endDate && ` - ${format(endDate, "dd 'de' MMMM", { locale: dateLocale })}`}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-muted-foreground">
                        {trip.durationDays && (
                            <div className="flex items-center">
                                <span className="font-semibold mr-1">Duração:</span> {trip.durationDays} {trip.durationDays === 1 ? 'dia' : 'dias'}
                            </div>
                        )}
                        {trip.physicalLevel && (
                            <div className="flex items-center">
                                <span className="font-semibold mr-1">Nível:</span>
                                <span className={
                                    trip.physicalLevel === 'EXTREME' ? 'text-red-500 font-bold' :
                                        trip.physicalLevel === 'HARD' ? 'text-orange-500' :
                                            trip.physicalLevel === 'MODERATE' ? 'text-yellow-600' :
                                                'text-green-600'
                                }>
                                    {trip.physicalLevel === 'LIGHT' ? 'Leve' :
                                        trip.physicalLevel === 'MODERATE' ? 'Moderado' :
                                            trip.physicalLevel === 'HARD' ? 'Difícil' : 'Extremo'}
                                </span>
                            </div>
                        )}
                    </div>

                    {trip.maxGuests && (
                        <div className="flex items-center text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" />
                            {t('maxGuests', { count: trip.maxGuests })}
                        </div>
                    )}
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{t('pricePerPerson')}</p>
                        <p className="text-2xl font-bold text-primary">
                            R$ {(trip.priceCents / 100).toFixed(2).replace('.', ',')}
                        </p>
                    </div>

                    {trip.childrenAllowed === false && (
                        <div className="text-xs text-red-500 font-semibold border border-red-200 bg-red-50 px-2 py-1 rounded">
                            +18 anos
                        </div>
                    )}

                    <Button
                        onClick={() => onReserve(trip.id)}
                        disabled={reserved || loading}
                        className={reserved ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {reserved ? t('reserved') : t('reserveNow')}
                    </Button>
                </div>

                <Link
                    href={`/tours/${trip.id}`}
                    className="mt-3 block text-center text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                >
                    {t('viewDetails')}
                </Link>
            </div>
        </div>
    );
}
