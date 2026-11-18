import { Reveal } from "@/components/motion/reveal";
import {
  CompactArticleCard,
  FeaturedArticleCard,
} from "@/components/site/article-card";
import { ArrowLink } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/section";
import { splitArticles } from "@/content/lookups";
import { getContent } from "@/sanity/content";

/**
 * Home-page Insights — collapsed: the featured article plus the other launch articles,
 * then a link to the full /insights page. The complete archive lives there.
 */
export async function Insights() {
  const { home, articles } = await getContent();
  const copy = home.insights;
  const { featured, recent: others } = splitArticles(articles);
  const recent = others.slice(0, 3);

  return (
    <Section tone="navy-deep" id="insights" className="scroll-mt-38">
      <Reveal>
        <Eyebrow className="text-text-muted-on-dark">{copy.eyebrow}</Eyebrow>
        <h2 className="type-h2 mt-4 max-w-2xl">{copy.heading}</h2>
        <p className="type-body mt-5 max-w-2xl text-text-muted-on-dark">
          {copy.intro}
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-2">
        {featured ? (
          <Reveal>
            <FeaturedArticleCard article={featured} />
          </Reveal>
        ) : null}
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
