import { prisma } from "@/lib/prisma";
import { ANALYTICS_EVENT_TYPES, type AnalyticsEventName } from "@/lib/analytics/events";

type TrackAnalyticsEventInput = {
  type: AnalyticsEventName;
  userId?: string;
  tripId?: string;
  bookingId?: string;
  paymentAttemptId?: string;
  sessionId?: string;
  path?: string;
  metadata?: unknown;
};

export async function trackAnalyticsEvent(input: TrackAnalyticsEventInput) {
  return prisma.analyticsEvent.create({
    data: {
      type: input.type,
      userId: input.userId,
      tripId: input.tripId,
      bookingId: input.bookingId,
      paymentAttemptId: input.paymentAttemptId,
      sessionId: input.sessionId,
      path: input.path,
      metadata: input.metadata as Parameters<typeof prisma.analyticsEvent.create>[0]["data"]["metadata"],
    },
  });
}

export async function getAnalyticsFunnelSummary(since: Date) {
  const eventTypes = ANALYTICS_EVENT_TYPES;

  const entries = await Promise.all(
    eventTypes.map(async (type) => {
      const count = await prisma.analyticsEvent.count({
        where: {
          type,
          createdAt: { gte: since },
        },
      });

      return [type, count] as const;
    })
  );

  return Object.fromEntries(entries) as Record<AnalyticsEventName, number>;
}

type AttributionRow = {
  label: string | null;
  count: bigint | number;
};

export async function getAnalyticsAttributionSummary(since: Date) {
  const [sources, campaigns, referrers] = await Promise.all([
    prisma.$queryRaw<AttributionRow[]>`
      SELECT COALESCE(metadata->>'utmSource', 'Direto / nao identificado') AS label, COUNT(*) AS count
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since} AND "type" = 'TOUR_VIEWED'
      GROUP BY 1
      ORDER BY COUNT(*) DESC
      LIMIT 5
    `,
    prisma.$queryRaw<AttributionRow[]>`
      SELECT COALESCE(metadata->>'utmCampaign', 'Sem campanha') AS label, COUNT(*) AS count
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since} AND "type" = 'TOUR_VIEWED'
      GROUP BY 1
      ORDER BY COUNT(*) DESC
      LIMIT 5
    `,
    prisma.$queryRaw<AttributionRow[]>`
      SELECT COALESCE(metadata->>'referrerDomain', 'Acesso direto') AS label, COUNT(*) AS count
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${since} AND "type" = 'TOUR_VIEWED'
      GROUP BY 1
      ORDER BY COUNT(*) DESC
      LIMIT 5
    `,
  ]);

  return {
    sources: sources.map((item) => ({
      label: item.label ?? "Direto / nao identificado",
      count: Number(item.count),
    })),
    campaigns: campaigns.map((item) => ({
      label: item.label ?? "Sem campanha",
      count: Number(item.count),
    })),
    referrers: referrers.map((item) => ({
      label: item.label ?? "Acesso direto",
      count: Number(item.count),
    })),
  };
}

const ABANDONED_CHECKOUT_EVENT_TYPES: AnalyticsEventName[] = [
  "CHECKOUT_STARTED",
  "PIX_GENERATED",
];

type AbandonedCheckoutEvent = {
  type: AnalyticsEventName;
  createdAt: Date;
};

function getMostAdvancedAbandonedStage(events: AbandonedCheckoutEvent[]) {
  const hasPixGenerated = events.some((event) => event.type === "PIX_GENERATED");

  if (hasPixGenerated) {
    return "PIX_GENERATED" as const;
  }

  return "CHECKOUT_STARTED" as const;
}

export async function getAbandonedCheckoutSummary(since: Date) {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: since },
      status: "PENDING",
      paymentStatus: "UNPAID",
      analyticsEvents: {
        some: {
          type: { in: ABANDONED_CHECKOUT_EVENT_TYPES },
          createdAt: { gte: since },
        },
        none: {
          type: "PAYMENT_CONFIRMED",
          createdAt: { gte: since },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      trip: {
        select: {
          title: true,
          city: true,
        },
      },
      schedule: {
        select: {
          startAt: true,
        },
      },
      analyticsEvents: {
        where: {
          type: { in: ABANDONED_CHECKOUT_EVENT_TYPES },
          createdAt: { gte: since },
        },
        orderBy: { createdAt: "desc" },
        select: {
          type: true,
          createdAt: true,
        },
      },
    },
  });

  const items = bookings.map((booking) => {
    const stage = getMostAdvancedAbandonedStage(booking.analyticsEvents);
    const lastEventAt = booking.analyticsEvents[0]?.createdAt ?? booking.updatedAt;

    return {
      id: booking.id,
      user: booking.user,
      trip: booking.trip,
      schedule: booking.schedule,
      totalPriceCents: booking.totalPriceCents,
      createdAt: booking.createdAt,
      abandonedStage: stage,
      lastCheckoutEventAt: lastEventAt,
    };
  });

  const pixGeneratedCount = items.filter((item) => item.abandonedStage === "PIX_GENERATED").length;
  const checkoutStartedCount = items.length - pixGeneratedCount;

  return {
    total: items.length,
    checkoutStartedCount,
    pixGeneratedCount,
    items,
  };
}
