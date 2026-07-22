import { RecentArticles } from "@/components/home/recent-articles";
import {
  CompactArticleCard,
  FeaturedArticleCard,
} from "@/components/site/article-card";
import { Eyebrow, Section } from "@/components/ui/section";
import { featuredArticle, featuredSecondary, recentArticles } from "@/content/site";

export function Insights() {
  return (
    <Section tone="navy-deep">
      <Eyebrow>Insights</Eyebrow>
      <h2 className="type-h2 mt-4 max-w-2xl">{featuredArticle.title}</h2>
      <p className="type-small mt-5 text-text-muted-on-dark">
        Practical guidance from our solicitors
      </p>

      <h3 className="type-h3 mt-14 md:mt-20">Featured reading</h3>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
        <FeaturedArticleCard article={featuredArticle} />
        <ul className="flex flex-col gap-8">
          {featuredSecondary.map((article) => (
            <li key={article.slug}>
              <CompactArticleCard article={article} />
            </li>
          ))}
        </ul>
      </div>

      <h3 className="type-h3 mt-16 md:mt-24">Recent articles</h3>
      <div className="mt-8">
        <RecentArticles articles={recentArticles} />
      </div>
    </Section>
  );
}
