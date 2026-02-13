"use client";

import { useEffect, useState } from "react";
import { TripCard } from "./trips/trip-card";

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
};

interface TripGridProps {
    trips: Trip[];
}

export function TripGrid({ trips }: TripGridProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [loadingTripId, setLoadingTripId] = useState<string | null>(null);
    const [reservedTripIds, setReservedTripIds] = useState<string[]>([]);

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
        setMessage(null);
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
                window.location.href = "/login";
                return;
            }

            if (res.status === 409) {
                setMessage("Você já possui uma reserva para esse passeio ✅");
                window.dispatchEvent(new Event("bookings:refresh"));
                return;
            }

            if (!res.ok) {
                setMessage(data?.error ?? "Erro ao reservar");
                return;
            }

            setMessage("Reserva criada com sucesso ✅");
            window.dispatchEvent(new Event("bookings:refresh"));
        } catch {
            setMessage("Erro de rede ao reservar");
        } finally {
            setLoadingTripId(null);
        }
    }

    return (
        <div className="space-y-6">
            {message && (
                <div className="rounded-md bg-blue-50 p-4 text-center text-sm text-blue-700">
                    {message}
                </div>
            )}

            {trips.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    Nenhum passeio disponível no momento.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
