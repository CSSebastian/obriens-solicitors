import { ArrowLink, Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Eyebrow, Section } from "@/components/ui/section";
import { site, yearsInPractice } from "@/content/site";

export function History() {
  const points = [
    `Over ${Math.floor(yearsInPractice() / 5) * 5} years of legal practice`,
    "Trusted by individuals and businesses",
    "Deep roots in South Australia",
  ];

  return (
    <Section tone="navy">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>History</Eyebrow>
          <h2 className="type-h2 mt-4">Built on trust, rooted in Berri</h2>
          <p className="type-body mt-6 max-w-lg">
            {`Since ${site.established}, ${site.name} has been part of this community. We’ve grown with Berri, learned its rhythms, and earned the confidence of generations.`}
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 type-small">
                <span aria-hidden>&bull;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/about" variant="outline-light">
              Learn
            </Button>
            <ArrowLink href="/practice-areas">Areas</ArrowLink>
          </div>
        </div>

        <PlaceholderImage ratio="15/16" />
      </div>
    </Section>
  );
}
