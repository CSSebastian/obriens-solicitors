import Link from "next/link";

import { PracticeAreaIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardBody } from "@/components/ui/card";
import { Eyebrow, Section } from "@/components/ui/section";
import { practiceAreas } from "@/content/practice-areas";
import { site } from "@/content/site";

/**
 * Services overview — the six-area grid. Each card scrolls to that area's
 * section further down the home page (the hybrid one-page model).
 */
export function Services() {
  return (
    <Section tone="navy-deep" id="services" className="scroll-mt-24">
      <Reveal>
        <Eyebrow className="text-text-muted-on-dark">Services</Eyebrow>
        <h2 className="type-h2 mt-4 max-w-2xl">
          Legal expertise across six practice areas
        </h2>
        <p className="type-body mt-6 max-w-2xl text-text-muted-on-dark">
          {site.name} handles the full range of legal matters that affect
          individuals and businesses in Berri, the Riverland and across South
          Australia. Whatever brings you through our door, we have the
          experience and judgment to guide you through it.
        </p>
      </Reveal>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {practiceAreas.map((area, index) => (
          <Reveal as="li" key={area.slug} delay={(index % 3) * 80}>
            <Link
              href={`#${area.slug}`}
              className="group block h-full focus-visible:outline-none"
              aria-label={`Jump to ${area.navLabel}`}
            >
              <Card
                tone="dark"
                className="h-full transition-colors duration-200 group-hover:border-line-on-dark/45 group-focus-visible:border-line-on-dark/70"
              >
                <CardBody className="gap-4">
                  <PracticeAreaIcon
                    name={area.icon}
                    className="size-8 shrink-0"
                  />
                  <div>
                    <h3 className="type-h3">{area.title}</h3>
                    <p className="type-small mt-2 text-text-muted-on-dark">
                      {area.blurb}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
