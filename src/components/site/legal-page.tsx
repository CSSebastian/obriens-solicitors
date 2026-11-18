import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/site/rich-text";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/page-metadata";
import { getCleanContent, getContent } from "@/sanity/content";

/**
 * The footer legal pages (privacy, terms, disclaimer, cookies, AML). Each keeps
 * its own route folder for a fixed URL; the wording is edited in Sanity under
 * "Legal pages" (approved by O'Briens on 9 Nov 2026).
 */
export function legalRoute(slug: string) {
  async function generateMetadata(): Promise<Metadata> {
    const { site, legal } = await getCleanContent();
    const doc = legal.find((page) => page.slug === slug);
    if (!doc) return {};
    return createMetadata({
      title: doc.title,
      description: doc.metaDescription || doc.intro,
      path: `/${slug}`,
      siteName: site.name,
    });
  }

  async function Page() {
    const { legal } = await getContent();
    const doc = legal.find((page) => page.slug === slug);
    if (!doc) notFound();
    return (
      <>
        <PageHero eyebrow="Legal" title={doc.title} intro={doc.intro} />
        <Section tone="navy-deep">
          <RichText value={doc.body} muted className="max-w-3xl" />
        </Section>
      </>
    );
  }

  return { generateMetadata, Page };
}
