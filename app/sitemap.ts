import type { MetadataRoute } from "next";
import { getWorkProjects, getLabProjects } from "@/lib/content/projects";
import { siteConfig } from "@/lib/content/site";

/**
 * Auto-served at /sitemap.xml by the App Router's file convention. `test-*`
 * slugs (scratch entries for previewing content-block types) are excluded —
 * they're not real content and aren't meant to be indexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/works`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/lab`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = [...getWorkProjects(), ...getLabProjects()]
    .filter((project) => !project.core.slug.startsWith("test-"))
    .map((project) => ({
      url: `${siteConfig.url}/${project.core.section}/${project.core.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...projectRoutes];
}
