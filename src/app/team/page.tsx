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
  description: `Meet the solicitors at ${site.name} in Berri, South Australia.`,
  path: "/team",
  ogTitle: `The solicitors at ${site.name}`,
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
          // Empty until the client's real solicitors replace the placeholders.
          ...teamPeopleSchema(),
        ]}
      />
      <PageHero
        eyebrow="People"
        title="Our people"
        intro="Meet the directors, solicitors and support team behind every matter."
      />

      <Section tone="surface">
        <TeamGrid />
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
