import type { Metadata } from "next";
import Link from "next/link";

import { PracticeAreaIcon } from "@/components/icons";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { ArrowLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/page-metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getCleanContent, getContent } from "@/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCleanContent();
  return createMetadata({
    title: "Practice areas",
    description: `The legal matters ${site.name} handles across Berri, the Riverland and South Australia.`,
    path: "/practice-areas",
    ogTitle: `Practice areas — ${site.name}`,
    siteName: site.name,
  });
}

export default async function PracticeAreasPage() {
  const { pages, practiceAreas } = await getContent();
  const copy = pages.practiceAreas;
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice areas", path: "/practice-areas" },
        ])}
      />
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.heading}
        intro={copy.intro}
      />

      <Section tone="navy-deep">
        <ul className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {practiceAreas.map((area) => {
            // Areas with a deep page link to it; any without one link to their
            // home-page section.
            const href = area.hasPage ? `/${area.slug}` : `/#${area.slug}`;
            return (
              <li key={area.slug} className="flex gap-5">
                <PracticeAreaIcon name={area.icon} className="size-8 shrink-0" />
                <div>
                  <h2 className="type-h3">
                    <Link
                      href={href}
                      className="transition-opacity hover:opacity-80"
                    >
                      {area.title}
                    </Link>
                  </h2>
                  <p className="type-small mt-3 text-text-muted-on-dark">
                    {area.blurb}
                  </p>
                  <ArrowLink href={href} className="mt-4">
                    Read more
                  </ArrowLink>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
