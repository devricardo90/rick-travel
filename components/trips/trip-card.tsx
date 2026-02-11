import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TripCardProps {
    trip: {
        id: string;
        title: string;
        city: string;
        location?: string | null;
        description?: string | null;
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
    const startDate = trip.startDate ? new Date(trip.startDate) : null;
    const endDate = trip.endDate ? new Date(trip.endDate) : null;

    return (
        <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                {trip.imageUrl ? (
                    <Image
                        src={trip.imageUrl}
                        alt={trip.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <span className="text-sm">Sem imagem</span>
                    </div>
                )}
                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black shadow-sm backdrop-blur-sm">
                    {trip.city}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{trip.title}</h3>
                        {trip.location && (
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <MapPin className="mr-1 h-3.5 w-3.5" />
                                {trip.location}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                    {startDate && (
                        <div className="flex items-center rounded-md bg-gray-50 px-2 py-1">
                            <Calendar className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                            <span>
                                {format(startDate, "dd/MM", { locale: ptBR })}
                                {endDate && ` - ${format(endDate, "dd/MM", { locale: ptBR })}`}
                            </span>
                        </div>
                    )}
                    {trip.maxGuests && (
                        <div className="flex items-center rounded-md bg-gray-50 px-2 py-1">
                            <Users className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                            <span>{trip.maxGuests} vagas</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">A partir de</p>
                            <p className="text-xl font-bold text-blue-600">
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
                            className={reserved ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : ""}
                        >
                            {reserved
                                ? "Reservado"
                                : loading
                                    ? "Reservando..."
                                    : "Reservar"}
                        </Button>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Link href={`/tours/${trip.id}`} className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline">
                            Ver detalhes →
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
}
