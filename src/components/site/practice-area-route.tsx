import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeAreaPage } from "@/components/site/practice-area-page";
import { practiceAreaBySlug } from "@/content/lookups";
import { createMetadata } from "@/lib/page-metadata";
import { getCleanContent, getContent } from "@/sanity/content";

/**
 * The metadata and page for one practice area's deep page. Each area keeps
 * its own route folder (fixed URLs for SEO); the content comes from Sanity.
 */
export function practiceAreaRoute(slug: string) {
  async function generateMetadata(): Promise<Metadata> {
    const { site, practiceAreas } = await getCleanContent();
    const area = practiceAreaBySlug(practiceAreas, slug);
    if (!area) return {};
    return createMetadata({
      title: area.metaTitle,
      description: area.metaDescription,
      path: `/${area.slug}`,
      siteName: site.name,
    });
  }

  async function Page() {
    const { practiceAreas } = await getContent();
    const area = practiceAreaBySlug(practiceAreas, slug);
    if (!area) notFound();
    return <PracticeAreaPage area={area} />;
  }

  return { generateMetadata, Page };
}
