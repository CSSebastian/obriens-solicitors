import { ArrowLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import type { Article } from "@/content/site";
import { cn } from "@/lib/cn";

function Meta({ article }: { article: Article }) {
  return (
    <div className="flex items-center gap-4">
      <span className="border border-current px-2.5 py-1 type-xs font-bold">
        {article.category}
      </span>
      <span className="type-xs font-bold text-text-muted-on-dark">
        {article.readTime}
      </span>
    </div>
  );
}

/** Large hero card at the top of "Featured reading". */
export function FeaturedArticleCard({ article }: { article: Article }) {
  return (
    <Card tone="dark">
      <PlaceholderImage ratio="3/2" />
      <CardBody className="gap-5">
        <Meta article={article} />
        <div className="flex flex-col gap-2">
          <h3 className="type-h3">{article.title}</h3>
          <p className="type-small text-text-muted-on-dark">{article.excerpt}</p>
        </div>
        <ArrowLink href={`/insights/${article.slug}`} className="mt-auto">
          Read more
        </ArrowLink>
      </CardBody>
    </Card>
  );
}

/** Compact horizontal card used in the featured column. */
export function CompactArticleCard({ article }: { article: Article }) {
  return (
    <Card tone="dark" className="sm:flex-row">
      <div className="w-full shrink-0 sm:w-[38%] sm:max-w-56">
        <PlaceholderImage ratio="3/2" className="sm:hidden" />
        <PlaceholderImage ratio="1/1" className="hidden h-full sm:flex" />
      </div>
      <CardBody className="justify-center">
        <Meta article={article} />
        <h3 className="type-h3">{article.title}</h3>
        <ArrowLink href={`/insights/${article.slug}`}>Read more</ArrowLink>
      </CardBody>
    </Card>
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
    <Card tone="dark" className={cn("h-full", className)}>
      <PlaceholderImage ratio="3/2" />
      <CardBody className="gap-4">
        <Meta article={article} />
        <div className="flex flex-col gap-2">
          <h3 className="type-h3">{article.title}</h3>
          <p className="type-small text-text-muted-on-dark">{article.excerpt}</p>
        </div>
        <ArrowLink href={`/insights/${article.slug}`} className="mt-auto pt-1">
          Read more
        </ArrowLink>
      </CardBody>
    </Card>
  );
}
