"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED";

type Booking = {
  id: string;
  status: BookingStatus;
  guestCount: number;
  totalPriceCents: number;
  createdAt: string;
  trip: {
    id: string;
    title: string;
    city: string;
    priceCents: number;
  };
};

function formatBRLFromCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";
  const variant =
    status === "CONFIRMED"
      ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
      : status === "PENDING"
        ? "border-amber-500/30 text-amber-600 dark:text-amber-400"
        : "border-zinc-500/30 text-zinc-500";

  const label =
    status === "CONFIRMED"
      ? "CONFIRMADA"
      : status === "PENDING"
        ? "PENDENTE"
        : "CANCELADA";

  return <span className={`${base} ${variant}`}>{label}</span>;
}

export function MyBookings() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401) {
        setData([]);
        return;
      }

      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      setError("Erro ao carregar suas reservas");
      setData([]);
    }
  }

  async function cancelBooking(bookingId: string) {
    setError(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const resp = await res.json().catch(() => ({}));

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        setError(resp?.error ?? "Erro ao cancelar reserva");
        return;
      }

      window.dispatchEvent(new Event("bookings:refresh"));
    } catch {
      setError("Erro de rede ao cancelar");
    }
  }

  useEffect(() => {
    load();

    const onRefresh = () => load();
    window.addEventListener("bookings:refresh", onRefresh);

    return () => {
      window.removeEventListener("bookings:refresh", onRefresh);
    };
  }, []);

  if (error) return <p className="text-center text-sm text-red-200">{error}</p>;
  if (data === null)
    return (
      <p className="text-center text-muted-foreground">Carregando reservas...</p>
    );

  const active = data.filter((b) => b.status !== "CANCELED");
  const canceled = data.filter((b) => b.status === "CANCELED");

  if (active.length === 0 && canceled.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Você ainda não tem reservas.
      </p>
    );
  }

  const Card = ({ b }: { b: Booking }) => (
    <div className="flex flex-col gap-3 rounded-2xl border bg-background/40 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">{b.trip.title}</div>
          <StatusBadge status={b.status} />
        </div>

        <div className="text-sm text-muted-foreground">{b.trip.city}</div>

        <div className="mt-1 text-xs text-muted-foreground">
          Reservado em: {new Date(b.createdAt).toLocaleString("pt-BR")}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-lg font-semibold">
            {formatBRLFromCents(b.totalPriceCents > 0 ? b.totalPriceCents : b.trip.priceCents)}
          </div>
          {b.guestCount > 1 && (
            <div className="text-xs text-muted-foreground">
              {b.guestCount} viajantes
            </div>
          )}
        </div>

        {b.status === "CANCELED" ? null : (
          <Button variant="outline" onClick={() => cancelBooking(b.id)}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {active.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-base font-semibold">Minhas reservas</h4>
          {active.map((b) => (
            <Card key={b.id} b={b} />
          ))}
        </div>
      ) : null}

      {canceled.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-muted-foreground">
            Canceladas
          </h4>
          {canceled.map((b) => (
            <Card key={b.id} b={b} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
