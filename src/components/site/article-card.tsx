import { ArrowLink } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import type { Article } from "@/content/site";
import { cn } from "@/lib/cn";

function Meta({ article }: { article: Article }) {
  return (
    <div className="flex items-center gap-4">
      <span className="border border-current px-2.5 py-1 type-xs font-bold">
        {article.category}
      </span>
      <span className="type-xs font-bold">{article.readTime}</span>
    </div>
  );
}

/** Large hero card at the top of "Featured reading". */
export function FeaturedArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex flex-col gap-5">
      <PlaceholderImage ratio="3/2" />
      <Meta article={article} />
      <div className="flex flex-col gap-2">
        <h3 className="type-h3">{article.title}</h3>
        <p className="type-small text-text-muted-on-dark">{article.excerpt}</p>
      </div>
      <ArrowLink href={`/insights/${article.slug}`}>Read more</ArrowLink>
    </article>
  );
}

/** Compact horizontal card used in the featured column. */
export function CompactArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex flex-col gap-4 md:flex-row md:gap-6">
      <div className="w-full shrink-0 md:w-[38%] md:max-w-62">
        {/* Square crop on desktop; the mobile design uses a wide crop. */}
        <PlaceholderImage ratio="3/2" className="md:hidden" />
        <PlaceholderImage ratio="1/1" className="hidden md:flex" />
      </div>
      <div className="flex flex-col gap-3 md:self-center">
        <Meta article={article} />
        <h3 className="type-h3">{article.title}</h3>
        <ArrowLink href={`/insights/${article.slug}`}>Read more</ArrowLink>
      </div>
    </article>
  );
}

/** Standard card used in "Recent articles" and on /insights. */
export function ArticleCard({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col gap-4", className)}>
      <PlaceholderImage ratio="3/2" />
      <Meta article={article} />
      <div className="flex flex-col gap-2">
        <h3 className="type-h3">{article.title}</h3>
        <p className="type-small text-text-muted-on-dark">{article.excerpt}</p>
      </div>
      <ArrowLink href={`/insights/${article.slug}`} className="mt-1">
        Read more
      </ArrowLink>
    </article>
  );
}
