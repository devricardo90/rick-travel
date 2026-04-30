import { CalendarDays, CheckCircle2, CircleDollarSign, Hash, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getLocalizedField } from "@/lib/localized-field";
import { asLocalizedText } from "@/lib/types";

type BookingConfirmationProps = {
  booking: {
    id: string;
    status: string;
    paymentStatus: string;
    guestCount: number;
    totalPriceCents: number;
    createdAt: Date;
    schedule: {
      startAt: Date;
      endAt: Date | null;
      pricePerPersonCents: number;
    } | null;
    trip: {
      id: string;
      title: unknown;
      city: string;
      priceCents: number;
    };
  };
  locale: string;
};

function formatCurrency(cents: number, locale: string) {
  return (cents / 100).toLocaleString(locale === "pt" ? "pt-BR" : locale, {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date: Date | null | undefined, locale: string) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function BookingConfirmation({ booking, locale }: BookingConfirmationProps) {
  const t = useTranslations("BookingsPage");
  const title = getLocalizedField<string>(asLocalizedText(booking.trip.title), locale) || t("tourFallback");
  const scheduledFor = formatDate(booking.schedule?.startAt, locale);

  const statusLabels: Record<string, string> = {
    PENDING: t("status.pending"),
    CONFIRMED: t("status.confirmed"),
    CANCELED: t("status.canceled"),
  };
  const paymentStatusLabels: Record<string, string> = {
    UNPAID: t("paymentStatus.manualPending"),
    PAID: t("paymentStatus.paid"),
    REFUNDED: t("paymentStatus.refunded"),
    PARTIAL: t("paymentStatus.partial"),
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071826] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(1200px 560px at 50% -10%, rgba(255,255,255,0.09), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.06) 0%, transparent 18%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-28 lg:px-12 lg:pt-32">
        <section className="surface-dark-solid p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("confirmationEyebrow")}
          </div>

          <h1 className="mt-6 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
            {t("confirmationTitle")}
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] leading-8 text-white/68 md:text-lg">
            {t("confirmationIntro")}
          </p>

          <div className="mt-8 rounded-[24px] border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm leading-7 text-amber-50">
            {t("manualConfirmationNotice")}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="surface-dark p-5 md:col-span-2 md:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/46">{t("tour")}</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{title}</h2>
            <p className="mt-2 text-sm text-white/62">{booking.trip.city}</p>
          </div>

          <div className="surface-dark p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/46">
              <CalendarDays className="h-4 w-4" />
              {t("date")}
            </div>
            <p className="mt-3 text-lg font-semibold text-white">{scheduledFor ?? t("dateToConfirm")}</p>
          </div>

          <div className="surface-dark p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/46">
              <Users className="h-4 w-4" />
              {t("guests")}
            </div>
            <p className="mt-3 text-lg font-semibold text-white">
              {t("guestCount", { count: booking.guestCount })}
            </p>
          </div>

          <div className="surface-dark p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/46">
              <CircleDollarSign className="h-4 w-4" />
              {t("total")}
            </div>
            <p className="mt-3 text-lg font-semibold text-white">
              {formatCurrency(booking.totalPriceCents || booking.trip.priceCents, locale)}
            </p>
          </div>

          <div className="surface-dark p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/46">{t("statusLabel")}</div>
            <p className="mt-3 text-lg font-semibold text-amber-200">
              {statusLabels[booking.status] ?? t("status.inReview")}
            </p>
            <p className="mt-2 text-sm text-white/58">{t("pendingStatusHelp")}</p>
          </div>

          <div className="surface-dark p-5 md:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/46">
              <Hash className="h-4 w-4" />
              {t("bookingId")}
            </div>
            <p className="mt-3 break-all font-mono text-xs text-white/58">{booking.id}</p>
            <p className="mt-2 text-xs text-white/46">
              {t("createdAt")}: {formatDate(booking.createdAt, locale)}
            </p>
            <p className="mt-4 text-sm text-white/62">
              {t("paymentLabel")}: {paymentStatusLabels[booking.paymentStatus] ?? t("paymentStatus.inReview")}
            </p>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-2xl px-8 font-semibold">
            <Link href="/reservas">{t("backToBookings")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-2xl border-white/15 bg-white/[0.03] px-8 font-semibold text-white hover:bg-white/[0.07] hover:text-white"
          >
            <Link href={`/tours/${booking.trip.id}`}>{t("viewTour")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
