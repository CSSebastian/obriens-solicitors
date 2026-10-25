import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";

import { Areas } from "@/components/home/areas";
import { Community } from "@/components/home/community";
import { Faqs } from "@/components/home/faqs";
import { Hero } from "@/components/home/hero";
import { History } from "@/components/home/history";
import { Insights } from "@/components/home/insights";
import { PracticeAreaBlock } from "@/components/home/practice-section";
import { Services } from "@/components/home/services";
import { TeamSection } from "@/components/home/team-section";
import { Why } from "@/components/home/why";
import { ScrollMotion } from "@/components/motion/scroll-motion";
import { CtaBand } from "@/components/site/cta-band";
import { HomeStructuredData } from "@/components/site/structured-data";
import { Section, type SectionTone } from "@/components/ui/section";
import {
  type HomeBlockId,
  type HomeSection,
  homeSections,
} from "@/content/home-sections";
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

/**
 * Renderer for each non-practice section. Keyed by `HomeBlockId`, so the record
 * is exhaustive: adding a block to `homeSections` will not compile until it has
 * a renderer here. Order lives in `homeSections`, never in this map.
 */
/** Background tone of each block, so practice bands can alternate against it. */
const blockTones: Record<HomeBlockId, SectionTone> = {
  services: "navy-deep",
  team: "surface",
  why: "navy",
  areas: "navy-deep",
  community: "surface",
  history: "navy",
  insights: "navy-deep",
  faqs: "surface",
};

const blocks: Record<HomeBlockId, ReactNode> = {
  services: <Services />,
  team: <TeamSection />,
  why: <Why />,
  areas: <Areas />,
  community: <Community />,
  history: <History />,
  insights: <Insights />,
  faqs: <Faqs />,
};

/** A block section, or a coloured band holding one or more practice areas. */
type RenderGroup =
  | { kind: "block"; id: HomeBlockId }
  | { kind: "practice"; ids: string[] };

/**
 * Fold the section sequence into render groups: consecutive practice areas
 * marked `sharesBand` join the preceding band instead of opening a new one.
 * Purely a grouping pass — it never reorders.
 */
function groupSections(sections: HomeSection[]): RenderGroup[] {
  const groups: RenderGroup[] = [];
  for (const section of sections) {
    const previous = groups.at(-1);
    if (section.kind === "block") {
      groups.push({ kind: "block", id: section.id });
    } else if (
      section.sharesBand &&
      previous?.kind === "practice"
    ) {
      previous.ids.push(section.id);
    } else {
      groups.push({ kind: "practice", ids: [section.id] });
    }
  }
  return groups;
}

/** A render group with its resolved tone and band position. */
type PlannedGroup =
  | { kind: "block"; id: HomeBlockId }
  | { kind: "practice"; ids: string[]; tone: SectionTone; band: number };

/**
 * Bands alternate tone and image side down the page for a reading cadence,
 * derived from the band's position (and the tone of the section before it)
 * rather than hand-assigned per section — so reordering home-sections.ts keeps
 * the alternation intact and never stacks two identical tones. Pure: no state
 * is mutated during render.
 */
function planGroups(groups: RenderGroup[]): PlannedGroup[] {
  let band = 0;
  let previousTone: SectionTone = "navy"; // the hero
  return groups.map((group): PlannedGroup => {
    if (group.kind === "block") {
      previousTone = blockTones[group.id];
      return group;
    }
    const tone: SectionTone = previousTone === "surface" ? "navy" : "surface";
    previousTone = tone;
    return { kind: "practice", ids: group.ids, tone, band: band++ };
  });
}

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <ScrollMotion />
      <Hero />

      {planGroups(groupSections(homeSections)).map((group) => {
        if (group.kind === "block") {
          return <Fragment key={group.id}>{blocks[group.id]}</Fragment>;
        }

        const areas = group.ids
          .map((slug) => practiceAreaBySlug(slug))
          .filter((area) => area !== undefined);
        if (!areas.length) return null;

        const { band, tone } = group;
        const onDark = tone === "navy";

        return (
          <Section key={group.ids[0]} tone={tone}>
            <div className="flex flex-col gap-16 md:gap-24">
              {areas.map((area, index) => (
                <PracticeAreaBlock
                  key={area.slug}
                  area={area}
                  onDark={onDark}
                  imageSide={(band + index) % 2 === 0 ? "right" : "left"}
                />
              ))}
            </div>
          </Section>
        );
      })}

      <CtaBand />
    </>
  );
}
