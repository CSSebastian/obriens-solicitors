import type { Metadata } from "next";

import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { TeamGrid } from "@/components/site/team-grid";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Our team",
  description: `Meet the solicitors at ${site.name} in Berri, South Australia.`,
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="People"
        title="The solicitors"
        intro="Meet the team who handles your case."
      />

      <Section tone="surface">
        <TeamGrid />
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
