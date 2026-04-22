import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  ANALYTICS_ATTRIBUTION_COOKIE,
  parseAttributionCookie,
} from "@/lib/analytics/attribution";
import { auth } from "@/lib/auth";
import { ANALYTICS_EVENT_TYPES } from "@/lib/analytics/events";
import { trackAnalyticsEvent } from "@/lib/services/analytics.service";

type AnalyticsEventType = Prisma.AnalyticsEventGetPayload<{ select: { type: true } }>["type"];

function isAnalyticsEventType(value: string): value is AnalyticsEventType {
  return ANALYTICS_EVENT_TYPES.includes(value as AnalyticsEventType);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = typeof body?.type === "string" ? body.type.trim() : "";

    if (!isAnalyticsEventType(type)) {
      return NextResponse.json({ error: "Evento de analytics invalido" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const requestHeaders = await headers();
    const cookieHeader = requestHeaders.get("cookie") ?? "";
    const attributionCookie = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${ANALYTICS_ATTRIBUTION_COOKIE}=`))
      ?.slice(`${ANALYTICS_ATTRIBUTION_COOKIE}=`.length);
    const attribution = parseAttributionCookie(attributionCookie);
    const requestMetadata =
      body?.metadata && typeof body.metadata === "object"
        ? (body.metadata as Record<string, unknown>)
        : null;

    await trackAnalyticsEvent({
      type,
      userId: session?.user.id,
      tripId: typeof body?.tripId === "string" ? body.tripId.trim() : undefined,
      bookingId: typeof body?.bookingId === "string" ? body.bookingId.trim() : undefined,
      paymentAttemptId:
        typeof body?.paymentAttemptId === "string" ? body.paymentAttemptId.trim() : undefined,
      sessionId: typeof body?.sessionId === "string" ? body.sessionId.trim() : undefined,
      path: typeof body?.path === "string" ? body.path.trim() : undefined,
      metadata: {
        ...(attribution ?? {}),
        ...(requestMetadata ?? {}),
      } as Prisma.InputJsonValue,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao registrar analytics" }, { status: 500 });
  }
}
