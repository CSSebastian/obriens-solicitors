import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Eyebrow, Section } from "@/components/ui/section";
import { site, yearsInPractice } from "@/content/site";

export function History() {
  const points = [
    `Over ${Math.floor(yearsInPractice() / 5) * 5} years of legal practice`,
    "Trusted by individuals and businesses",
    "Deep roots in South Australia",
  ];

  return (
    <Section tone="navy" id="history" className="scroll-mt-24">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
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
            <Button href="/about" variant="outline-inverse">
              Learn
            </Button>
            <ArrowLink href="#services">Our services</ArrowLink>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div data-parallax className="overflow-hidden">
            <Photo
              name="gavel-and-books"
              ratio="15/16"
              position="60% center"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
