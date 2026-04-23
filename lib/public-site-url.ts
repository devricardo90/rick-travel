const DEFAULT_PUBLIC_SITE_URL = "https://rick-travel.vercel.app";

function normalizeUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getPublicSiteUrl() {
  const envUrl = process.env.PUBLIC_SITE_URL?.trim();

  if (envUrl && envUrl.startsWith("https://") && !envUrl.includes("localhost")) {
    return normalizeUrl(envUrl);
  }

  return DEFAULT_PUBLIC_SITE_URL;
}

export const PUBLIC_SITE_URL = getPublicSiteUrl();
