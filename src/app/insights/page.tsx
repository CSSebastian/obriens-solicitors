import type { Metadata } from "next";

import { ArticleCard } from "@/components/site/article-card";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/page-metadata";
import { getCleanContent, getContent } from "@/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCleanContent();
  return createMetadata({
    title: "Insights",
    description: `Practical legal guidance from the solicitors at ${site.name}.`,
    path: "/insights",
    ogTitle: `Legal insights from ${site.name}`,
    siteName: site.name,
  });
}

export default async function InsightsPage() {
  const { pages, articles } = await getContent();
  const copy = pages.insights;
  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.heading}
        intro={copy.intro}
      />

      <Section tone="navy-deep">
        <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
