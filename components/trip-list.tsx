"use client";

import { useEffect, useState } from "react";
import { TripCard } from "./trips/trip-card";

type Trip = {
  id: string;
  title: string;
  city: string;
  location?: string | null;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  startDate?: string;
  endDate?: string;
  maxGuests?: number | null;
  highlights?: string[];
  createdAt?: string;
};

export function TripList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingTripId, setLoadingTripId] = useState<string | null>(null);
  const [reservedTripIds, setReservedTripIds] = useState<string[]>([]);

  // 🔹 carrega passeios
  async function loadTrips() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/trips", { cache: "no-store" });
      if (!res.ok) {
        setMessage("Erro ao carregar passeios");
        setTrips([]);
        return;
      }
      const data = (await res.json()) as Trip[];
      setTrips(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Erro de rede ao carregar passeios");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }

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
    loadTrips();
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="aspect-video w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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

