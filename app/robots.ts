import { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/lib/public-site-url";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/api/"],
        },
        sitemap: `${PUBLIC_SITE_URL}/sitemap.xml`,
    };
}
