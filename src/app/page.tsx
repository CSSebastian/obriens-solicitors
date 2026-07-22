import type { Metadata } from "next";

import { Faqs } from "@/components/home/faqs";
import { Hero } from "@/components/home/hero";
import { History } from "@/components/home/history";
import { Insights } from "@/components/home/insights";
import {
  PracticeAreaBlock,
  PracticeSection,
} from "@/components/home/practice-section";
import { Services } from "@/components/home/services";
import { TeamSection } from "@/components/home/team-section";
import { Why } from "@/components/home/why";
import { CtaBand } from "@/components/site/cta-band";
import { HomeStructuredData } from "@/components/site/structured-data";
import { Section } from "@/components/ui/section";
import { practiceAreaBySlug } from "@/content/practice-areas";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — Solicitors in Berri, South Australia`,
  description: site.description,
  alternates: { canonical: "/" },
};

const conveyancing = practiceAreaBySlug("conveyancing");
const estatePlanning = practiceAreaBySlug("estate-planning");
const commercial = practiceAreaBySlug("commercial-law");
const family = practiceAreaBySlug("family-law");
const criminal = practiceAreaBySlug("criminal-law");
const rural = practiceAreaBySlug("rural-agribusiness");

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <Hero />
      <Services />

      {/* One section per practice area — alternating tone + image side for a
          reading cadence down the long page. */}
      {conveyancing ? (
        <PracticeSection area={conveyancing} tone="surface" imageSide="right" />
      ) : null}
      {estatePlanning ? (
        <PracticeSection area={estatePlanning} tone="navy" imageSide="left" />
      ) : null}
      {commercial ? (
        <PracticeSection area={commercial} tone="surface" imageSide="right" />
      ) : null}
      {family ? (
        <PracticeSection area={family} tone="navy" imageSide="left" />
      ) : null}

      {/* Combined Criminal + Rural / Agribusiness band. */}
      {criminal && rural ? (
        <Section tone="surface">
          <div className="flex flex-col gap-16 md:gap-24">
            <PracticeAreaBlock area={criminal} onDark={false} imageSide="right" />
            <PracticeAreaBlock area={rural} onDark={false} imageSide="left" />
          </div>
        </Section>
      ) : null}

      <Why />
      <History />
      <TeamSection />
      <Insights />
      <Faqs />
      <CtaBand />
    </>
  );
}
