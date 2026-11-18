import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/ui/photo";
import { Section } from "@/components/ui/section";
import { allArticles, articleBySlug, isPublished } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

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
  const metadata = createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
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
  const article = articleBySlug(slug);
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
            name={article.image}
            ratio="16/9"
            sizes="(min-width: 768px) 768px, 100vw"
          />
          {published ? (
            <div className="mt-10 flex flex-col gap-5">
              {article.body!.map((paragraph) => (
                <p key={paragraph} className="type-body">
                  {paragraph}
                </p>
              ))}
            </div>
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
