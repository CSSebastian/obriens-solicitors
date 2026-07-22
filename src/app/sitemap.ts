import type { MetadataRoute } from "next";

import { allArticles, practiceAreas, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/team",
    "/contact",
    "/insights",
    "/practice-areas",
    "/privacy-policy",
    "/terms-of-service",
    "/cookies-settings",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...practiceAreas.map((area) => ({
      url: `${site.url}/${area.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...allArticles.map((article) => ({
      url: `${site.url}/insights/${article.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
