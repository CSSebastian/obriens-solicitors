import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/site/rich-text";
import { Photo } from "@/components/ui/photo";
import { Section } from "@/components/ui/section";
import { articleBySlug, isPublished } from "@/content/lookups";
import { createMetadata } from "@/lib/page-metadata";
import { getCleanContent, getContent } from "@/sanity/content";

export async function generateStaticParams() {
  const { articles } = await getCleanContent();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { site, articles } = await getCleanContent();
  const article = articleBySlug(articles, slug);
  if (!article) return { title: "Article not found" };
  const metadata = createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    siteName: site.name,
  });
  // Placeholder articles stay out of search results until they have a body.
  return isPublished(article)
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { articles } = await getContent();
  const article = articleBySlug(articles, slug);
  if (!article) notFound();
  const published = isPublished(article);

  return (
    <>
      <PageHero
        eyebrow={
          published
            ? `${article.category} · ${article.readTime}`
            : `${article.category} · Coming soon`
        }
        title={article.title}
        intro={article.excerpt}
      />

      <Section tone="navy-deep">
        <div className="mx-auto max-w-3xl">
          <Photo
            image={article.image}
            ratio="16/9"
            sizes="(min-width: 768px) 768px, 100vw"
          />
          {published ? (
            <RichText value={article.body!} className="mt-10 gap-5" />
          ) : (
            <p className="type-body mt-10 text-text-muted-on-dark">
              This article is coming soon. In the meantime, our solicitors are
              happy to answer questions about {article.category.toLowerCase()}{" "}
              matters — get in touch and we&rsquo;ll point you in the right
              direction.
            </p>
          )}
        </div>
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
