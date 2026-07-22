import type { Metadata } from "next";
import Link from "next/link";

import { PracticeAreaIcon } from "@/components/icons";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { ArrowLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { practiceAreas, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Practice areas",
  description: `The legal matters ${site.name} handles across Berri, the Riverland and South Australia.`,
  alternates: { canonical: "/practice-areas" },
};

export default function PracticeAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Practice areas"
        intro={`${site.name} handles the full range of legal matters that affect individuals and businesses in South Australia.`}
      />

      <Section tone="navy-deep">
        <ul className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {practiceAreas.map((area) => (
            <li key={area.slug} className="flex gap-5">
              <PracticeAreaIcon name={area.icon} className="size-8 shrink-0" />
              <div>
                <h2 className="type-h3">
                  <Link
                    href={`/${area.slug}`}
                    className="transition-opacity hover:opacity-80"
                  >
                    {area.title}
                  </Link>
                </h2>
                <p className="type-small mt-3 text-text-muted-on-dark">
                  {area.intro}
                </p>
                <ArrowLink href={`/${area.slug}`} className="mt-4">
                  Read more
                </ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
