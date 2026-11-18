import type { Metadata } from "next";

import { JsonLd } from "@/components/site/json-ld";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/page-metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getCleanContent, getContent } from "@/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCleanContent();
  return createMetadata({
    title: "Home & hospital visits",
    description: `Wills, Enduring Powers of Attorney and Advance Care Directives prepared at home or in hospital across the Riverland — ${site.name}, Berri.`,
    path: "/home-hospital-visits",
    ogTitle: `Home & hospital visits — ${site.name}`,
    siteName: site.name,
  });
}

export default async function HomeHospitalVisitsPage() {
  const { visits } = await getContent();
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Home & hospital visits", path: "/home-hospital-visits" },
        ])}
      />
      <PageHero eyebrow={visits.eyebrow} title={visits.title}>
        <p className="type-body mt-6 max-w-2xl">{visits.intro}</p>
      </PageHero>

      <Section tone="navy-deep">
        <Eyebrow>{visits.coverLabel}</Eyebrow>
        <ul className="mt-6 flex max-w-2xl flex-col gap-3">
          {visits.cover.map((item) => (
            <li key={item} className="flex gap-3 type-small">
              <span aria-hidden>&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        heading={visits.ctaHeading}
        subline={visits.ctaSubline}
        withImage={false}
      />
    </>
  );
}
