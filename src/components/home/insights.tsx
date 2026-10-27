import { Reveal } from "@/components/motion/reveal";
import {
  CompactArticleCard,
  FeaturedArticleCard,
} from "@/components/site/article-card";
import { ArrowLink } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/section";
import { featuredArticle, recentArticles } from "@/content/site";

/**
 * Home-page Insights — collapsed: the featured article plus three recent cards,
 * then a link to the full /insights page. The complete archive lives there.
 */
export function Insights() {
  const recent = recentArticles.slice(0, 3);

  return (
    <Section tone="navy-deep" id="insights" className="scroll-mt-38">
      <Reveal>
        <Eyebrow className="text-text-muted-on-dark">Insights</Eyebrow>
        <h2 className="type-h2 mt-4 max-w-2xl">
          Practical guidance from our solicitors
        </h2>
        <p className="type-body mt-5 max-w-2xl text-text-muted-on-dark">
          Plain-language notes on the legal questions we are asked most often.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-2">
        <Reveal>
          <FeaturedArticleCard article={featuredArticle} />
        </Reveal>
        <ul className="flex flex-col gap-8">
          {recent.map((article, index) => (
            <Reveal as="li" key={article.slug} delay={index * 90}>
              <CompactArticleCard article={article} />
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal className="mt-12">
        <ArrowLink href="/insights">See all insights</ArrowLink>
      </Reveal>
    </Section>
  );
}
