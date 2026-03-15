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

export default async function AdminPage() {
  await requireAdminSession();

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

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
    prisma.booking.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        user: { select: { name: true } },
        trip: { select: { city: true, title: true } },
      },
    }),
    prisma.tripSchedule.findMany({
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
    }),
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
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Visao operacional de reservas, pagamentos, agenda e contatos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Usuarios</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{usersCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Base cadastrada na plataforma</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Passeios</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{tripsCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Catalogo total de experiencias</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Reservas</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{bookingsCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {confirmedBookingsCount} confirmadas, {pendingBookingsCount} pendentes
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Contatos</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{totalContactsCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">{pendingContactsCount} pendentes de atendimento</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Receita paga</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{formatCurrency(paidRevenue)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{paidBookingsCount} reservas com pagamento confirmado</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Receita pendente</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{formatCurrency(unpaidRevenue)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{unpaidBookingsCount} reservas ainda nao pagas</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Agendas abertas</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{openSchedulesCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Datas futuras atualmente disponiveis para venda</p>
        </div>
      </div>

      <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/70 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-amber-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-amber-950">Recuperacao de checkout</h2>
            <p className="text-sm text-amber-900/80">
              Reservas pendentes com checkout iniciado ou Pix gerado sem pagamento confirmado
            </p>
          </div>
          <Link
            href="/pt/admin/bookings?recovery=abandoned"
            className="inline-flex items-center rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-950 hover:bg-amber-100"
          >
            Ver fila completa
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 border-b border-amber-200 p-5 md:grid-cols-3">
          <div className="rounded-xl border border-amber-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-amber-900/70">Abandonos</p>
            <p className="mt-2 text-3xl font-bold text-amber-950">{abandonedCheckout.total}</p>
            <p className="mt-2 text-sm text-amber-900/80">Ultimos 30 dias</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-amber-900/70">Checkout iniciado</p>
            <p className="mt-2 text-3xl font-bold text-amber-950">{abandonedCheckout.checkoutStartedCount}</p>
            <p className="mt-2 text-sm text-amber-900/80">Sem Pix gerado ainda</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-amber-900/70">Pix gerado</p>
            <p className="mt-2 text-3xl font-bold text-amber-950">{abandonedCheckout.pixGeneratedCount}</p>
            <p className="mt-2 text-sm text-amber-900/80">Pronto para contato operacional</p>
          </div>
        </div>

        <div className="divide-y divide-amber-200/80">
          {abandonedCheckout.items.length === 0 ? (
            <div className="px-5 py-8 text-sm text-amber-900/80">
              Nenhum abandono relevante nos ultimos 30 dias.
            </div>
          ) : (
            abandonedCheckout.items.slice(0, 5).map((item) => {
              const title = getLocalizedField<string>(asLocalizedText(item.trip.title), "pt") || "Passeio";

              return (
                <div key={item.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-amber-950">{item.user.name}</p>
                    <p className="text-sm text-amber-900/80">{item.user.email}</p>
                    <p className="mt-1 text-sm text-amber-950">
                      {String(title)} {"·"} {item.trip.city}
                    </p>
                    <p className="text-xs text-amber-900/80">
                      {item.schedule
                        ? `Agenda: ${new Date(item.schedule.startAt).toLocaleString("pt-BR")}`
                        : "Sem agenda vinculada"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className="inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-950 border border-amber-200">
                      {item.abandonedStage === "PIX_GENERATED" ? "Pix gerado" : "Checkout iniciado"}
                    </span>
                    <p className="text-sm font-semibold text-amber-950">{formatCurrency(item.totalPriceCents)}</p>
                    <p className="text-xs text-amber-900/80">
                      Ultimo sinal: {new Date(item.lastCheckoutEventAt).toLocaleString("pt-BR")}
                    </p>
                    <Link
                      href={`/pt/admin/bookings?recovery=abandoned&q=${encodeURIComponent(item.user.email)}`}
                      className="text-sm font-medium text-amber-950 underline underline-offset-4"
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

      <section className="mt-8 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Funil de conversao</h2>
          <p className="text-sm text-muted-foreground">Ultimos 30 dias entre tour, reserva e pagamento</p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-5">
          {funnelSteps.map((step) => (
            <div key={step.key} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {ANALYTICS_EVENT_LABELS[step.key]}
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">{step.count}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Conversao da etapa anterior: {step.conversionFromPrevious}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Top origens</h2>
            <p className="text-sm text-muted-foreground">Por `utm_source` nos tours visualizados</p>
          </div>
          <div className="divide-y divide-border/60">
            {analyticsAttribution.sources.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">Sem dados de origem ainda.</div>
            ) : (
              analyticsAttribution.sources.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Top campanhas</h2>
            <p className="text-sm text-muted-foreground">Por `utm_campaign` no topo do funil</p>
          </div>
          <div className="divide-y divide-border/60">
            {analyticsAttribution.campaigns.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">Sem dados de campanha ainda.</div>
            ) : (
              analyticsAttribution.campaigns.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Top referrers</h2>
            <p className="text-sm text-muted-foreground">Dominios que mais trouxeram visualizacoes</p>
          </div>
          <div className="divide-y divide-border/60">
            {analyticsAttribution.referrers.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">Sem dados de referrer ainda.</div>
            ) : (
              analyticsAttribution.referrers.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Reservas recentes</h2>
            <p className="text-sm text-muted-foreground">Ultimos 7 dias</p>
          </div>

          <div className="divide-y divide-border/60">
            {recentBookings.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">Nenhuma reserva recente.</div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{booking.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getLocalizedField<string>(asLocalizedText(booking.trip.title), "pt") || "Passeio"}
                        {" · "}
                        {booking.trip.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(booking.totalPriceCents)}</p>
                      <p className="text-xs text-muted-foreground">
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
                    <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {booking.status}
                    </span>
                    <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Proximas agendas</h2>
            <p className="text-sm text-muted-foreground">Datas futuras com ocupacao</p>
          </div>

          <div className="divide-y divide-border/60">
            {upcomingSchedules.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">Nenhuma agenda futura.</div>
            ) : (
              upcomingSchedules.map((schedule) => {
                const used = schedule.bookings.reduce((sum, booking) => sum + booking.guestCount, 0);
                const remaining = Math.max(schedule.capacity - used, 0);
                const title = getLocalizedField<string>(asLocalizedText(schedule.trip.title), "pt") || "Passeio";

                return (
                  <div key={schedule.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{String(title)}</p>
                        <p className="text-sm text-muted-foreground">
                          {schedule.trip.city} · {new Date(schedule.startAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {schedule.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-lg bg-muted/40 px-3 py-2">
                        <div className="text-xs text-muted-foreground">Capacidade</div>
                        <div className="font-semibold">{schedule.capacity}</div>
                      </div>
                      <div className="rounded-lg bg-muted/40 px-3 py-2">
                        <div className="text-xs text-muted-foreground">Ocupadas</div>
                        <div className="font-semibold">{used}</div>
                      </div>
                      <div className="rounded-lg bg-muted/40 px-3 py-2">
                        <div className="text-xs text-muted-foreground">Restantes</div>
                        <div className="font-semibold">{remaining}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Contatos recentes</h2>
          <p className="text-sm text-muted-foreground">Ultimas mensagens recebidas no site</p>
        </div>

        <div className="divide-y divide-border/60">
          {recentContacts.length === 0 ? (
            <div className="px-5 py-8 text-sm text-muted-foreground">Nenhum contato recente.</div>
          ) : (
            recentContacts.map((contact) => (
              <div key={contact.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {contact.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{contact.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
