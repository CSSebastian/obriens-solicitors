import type { Metadata } from "next";

import { JsonLd } from "@/components/site/json-ld";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/ui/section";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Home & hospital visits",
  description: `Wills, Enduring Powers of Attorney and Advance Care Directives prepared at home or in hospital across the Riverland — ${site.name}, Berri.`,
  path: "/home-hospital-visits",
  ogTitle: `Home & hospital visits — ${site.name}`,
});

const intro =
  "Planning ahead is one of the practical things you can do for your family. We help local families prepare Wills, Enduring Powers of Attorney and Advance Care Directives, explaining your options simply so your wishes are clear. As life changes, we'll help you update your plans so you can keep looking after your family for generations to come.";

const cover = [
  "Preparation of Wills, Enduring Powers of Attorney and Advance Care Directives",
  "Estate planning and division of assets",
  "Other matters, considered case by case",
  "Visits to all Riverland towns",
];

export default function HomeHospitalVisitsPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Home & hospital visits", path: "/home-hospital-visits" },
        ])}
      />
      <PageHero eyebrow="Visits" title="Home & hospital visits">
        <p className="type-body mt-6 max-w-2xl">{intro}</p>
      </PageHero>

      <Section tone="navy-deep">
        <Eyebrow>We cover</Eyebrow>
        <ul className="mt-6 flex max-w-2xl flex-col gap-3">
          {cover.map((item) => (
            <li key={item} className="flex gap-3 type-small">
              <span aria-hidden>&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        heading="Arrange a visit"
        subline={`Call ${site.phone} to arrange a visit`}
        withImage={false}
      />
    </>
  );
}
