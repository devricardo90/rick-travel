"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MessageCircleMore } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getLocalizedField } from "@/lib/localized-field";
import { buildWhatsAppQuoteUrl } from "@/lib/whatsapp";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED";
type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "PARTIAL";

type Booking = {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
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

function formatLocale(locale: string) {
  return locale === "pt" ? "pt-BR" : locale;
}

function formatBRLFromCents(cents: number, locale: string) {
  return (cents / 100).toLocaleString(formatLocale(locale), {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleString(formatLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status, label }: { status: BookingStatus; label: string }) {
  const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";
  const variant =
    status === "CONFIRMED"
      ? "border-emerald-500/30 text-emerald-300"
      : status === "PENDING"
        ? "border-amber-500/30 text-amber-300"
        : "border-white/15 text-white/54";

  return <span className={`${base} ${variant}`}>{label}</span>;
}

export function MyBookings() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();
  const t = useTranslations("BookingsPage");
  const whatsappQuoteUrl = buildWhatsAppQuoteUrl({
    locale,
    source: "bookings",
    city: "Rio de Janeiro",
  });

  const statusLabels: Record<BookingStatus, string> = {
    PENDING: t("status.pending"),
    CONFIRMED: t("status.confirmed"),
    CANCELED: t("status.canceled"),
  };
  const paymentStatusLabels: Record<PaymentStatus, string> = {
    UNPAID: t("paymentStatus.manualPending"),
    PAID: t("paymentStatus.paid"),
    REFUNDED: t("paymentStatus.refunded"),
    PARTIAL: t("paymentStatus.partial"),
  };

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
        setError(resp?.error ?? t("cancelError"));
        return;
      }

      window.dispatchEvent(new Event("bookings:refresh"));
    } catch {
      setError(t("cancelNetworkError"));
    }
  }

  useEffect(() => {
    async function loadBookings() {
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
        setData(Array.isArray(json) ? (json as Booking[]) : []);
      } catch {
        setError(t("loadError"));
        setData([]);
      }
    }

    void loadBookings();

    const onRefresh = () => void loadBookings();
    window.addEventListener("bookings:refresh", onRefresh);

    return () => {
      window.removeEventListener("bookings:refresh", onRefresh);
    };
  }, [t]);

  if (error) {
    return (
      <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-100">
        {error}
      </p>
    );
  }

  if (data === null) {
    return (
      <p className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-10 text-center text-white/62">
        {t("loading")}
      </p>
    );
  }

  const active = data.filter((booking) => booking.status !== "CANCELED");
  const canceled = data.filter((booking) => booking.status === "CANCELED");

  if (active.length === 0 && canceled.length === 0) {
    return (
      <div className="surface-dark flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full border border-white/10 bg-white/[0.05] p-6">
          <CalendarDays className="h-12 w-12 text-white/55" />
        </div>
        <h3 className="text-xl font-semibold text-white">{t("noBookingsTitle")}</h3>
        <p className="mt-3 max-w-md text-[15px] leading-7 text-white/62">{t("noBookingsText")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-2xl px-8 font-semibold">
            <Link href="/tours">{t("browseToursButton")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-2xl border-white/15 bg-white/[0.03] px-8 font-semibold text-white hover:bg-white/[0.07] hover:text-white"
          >
            <a href={whatsappQuoteUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircleMore className="h-4 w-4" />
              {t("whatsappQuote")}
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const Card = ({ booking }: { booking: Booking }) => {
    const localizedTitle = getLocalizedField<string>(booking.trip.title, locale);
    const scheduledFor = formatDate(booking.schedule?.startAt, locale);

    return (
      <div className="surface-dark flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-lg font-semibold text-white">{localizedTitle}</div>
            <StatusBadge status={booking.status} label={statusLabels[booking.status]} />
          </div>

          <div className="text-sm text-white/66">{booking.trip.city}</div>

          {scheduledFor ? (
            <div className="mt-2 text-xs text-white/58">
              {t("scheduledFor")}: {scheduledFor}
            </div>
          ) : null}

          <div className="mt-1 text-xs text-white/50">
            {t("reservedAt")}: {new Date(booking.createdAt).toLocaleString(formatLocale(locale))}
          </div>

          {booking.status === "PENDING" ? (
            <div className="mt-2 text-xs leading-5 text-amber-300">{t("pendingNote")}</div>
          ) : null}

          <div className="mt-1 text-xs text-white/50">
            {t("paymentLabel")}: {paymentStatusLabels[booking.paymentStatus] ?? t("paymentStatus.inReview")}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-left sm:text-right">
            <div className="text-lg font-semibold text-white">
              {formatBRLFromCents(
                booking.totalPriceCents > 0 ? booking.totalPriceCents : booking.trip.priceCents,
                locale
              )}
            </div>
            <div className="text-xs text-white/55">{t("guestCount", { count: booking.guestCount })}</div>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07] hover:text-white"
          >
            <Link href={`/reservas/${booking.id}`}>{t("viewDetails")}</Link>
          </Button>

          {booking.status === "CANCELED" ? null : (
            <Button
              variant="outline"
              onClick={() => cancelBooking(booking.id)}
              className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07] hover:text-white"
            >
              {t("cancel")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {active.some((booking) => booking.status === "PENDING") ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-100">
          {t("manualFlowNotice")}
        </div>
      ) : null}

      {active.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-white">{t("activeTitle")}</h4>
          {active.map((booking) => (
            <Card key={booking.id} booking={booking} />
          ))}
        </div>
      ) : null}

      {canceled.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-white/62">{t("canceledTitle")}</h4>
          {canceled.map((booking) => (
            <Card key={booking.id} booking={booking} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
