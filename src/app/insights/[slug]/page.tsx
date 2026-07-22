import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Section } from "@/components/ui/section";
import { allArticles, articleBySlug } from "@/content/site";

export function generateStaticParams() {
  return allArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/insights/${article.slug}` },
  };
}

// TODO: replace this stub with real article content once the client supplies it.
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${article.category} · ${article.readTime}`}
        title={article.title}
        intro={article.excerpt}
      />

      <Section tone="navy-deep">
        <div className="mx-auto max-w-3xl">
          <PlaceholderImage ratio="16/9" />
          <p className="type-body mt-10 text-text-muted-on-dark">
            This article is coming soon. In the meantime, our solicitors are
            happy to answer questions about {article.category.toLowerCase()}{" "}
            matters — get in touch and we&rsquo;ll point you in the right
            direction.
          </p>
        </div>
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
