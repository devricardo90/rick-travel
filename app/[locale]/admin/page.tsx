import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/authz";
import { ANALYTICS_EVENT_LABELS } from "@/lib/analytics/events";
import {
  getAbandonedCheckoutSummary,
  getAnalyticsAttributionSummary,
  getAnalyticsFunnelSummary,
} from "@/lib/services/analytics.service";
import { getLocalizedField } from "@/lib/localized-field";
import { asLocalizedText } from "@/lib/types";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatRate(current: number, previous: number) {
  if (previous <= 0) {
    return "0%";
  }

  return `${Math.round((current / previous) * 100)}%`;
}

async function getRecentBookings(since: Date) {
  return prisma.booking.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      user: { select: { name: true } },
      trip: { select: { city: true, title: true } },
    },
  });
}

async function getUpcomingSchedules(now: Date) {
  return prisma.tripSchedule.findMany({
    where: { startAt: { gte: now } },
    orderBy: { startAt: "asc" },
    take: 6,
    include: {
      trip: { select: { title: true, city: true } },
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        select: { guestCount: true },
      },
    },
  });
}

export default async function AdminPage() {
  await requireAdminSession();

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  type AbandonedCheckoutItem = Awaited<ReturnType<typeof getAbandonedCheckoutSummary>>["items"][number];
  type RecentBooking = Awaited<ReturnType<typeof getRecentBookings>>[number];
  type UpcomingSchedule = Awaited<ReturnType<typeof getUpcomingSchedules>>[number];
  type RecentContact = Awaited<ReturnType<typeof prisma.contactSubmission.findMany>>[number];
  type AttributionItem = Awaited<ReturnType<typeof getAnalyticsAttributionSummary>>["sources"][number];

  const [
    usersCount,
    tripsCount,
    bookingsCount,
    pendingBookingsCount,
    confirmedBookingsCount,
    unpaidBookingsCount,
    paidBookingsCount,
    pendingContactsCount,
    totalContactsCount,
    openSchedulesCount,
    paidRevenueAggregate,
    unpaidRevenueAggregate,
    recentBookings,
    upcomingSchedules,
    recentContacts,
    analyticsFunnel,
    analyticsAttribution,
    abandonedCheckout,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { paymentStatus: "UNPAID" } }),
    prisma.booking.count({ where: { paymentStatus: "PAID" } }),
    prisma.contactSubmission.count({ where: { status: "PENDING" } }),
    prisma.contactSubmission.count(),
    prisma.tripSchedule.count({ where: { status: "OPEN", startAt: { gte: now } } }),
    prisma.booking.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalPriceCents: true },
    }),
    prisma.booking.aggregate({
      where: { paymentStatus: "UNPAID", status: { in: ["PENDING", "CONFIRMED"] } },
      _sum: { totalPriceCents: true },
    }),
    getRecentBookings(sevenDaysAgo),
    getUpcomingSchedules(now),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    getAnalyticsFunnelSummary(thirtyDaysAgo),
    getAnalyticsAttributionSummary(thirtyDaysAgo),
    getAbandonedCheckoutSummary(thirtyDaysAgo),
  ]);

  const paidRevenue = paidRevenueAggregate._sum.totalPriceCents ?? 0;
  const unpaidRevenue = unpaidRevenueAggregate._sum.totalPriceCents ?? 0;
  const funnelSteps = [
    { key: "TOUR_VIEWED", count: analyticsFunnel.TOUR_VIEWED, conversionFromPrevious: "100%" },
    {
      key: "RESERVE_CLICKED",
      count: analyticsFunnel.RESERVE_CLICKED,
      conversionFromPrevious: formatRate(analyticsFunnel.RESERVE_CLICKED, analyticsFunnel.TOUR_VIEWED),
    },
    {
      key: "CHECKOUT_STARTED",
      count: analyticsFunnel.CHECKOUT_STARTED,
      conversionFromPrevious: formatRate(analyticsFunnel.CHECKOUT_STARTED, analyticsFunnel.RESERVE_CLICKED),
    },
    {
      key: "PIX_GENERATED",
      count: analyticsFunnel.PIX_GENERATED,
      conversionFromPrevious: formatRate(analyticsFunnel.PIX_GENERATED, analyticsFunnel.CHECKOUT_STARTED),
    },
    {
      key: "PAYMENT_CONFIRMED",
      count: analyticsFunnel.PAYMENT_CONFIRMED,
      conversionFromPrevious: formatRate(analyticsFunnel.PAYMENT_CONFIRMED, analyticsFunnel.PIX_GENERATED),
    },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
      <div className="rounded-[30px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
          Operacao e performance
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
          Dashboard Admin
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/64 md:text-lg">
          Visao operacional de reservas, pagamentos, agenda, contatos e sinais de conversao para acompanhamento diario da operacao.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/46">Usuarios</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{usersCount}</p>
          <p className="mt-2 text-sm leading-7 text-white/58">Base cadastrada na plataforma</p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/46">Passeios</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{tripsCount}</p>
          <p className="mt-2 text-sm leading-7 text-white/58">Catalogo total de experiencias</p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/46">Reservas</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{bookingsCount}</p>
          <p className="mt-2 text-sm leading-7 text-white/58">
            {confirmedBookingsCount} confirmadas, {pendingBookingsCount} pendentes
          </p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/46">Contatos</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{totalContactsCount}</p>
          <p className="mt-2 text-sm leading-7 text-white/58">{pendingContactsCount} pendentes de atendimento</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/46">Receita paga</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{formatCurrency(paidRevenue)}</p>
          <p className="mt-2 text-sm leading-7 text-white/58">{paidBookingsCount} reservas com pagamento confirmado</p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/46">Receita pendente</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{formatCurrency(unpaidRevenue)}</p>
          <p className="mt-2 text-sm leading-7 text-white/58">{unpaidBookingsCount} reservas ainda nao pagas</p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-[#0d2436] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/46">Agendas abertas</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{openSchedulesCount}</p>
          <p className="mt-2 text-sm leading-7 text-white/58">Datas futuras atualmente disponiveis para venda</p>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-[28px] border border-[#b99657]/20 bg-[#15140f] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#b99657]/20 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#f3e4be]">Recuperacao de checkout</h2>
            <p className="text-sm text-[#dccda7]/78">
              Reservas pendentes com checkout iniciado ou Pix gerado sem pagamento confirmado
            </p>
          </div>
          <Link
            href="/pt/admin/bookings?recovery=abandoned"
            className="inline-flex items-center rounded-2xl border border-[#b99657]/24 bg-[#211e16] px-4 py-2.5 text-sm font-medium text-[#f3e4be] transition-colors hover:bg-[#2a261d]"
          >
            Ver fila completa
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 border-b border-[#b99657]/20 p-5 md:grid-cols-3">
          <div className="rounded-[22px] border border-[#b99657]/18 bg-[#211e16] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#dccda7]/60">Abandonos</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#f8f0dc]">{abandonedCheckout.total}</p>
            <p className="mt-2 text-sm text-[#dccda7]/76">Ultimos 30 dias</p>
          </div>
          <div className="rounded-[22px] border border-[#b99657]/18 bg-[#211e16] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#dccda7]/60">Checkout iniciado</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#f8f0dc]">
              {abandonedCheckout.checkoutStartedCount}
            </p>
            <p className="mt-2 text-sm text-[#dccda7]/76">Sem Pix gerado ainda</p>
          </div>
          <div className="rounded-[22px] border border-[#b99657]/18 bg-[#211e16] p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#dccda7]/60">Pix gerado</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#f8f0dc]">
              {abandonedCheckout.pixGeneratedCount}
            </p>
            <p className="mt-2 text-sm text-[#dccda7]/76">Pronto para contato operacional</p>
          </div>
        </div>

        <div className="divide-y divide-[#b99657]/16">
          {abandonedCheckout.items.length === 0 ? (
            <div className="px-5 py-8 text-sm text-[#dccda7]/76">
              Nenhum abandono relevante nos ultimos 30 dias.
            </div>
          ) : (
            abandonedCheckout.items.slice(0, 5).map((item: AbandonedCheckoutItem) => {
              const title = getLocalizedField<string>(asLocalizedText(item.trip.title), "pt") || "Passeio";

              return (
                <div key={item.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-[#f8f0dc]">{item.user.name}</p>
                    <p className="text-sm text-[#dccda7]/72">{item.user.email}</p>
                    <p className="mt-1 text-sm text-[#f3e4be]">
                      {String(title)} · {item.trip.city}
                    </p>
                    <p className="text-xs text-[#dccda7]/68">
                      {item.schedule
                        ? `Agenda: ${new Date(item.schedule.startAt).toLocaleString("pt-BR")}`
                        : "Sem agenda vinculada"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className="inline-flex rounded-full border border-[#b99657]/24 bg-[#211e16] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f3e4be]">
                      {item.abandonedStage === "PIX_GENERATED" ? "Pix gerado" : "Checkout iniciado"}
                    </span>
                    <p className="text-sm font-semibold text-[#f8f0dc]">{formatCurrency(item.totalPriceCents)}</p>
                    <p className="text-xs text-[#dccda7]/68">
                      Ultimo sinal: {new Date(item.lastCheckoutEventAt).toLocaleString("pt-BR")}
                    </p>
                    <Link
                      href={`/pt/admin/bookings?recovery=abandoned&q=${encodeURIComponent(item.user.email)}`}
                      className="text-sm font-medium text-[#f3e4be] underline underline-offset-4"
                    >
                      Abrir reserva
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="border-b border-white/8 px-5 py-4">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Funil de conversao</h2>
          <p className="text-sm text-white/56">Ultimos 30 dias entre tour, reserva e pagamento</p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-5">
          {funnelSteps.map((step) => (
            <div key={step.key} className="rounded-[22px] border border-white/8 bg-[#091d2c] p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/44">
                {ANALYTICS_EVENT_LABELS[step.key]}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{step.count}</p>
              <p className="mt-2 text-sm leading-7 text-white/56">
                Conversao da etapa anterior: {step.conversionFromPrevious}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="border-b border-white/8 px-5 py-4">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Top origens</h2>
            <p className="text-sm text-white/56">Por `utm_source` nos tours visualizados</p>
          </div>
          <div className="divide-y divide-white/8">
            {analyticsAttribution.sources.length === 0 ? (
              <div className="px-5 py-8 text-sm text-white/56">Sem dados de origem ainda.</div>
            ) : (
              analyticsAttribution.sources.map((item: AttributionItem) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-white/76">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="border-b border-white/8 px-5 py-4">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Top campanhas</h2>
            <p className="text-sm text-white/56">Por `utm_campaign` no topo do funil</p>
          </div>
          <div className="divide-y divide-white/8">
            {analyticsAttribution.campaigns.length === 0 ? (
              <div className="px-5 py-8 text-sm text-white/56">Sem dados de campanha ainda.</div>
            ) : (
              analyticsAttribution.campaigns.map((item: AttributionItem) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-white/76">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="border-b border-white/8 px-5 py-4">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Top referrers</h2>
            <p className="text-sm text-white/56">Dominios que mais trouxeram visualizacoes</p>
          </div>
          <div className="divide-y divide-white/8">
            {analyticsAttribution.referrers.length === 0 ? (
              <div className="px-5 py-8 text-sm text-white/56">Sem dados de referrer ainda.</div>
            ) : (
              analyticsAttribution.referrers.map((item: AttributionItem) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-white/76">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="border-b border-white/8 px-5 py-4">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Reservas recentes</h2>
            <p className="text-sm text-white/56">Ultimos 7 dias</p>
          </div>

          <div className="divide-y divide-white/8">
            {recentBookings.length === 0 ? (
              <div className="px-5 py-8 text-sm text-white/56">Nenhuma reserva recente.</div>
            ) : (
              recentBookings.map((booking: RecentBooking) => (
                <div key={booking.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{booking.user.name}</p>
                      <p className="text-sm text-white/58">
                        {getLocalizedField<string>(asLocalizedText(booking.trip.title), "pt") || "Passeio"}
                        {" · "}
                        {booking.trip.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatCurrency(booking.totalPriceCents)}</p>
                      <p className="text-xs text-white/44">
                        {new Date(booking.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/64">
                      {booking.status}
                    </span>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/64">
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="border-b border-white/8 px-5 py-4">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Proximas agendas</h2>
            <p className="text-sm text-white/56">Datas futuras com ocupacao</p>
          </div>

          <div className="divide-y divide-white/8">
            {upcomingSchedules.length === 0 ? (
              <div className="px-5 py-8 text-sm text-white/56">Nenhuma agenda futura.</div>
            ) : (
              upcomingSchedules.map((schedule: UpcomingSchedule) => {
                const used = schedule.bookings.reduce((sum: number, b) => sum + b.guestCount, 0);
                const remaining = Math.max(schedule.capacity - used, 0);
                const title = getLocalizedField<string>(asLocalizedText(schedule.trip.title), "pt") || "Passeio";

                return (
                  <div key={schedule.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{String(title)}</p>
                        <p className="text-sm text-white/58">
                          {schedule.trip.city} · {new Date(schedule.startAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/64">
                        {schedule.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-[18px] border border-white/8 bg-[#091d2c] px-3 py-3">
                        <div className="text-xs text-white/44">Capacidade</div>
                        <div className="font-semibold text-white">{schedule.capacity}</div>
                      </div>
                      <div className="rounded-[18px] border border-white/8 bg-[#091d2c] px-3 py-3">
                        <div className="text-xs text-white/44">Ocupadas</div>
                        <div className="font-semibold text-white">{used}</div>
                      </div>
                      <div className="rounded-[18px] border border-white/8 bg-[#091d2c] px-3 py-3">
                        <div className="text-xs text-white/44">Restantes</div>
                        <div className="font-semibold text-white">{remaining}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <section className="mt-8 overflow-hidden rounded-[28px] border border-white/8 bg-[#0d2436] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
        <div className="border-b border-white/8 px-5 py-4">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Contatos recentes</h2>
          <p className="text-sm text-white/56">Ultimas mensagens recebidas no site</p>
        </div>

        <div className="divide-y divide-white/8">
          {recentContacts.length === 0 ? (
            <div className="px-5 py-8 text-sm text-white/56">Nenhum contato recente.</div>
          ) : (
            recentContacts.map((contact: RecentContact) => (
              <div key={contact.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-white/58">{contact.email}</p>
                  </div>
                  <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/64">
                    {contact.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/68">{contact.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
