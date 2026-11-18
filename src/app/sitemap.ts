import type { MetadataRoute } from "next";

import { SITE_URL } from "@/content/constants";
import { isPublished } from "@/content/lookups";
import { getCleanContent } from "@/sanity/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { practiceAreas, articles } = await getCleanContent();
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/team",
    "/contact",
    "/insights",
    "/practice-areas",
    "/home-hospital-visits",
    "/privacy-policy",
    "/terms-of-service",
    "/disclaimer",
    "/cookies-settings",
    "/aml-policy",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...practiceAreas
      .filter((area) => area.hasPage)
      .map((area) => ({
        url: `${SITE_URL}/${area.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    // Placeholder articles stay out of the sitemap until they have a body.
    ...articles.filter(isPublished).map((article) => ({
      url: `${SITE_URL}/insights/${article.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
