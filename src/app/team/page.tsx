import type { Metadata } from "next";

import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { TeamGrid } from "@/components/site/team-grid";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";
import { breadcrumbSchema, teamPeopleSchema } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Our team",
  description: `Meet the local team at ${site.name} in Berri, South Australia.`,
  path: "/team",
  ogTitle: `The team at ${site.name}`,
});

export default function TeamPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Our team", path: "/team" },
          ]),
          ...teamPeopleSchema(),
        ]}
      />
      <PageHero
        eyebrow="People"
        title="Our people"
        intro="Meet the local team who'll look after you."
      />

      <Section tone="surface">
        <TeamGrid />
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
