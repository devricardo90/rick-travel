import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { PUBLIC_SITE_URL } from "@/lib/public-site-url";

type SitemapTrip = {
  id: string;
  createdAt: Date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = PUBLIC_SITE_URL;
  const staticRoutes = ["", "/tours", "/login", "/register", "/quem-somos", "/contato"];

  const routes = routing.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.8,
    }))
  );

  let trips: SitemapTrip[] = [];

  try {
    trips = await prisma.trip.findMany({
      where: { isPublished: true },
      select: { id: true, createdAt: true },
    });
  } catch (error) {
    console.error("Error fetching trips for sitemap:", error);
  }

  const tripRoutes = routing.locales.flatMap((locale) =>
    trips.map((trip) => ({
      url: `${baseUrl}/${locale}/tours/${trip.id}`,
      lastModified: trip.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...routes, ...tripRoutes];
}
