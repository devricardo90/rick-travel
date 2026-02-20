"use client";

import { useEffect, useState } from "react";
import { TripCard } from "./trips/trip-card";
import { TripGridSkeleton } from "./trips/trip-card-skeleton";
import { toast } from "sonner";

type Trip = {
    id: string;
    title: any; // JSON multilingual
    city: string;
    location?: string | null;
    description?: any | null; // JSON multilingual
    priceCents: number;
    imageUrl?: string | null;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    maxGuests?: number | null;
    highlights?: any; // JSON multilingual array
    createdAt?: Date | string;
    durationDays?: number;
    physicalLevel?: string;
    childrenAllowed?: boolean;
};

interface TripGridProps {
    trips: Trip[];
}

export function TripGrid({ trips }: TripGridProps) {
    const [loadingTripId, setLoadingTripId] = useState<string | null>(null);
    const [reservedTripIds, setReservedTripIds] = useState<string[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // 🔹 carrega IDs das trips já reservadas
    async function loadReservedTripIds() {
        try {
            const res = await fetch("/api/bookings/my-trip-ids", {
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) return;

            const ids = (await res.json()) as string[];
            setReservedTripIds(Array.isArray(ids) ? ids : []);
        } catch {
            // silencioso
        } finally {
            setIsInitialLoading(false);
        }
    }

    // 🔹 load inicial
    useEffect(() => {
        loadReservedTripIds();
    }, []);

    // 🔹 refresh automático após reservar/cancelar
    useEffect(() => {
        const onRefresh = () => loadReservedTripIds();
        window.addEventListener("bookings:refresh", onRefresh);
        return () => window.removeEventListener("bookings:refresh", onRefresh);
    }, []);

    // 🔹 reservar
    async function reserve(tripId: string) {
        setLoadingTripId(tripId);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ tripId }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.status === 401) {
                toast.error("Você precisa fazer login para reservar", {
                    description: "Redirecionando para a página de login...",
                });
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
                return;
            }

            if (res.status === 409) {
                toast.info("Já reservado", {
                    description: "Você já possui uma reserva para este passeio ✅",
                });
                window.dispatchEvent(new Event("bookings:refresh"));
                return;
            }

            if (!res.ok) {
                toast.error("Erro ao reservar", {
                    description: data?.error ?? "Tente novamente mais tarde",
                });
                return;
            }

            toast.success("Reserva criada com sucesso! 🎉", {
                description: "Você pode ver suas reservas em suas informações",
            });
            window.dispatchEvent(new Event("bookings:refresh"));
        } catch {
            toast.error("Erro de rede", {
                description: "Verifique sua conexão e tente novamente",
            });
        } finally {
            setLoadingTripId(null);
        }
    }

    // Mostrar skeleton durante carregamento inicial
    if (isInitialLoading) {
        return <TripGridSkeleton count={6} />;
    }

    return (
        <div className="space-y-6">
            {trips.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    Nenhum passeio disponível no momento.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onReserve={reserve}
                            loading={loadingTripId === trip.id}
                            reserved={reservedTripIds.includes(trip.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
