import type { Metadata } from "next";

import { ArticleCard } from "@/components/site/article-card";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { allArticles, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Insights",
  description: `Practical legal guidance from the solicitors at ${site.name}.`,
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Practical guidance from our solicitors"
        intro="Plain-language notes on the legal questions we are asked most often."
      />

      <Section tone="navy-deep">
        <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {allArticles.map((article) => (
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
