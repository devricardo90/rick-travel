"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from 'next-intl';
import { getLocalizedField } from '@/lib/translation-service';

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED";

type Booking = {
  id: string;
  status: BookingStatus;
  guestCount: number;
  totalPriceCents: number;
  createdAt: string;
  trip: {
    id: string;
    title: any; // JSON multilingual
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
  const locale = useLocale();

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

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      if (err instanceof Response && err.status === 401) {
        setData([]);
      } else {
        setError("Erro ao carregar suas reservas");
        setData([]);
      }
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
  
  if (data === null) {
    return (
      <p className="text-center text-muted-foreground">Carregando reservas...</p>
    );
  }

  const active = data.filter((b) => b.status !== "CANCELED");
  const canceled = data.filter((b) => b.status === "CANCELED");

  if (active.length === 0 && canceled.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 rounded-full bg-muted p-6">
            <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold">Você ainda não tem reservas</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Que tal explorar os passeios do Rio de Janeiro e começar sua aventura hoje mesmo?
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-xl px-8 font-semibold">
            <a href="/tours">Explorar Passeios</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl px-8 font-semibold">
            <a href="https://wa.me/5521971168114" target="_blank" rel="noopener noreferrer">
              Solicitar orçamento no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const Card = ({ b }: { b: Booking }) => {
    const localizedTitle = getLocalizedField<string>(b.trip.title, locale);

    return (
      <div className="flex flex-col gap-3 rounded-2xl border bg-background/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">{localizedTitle}</div>
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
  };

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
