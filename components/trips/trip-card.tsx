import { OptimizedImage } from "@/components/ui/optimized-image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocalizedField } from "@/lib/translation-service";
import { useLocale } from 'next-intl';

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
    };
    onReserve: (id: string) => void;
    loading?: boolean;
    reserved?: boolean;
}

export function TripCard({ trip, onReserve, loading, reserved }: TripCardProps) {
    const locale = useLocale();
    const startDate = trip.startDate ? new Date(trip.startDate) : null;
    const endDate = trip.endDate ? new Date(trip.endDate) : null;

    // Get localized title
    const localizedTitle = getLocalizedField<string>(trip.title, locale);

    return (
        <div className="group overflow-hidden rounded-2xl border bg-white dark:bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-muted">
                {trip.imageUrl ? (
                    <OptimizedImage
                        src={trip.imageUrl}
                        alt={localizedTitle}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={75}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <span className="text-sm">Sem imagem</span>
                    </div>
                )}
                <div className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-black/50 px-3 py-1 text-xs font-medium text-black dark:text-white shadow-sm backdrop-blur-sm">
                    {trip.city}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">{localizedTitle}</h3>
                        {trip.location && (
                            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-muted-foreground">
                                <MapPin className="mr-1 h-3.5 w-3.5" />
                                {trip.location}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-muted-foreground">
                    {startDate && (
                        <div className="flex items-center rounded-md bg-gray-50 dark:bg-muted px-2 py-1">
                            <Calendar className="mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-primary" />
                            <span>
                                {format(startDate, "dd/MM", { locale: ptBR })}
                                {endDate && ` - ${format(endDate, "dd/MM", { locale: ptBR })}`}
                            </span>
                        </div>
                    )}
                    {trip.maxGuests && (
                        <div className="flex items-center rounded-md bg-gray-50 dark:bg-muted px-2 py-1">
                            <Users className="mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-primary" />
                            <span>{trip.maxGuests} vagas</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-muted-foreground">A partir de</p>
                            <p className="text-xl font-bold text-blue-600 dark:text-primary">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(trip.priceCents / 100)}
                            </p>
                        </div>

                        <Button
                            onClick={() => onReserve(trip.id)}
                            disabled={reserved || loading}
                            variant={reserved ? "outline" : "default"}
                            size="sm"
                            className={`button-press ${reserved ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50" : ""}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Reservando...
                                </>
                            ) : reserved ? (
                                "Reservado"
                            ) : (
                                "Reservar"
                            )}
                        </Button>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Link href={`/tours/${trip.id}`} className="text-sm font-medium text-muted-foreground link-underline">
                            Ver detalhes →
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
}
