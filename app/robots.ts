import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site";

/** Auto-served at /robots.txt by the App Router's file convention. `/dev/` is already gated behind a real 404 in production (see app/dev/gallery/page.tsx) — disallowed here too so crawlers never even try it. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dev/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
