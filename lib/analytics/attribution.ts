export const ANALYTICS_ATTRIBUTION_COOKIE = "ricktravel_analytics_attribution";

export type AnalyticsAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  referrerDomain?: string;
  landingPath?: string;
  firstSeenAt?: string;
};

export function normalizeAttributionValue(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 200) : undefined;
}

export function getReferrerDomain(referrer: string | null | undefined) {
  const normalized = normalizeAttributionValue(referrer);

  if (!normalized) {
    return undefined;
  }

  try {
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function parseAttributionCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as AnalyticsAttribution;
  } catch {
    return null;
  }
}

export function serializeAttributionCookie(value: AnalyticsAttribution) {
  return encodeURIComponent(JSON.stringify(value));
}

export function buildAttributionFromUrl(input: {
  pathname: string;
  searchParams: URLSearchParams;
  referrer?: string | null;
  existing?: AnalyticsAttribution | null;
}) {
  const existing = input.existing ?? null;
  const utmSource = normalizeAttributionValue(input.searchParams.get("utm_source"));
  const utmMedium = normalizeAttributionValue(input.searchParams.get("utm_medium"));
  const utmCampaign = normalizeAttributionValue(input.searchParams.get("utm_campaign"));
  const utmContent = normalizeAttributionValue(input.searchParams.get("utm_content"));
  const utmTerm = normalizeAttributionValue(input.searchParams.get("utm_term"));
  const referrer = normalizeAttributionValue(input.referrer);
  const referrerDomain = getReferrerDomain(referrer);

  const hasNewAttribution = Boolean(
    utmSource || utmMedium || utmCampaign || utmContent || utmTerm || referrerDomain
  );

  if (!existing && !hasNewAttribution) {
    return null;
  }

  return {
    utmSource: utmSource ?? existing?.utmSource,
    utmMedium: utmMedium ?? existing?.utmMedium,
    utmCampaign: utmCampaign ?? existing?.utmCampaign,
    utmContent: utmContent ?? existing?.utmContent,
    utmTerm: utmTerm ?? existing?.utmTerm,
    referrer: referrer ?? existing?.referrer,
    referrerDomain: referrerDomain ?? existing?.referrerDomain,
    landingPath: existing?.landingPath ?? input.pathname,
    firstSeenAt: existing?.firstSeenAt ?? new Date().toISOString(),
  } satisfies AnalyticsAttribution;
}
