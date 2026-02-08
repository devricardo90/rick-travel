
"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  createdAt: string;
  trip: {
    id: string;
    title: string;
    city: string;
    priceCents: number;
  };
};

function formatBRLFromCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function MyBookings() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/bookings", { credentials: "include", cache: "no-store" });
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

 useEffect(() => {
  load();

  const onRefresh = () => load();
  window.addEventListener("bookings:refresh", onRefresh);

  return () => {
    window.removeEventListener("bookings:refresh", onRefresh);
  };
}, []);


  if (error) return <p className="text-center text-sm text-red-200">{error}</p>;
  if (data === null) return <p className="text-center text-muted-foreground">Carregando reservas...</p>;

  if (data.length === 0) {
    return <p className="text-center text-muted-foreground">Você ainda não tem reservas.</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((b) => (
        <div
          key={b.id}
          className="flex flex-col gap-2 rounded-2xl border bg-background/40 p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-lg font-semibold">{b.trip.title}</div>
            <div className="text-sm text-muted-foreground">{b.trip.city}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Reservado em: {new Date(b.createdAt).toLocaleString("pt-BR")}
            </div>
          </div>

          <div className="text-right text-lg font-semibold">
            {formatBRLFromCents(b.trip.priceCents)}
          </div>
        </div>
      ))}
    </div>
  );
}
