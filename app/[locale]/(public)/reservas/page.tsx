"use client";

import { BadgeCheck, CalendarDays, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { MyBookings } from "@/components/my-bookings";

export default function ReservasPage() {
  const t = useTranslations("BookingsPage");

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

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-28 lg:px-12 lg:pt-32">
        <section className="surface-dark-solid p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
            <CalendarDays className="h-3.5 w-3.5" />
            {t("eyebrow")}
          </div>

          <h1 className="mt-6 max-w-[12ch] text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
            {t("title")}
          </h1>

          <p className="mt-5 max-w-3xl text-[15px] leading-8 text-white/68 md:text-lg">{t("subtitle")}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="chip-dark">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("manualBadge")}
            </span>
            <span className="chip-dark">
              <BadgeCheck className="h-3.5 w-3.5" />
              {t("statusBadge")}
            </span>
          </div>
        </section>

        <section className="mt-8">
          <MyBookings />
        </section>
      </div>
    </main>
  );
}
