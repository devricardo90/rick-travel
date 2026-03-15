"use client";

import type { AnalyticsEventName } from "@/lib/analytics/events";

const SESSION_STORAGE_KEY = "ricktravel-analytics-session-id";

type ClientAnalyticsPayload = {
  type: AnalyticsEventName;
  tripId?: string;
  bookingId?: string;
  paymentAttemptId?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const next = window.crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, next);
  return next;
}

export async function trackClientEvent(payload: ClientAnalyticsPayload) {
  const body = JSON.stringify({
    ...payload,
    sessionId: getSessionId(),
    path: payload.path ?? window.location.pathname,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  await fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    keepalive: true,
    body,
  }).catch(() => undefined);
}
