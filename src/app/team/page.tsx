import type { Metadata } from "next";

import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { TeamGrid } from "@/components/site/team-grid";
import { Section } from "@/components/ui/section";
import { createMetadata } from "@/lib/page-metadata";
import { breadcrumbSchema, teamPeopleSchema } from "@/lib/structured-data";
import { getCleanContent, getContent } from "@/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCleanContent();
  return createMetadata({
    title: "Our team",
    description: `Meet the local team at ${site.name} in Berri, South Australia.`,
    path: "/team",
    ogTitle: `The team at ${site.name}`,
    siteName: site.name,
  });
}

export default async function TeamPage() {
  const { pages, team } = await getContent();
  const copy = pages.team;
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Our team", path: "/team" },
          ]),
          ...teamPeopleSchema(team),
        ]}
      />
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.heading}
        intro={copy.intro}
      />

      <Section tone="surface">
        <TeamGrid />
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
