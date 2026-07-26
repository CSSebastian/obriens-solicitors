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
import { ScrollMotion } from "@/components/motion/scroll-motion";
import { CtaBand } from "@/components/site/cta-band";
import { HomeStructuredData } from "@/components/site/structured-data";
import { Section } from "@/components/ui/section";
import { practiceAreaBySlug } from "@/content/practice-areas";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

const homeTitle = `${site.name} — Solicitors in Berri, South Australia`;

export const metadata: Metadata = {
  ...createMetadata({
    title: homeTitle,
    description: site.description,
    path: "/",
  }),
  // Bypass the "%s | O'Briens Solicitors" template — the home title is complete.
  title: { absolute: homeTitle },
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
      <ScrollMotion />
      <Hero />
      <Services />

      {/* Team sits early in the pecking order (right after the services
          overview), then the practice areas flow in the site's nav order. */}
      <TeamSection />

      {/* One section per practice area — alternating tone + image side for a
          reading cadence down the long page. */}
      {conveyancing ? (
        <PracticeSection area={conveyancing} tone="navy" imageSide="right" />
      ) : null}
      {estatePlanning ? (
        <PracticeSection area={estatePlanning} tone="surface" imageSide="left" />
      ) : null}
      {commercial ? (
        <PracticeSection area={commercial} tone="navy" imageSide="right" />
      ) : null}
      {family ? (
        <PracticeSection area={family} tone="surface" imageSide="left" />
      ) : null}

      {/* Combined Criminal + Rural / Agribusiness band. */}
      {criminal && rural ? (
        <Section tone="navy">
          <div className="flex flex-col gap-16 md:gap-24">
            <PracticeAreaBlock area={criminal} onDark imageSide="right" />
            <PracticeAreaBlock area={rural} onDark imageSide="left" />
          </div>
        </Section>
      ) : null}

      <Why />
      <History />
      <Insights />
      <Faqs />
      <CtaBand />
    </>
  );
}
