import { Prisma, type AnalyticsEventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type TrackAnalyticsEventInput = {
  type: AnalyticsEventType;
  userId?: string;
  tripId?: string;
  bookingId?: string;
  paymentAttemptId?: string;
  sessionId?: string;
  path?: string;
  metadata?: Prisma.InputJsonValue;
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
      metadata: input.metadata,
    },
  });
}

export async function getAnalyticsFunnelSummary(since: Date) {
  const grouped = await prisma.analyticsEvent.groupBy({
    by: ["type"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });

  const counts: Record<AnalyticsEventType, number> = {
    TOUR_VIEWED: 0,
    RESERVE_CLICKED: 0,
    CHECKOUT_STARTED: 0,
    PIX_GENERATED: 0,
    PAYMENT_CONFIRMED: 0,
  };

  for (const item of grouped) {
    counts[item.type] = item._count._all;
  }

  return counts;
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
