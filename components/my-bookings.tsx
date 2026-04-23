"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from 'next-intl';
import { trackClientEvent } from "@/lib/analytics/client";
import { getLocalizedField } from '@/lib/localized-field';
import { buildWhatsAppQuoteUrl } from "@/lib/whatsapp";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED";

type Booking = {
  id: string;
  status: BookingStatus;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED" | "PARTIAL";
  guestCount: number;
  totalPriceCents: number;
  createdAt: string;
  schedule?: {
    startAt: string;
  } | null;
  trip: {
    id: string;
    title: Record<string, string> | string;
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
      ? "border-emerald-500/30 text-emerald-300"
      : status === "PENDING"
        ? "border-amber-500/30 text-amber-300"
        : "border-white/15 text-white/54";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const locale = useLocale();
  const lastPendingBookingIdsRef = useRef<string>("");
  const whatsappQuoteUrl = buildWhatsAppQuoteUrl({
    locale,
    source: "bookings",
    city: "Rio de Janeiro",
  });

  async function load(options?: { silent?: boolean }) {
    const silent = options?.silent ?? false;

    if (!silent) {
      setError(null);
    } else {
      setIsRefreshing(true);
    }

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
      const bookings = Array.isArray(json) ? (json as Booking[]) : [];
      setData(bookings);

      const currentPendingIds = bookings
        .filter((booking) => booking.status === "PENDING" && booking.paymentStatus === "UNPAID")
        .map((booking) => booking.id)
        .sort()
        .join(",");

      lastPendingBookingIdsRef.current = currentPendingIds;
    } catch (err) {
      if (err instanceof Response && err.status === 401) {
        setData([]);
      } else {
        setError("Erro ao carregar suas reservas");
        setData([]);
      }
    } finally {
      if (silent) {
        setIsRefreshing(false);
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
        window.location.href = `/${locale}/login`;
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

  async function startPayment(bookingId: string) {
    setError(null);
    void trackClientEvent({
      type: "CHECKOUT_STARTED",
      bookingId,
      metadata: { locale },
    });

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, locale }),
      });

      const resp = await res.json().catch(() => ({}));

      if (res.status === 401) {
        window.location.href = `/${locale}/login`;
        return;
      }

      if (!res.ok) {
        setError(resp?.error ?? "Erro ao iniciar pagamento");
        return;
      }

      if (resp?.checkoutUrl) {
        window.location.href = resp.checkoutUrl;
        return;
      }

      setError("Checkout indisponivel no momento");
    } catch {
      setError("Erro de rede ao iniciar pagamento");
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

  useEffect(() => {
    if (!data?.some((booking) => booking.status === "PENDING" && booking.paymentStatus === "UNPAID")) {
      return;
    }

    const refreshPendingBookings = () => {
      if (document.visibilityState === "visible") {
        void load({ silent: true });
      }
    };

    const intervalId = window.setInterval(refreshPendingBookings, 15000);
    window.addEventListener("focus", refreshPendingBookings);
    document.addEventListener("visibilitychange", refreshPendingBookings);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshPendingBookings);
      document.removeEventListener("visibilitychange", refreshPendingBookings);
    };
  }, [data]);

  if (error) return <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">{error}</p>;

  if (data === null) {
    return (
      <p className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-10 text-center text-white/62">Carregando reservas...</p>
    );
  }

  const active = data.filter((b) => b.status !== "CANCELED");
  const canceled = data.filter((b) => b.status === "CANCELED");

  if (active.length === 0 && canceled.length === 0) {
    return (
      <div className="surface-dark flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full border border-white/10 bg-white/[0.05] p-6">
          <svg className="h-12 w-12 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white">Você ainda não tem reservas</h3>
        <p className="mt-3 max-w-md text-[15px] leading-7 text-white/62">
          Que tal explorar os passeios do Rio de Janeiro e começar sua aventura hoje mesmo?
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-2xl px-8 font-semibold">
            <a href={`/${locale}/tours`}>Explorar Passeios</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/15 bg-white/[0.03] px-8 font-semibold text-white hover:bg-white/[0.07] hover:text-white">
            <a href={whatsappQuoteUrl} target="_blank" rel="noopener noreferrer">
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
      <div className="surface-dark flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold text-white">{localizedTitle}</div>
            <StatusBadge status={b.status} />
          </div>

          <div className="text-sm text-white/66">{b.trip.city}</div>

          <div className="mt-1 text-xs text-white/50">
            Reservado em: {new Date(b.createdAt).toLocaleString("pt-BR")}
          </div>
          {b.status === "PENDING" ? (
            <div className="mt-2 text-xs text-amber-300">
              Aguardando confirmacao do pagamento ou validacao da equipe.
            </div>
          ) : null}
          <div className="mt-1 text-xs text-white/50">
            Pagamento: {b.paymentStatus}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-semibold text-white">
              {formatBRLFromCents(b.totalPriceCents > 0 ? b.totalPriceCents : b.trip.priceCents)}
            </div>
            {b.guestCount > 1 && (
              <div className="text-xs text-white/55">
                {b.guestCount} viajantes
              </div>
            )}
          </div>

          {/* {b.status !== "CANCELED" && b.paymentStatus !== "PAID" ? (
            <Button onClick={() => startPayment(b.id)}>
              Pagar
            </Button>
          ) : null} */}

          {b.status === "CANCELED" ? null : (
            <Button variant="outline" onClick={() => cancelBooking(b.id)} className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07] hover:text-white">
              Cancelar
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {data.some((booking) => booking.status === "PENDING" && booking.paymentStatus === "UNPAID") ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-100">
          A pagina atualiza automaticamente o status do pagamento a cada poucos segundos.
          {isRefreshing ? " Verificando confirmacao..." : null}
        </div>
      ) : null}

      {active.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-white">Minhas reservas</h4>
          {active.map((b) => (
            <Card key={b.id} b={b} />
          ))}
        </div>
      ) : null}

      {canceled.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-white/62">
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
