
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Trip = {
  id: string;
  title: string;
  city: string;
  description?: string | null;
  priceCents: number;
  createdAt?: string;
};

function formatBRLFromCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

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
      <p className="text-center text-muted-foreground">
        Carregando passeios...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="text-center text-sm text-muted-foreground">
          {message}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="text-center text-muted-foreground">
          Nenhum passeio disponível no momento.
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => {
            const alreadyReserved = reservedTripIds.includes(trip.id);

            return (
              <div
                key={trip.id}
                className="flex flex-col gap-4 rounded-2xl border bg-background/40 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{trip.title}</h3>
                  <p className="text-sm text-muted-foreground">{trip.city}</p>
                  {trip.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {trip.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatBRLFromCents(trip.priceCents)}
                    </div>
                  </div>

                  <Button
                    onClick={() => reserve(trip.id)}
                    disabled={alreadyReserved || loadingTripId === trip.id}
                    variant={alreadyReserved ? "outline" : "default"}
                    className="rounded-xl"
                  >
                    {alreadyReserved
                      ? "Reservado ✅"
                      : loadingTripId === trip.id
                      ? "Reservando..."
                      : "Reservar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

