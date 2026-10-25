/**
 * The home page's section sequence — the single source of truth for the ORDER
 * of the home page, in every place that order is expressed:
 *
 *   • src/app/page.tsx renders by mapping over `homeSections`.
 *   • src/content/site.ts derives `primaryNav` / `moreNav` by slicing it.
 *   • src/lib/use-active-section.ts walks it, in order, to resolve which
 *     section the viewport is currently on (nav indicator + URL hash).
 *
 * Nothing else defines home-page order. Move an entry here and the section, its
 * nav position and the scroll-spy all move with it — they cannot drift apart.
 *
 * Nav derivation is deliberately mechanical: the visible top-level items are the
 * FIRST `PRIMARY_NAV_COUNT` nav-eligible sections in page order, and "More"
 * holds the rest, still in page order. So reading the nav left to right and then
 * opening "More" walks you down the page in sequence, with no gaps.
 */

import { practiceAreaBySlug } from "@/content/practice-areas";

/**
 * Home sections that are their own component rather than a practice area.
 * Listing them as a literal union makes the renderer map in page.tsx
 * exhaustive — a new block section will not compile until it is rendered.
 */
export type HomeBlockId =
  | "services"
  | "team"
  | "why"
  | "areas"
  | "community"
  | "history"
  | "insights"
  | "faqs";

interface HomeSectionBase {
  /** The section's DOM id, and therefore its anchor: `/#{id}`. */
  id: string;
  /**
   * Offer this section as a navigation destination. Sections that are page
   * furniture rather than destinations — the services overview, the "why us"
   * band, the closing FAQ — are still tracked for the URL hash and the
   * scroll-spy, but never appear in the nav.
   */
  inNav: boolean;
}

export interface HomeBlockSection extends HomeSectionBase {
  kind: "block";
  id: HomeBlockId;
  /** Nav label. Practice areas take theirs from practice-areas.ts instead. */
  label: string;
}

export interface HomePracticeSection extends HomeSectionBase {
  kind: "practice";
  /** Matches a `slug` in src/content/practice-areas.ts. */
  id: string;
  /**
   * Render inside the previous practice band rather than opening a new
   * coloured band of its own (Rural & agribusiness shares Criminal law's).
   */
  sharesBand?: true;
}

export type HomeSection = HomeBlockSection | HomePracticeSection;

/** Every home-page section, top to bottom. This array IS the page order. */
export const homeSections: HomeSection[] = [
  { kind: "block", id: "services", label: "Services", inNav: false },
  // Nav order per the brief: Family Law · Conveyancing · Our Team · More » …
  { kind: "practice", id: "family-law", inNav: true },
  { kind: "practice", id: "conveyancing", inNav: true },
  { kind: "block", id: "team", label: "Our team", inNav: true },
  { kind: "practice", id: "estate-planning", inNav: true },
  { kind: "practice", id: "commercial-law", inNav: true },
  { kind: "practice", id: "criminal-law", inNav: true },
  { kind: "practice", id: "rural-agribusiness", inNav: false, sharesBand: true },
  { kind: "practice", id: "employment-law", inNav: true },
  { kind: "block", id: "why", label: "Why us", inNav: false },
  { kind: "block", id: "areas", label: "Areas we service", inNav: false },
  { kind: "block", id: "community", label: "Community support", inNav: false },
  { kind: "block", id: "history", label: "Our history", inNav: false },
  { kind: "block", id: "insights", label: "Insights", inNav: false },
  { kind: "block", id: "faqs", label: "FAQs", inNav: false },
];

/**
 * How many nav-eligible sections sit in the header bar before "More" takes the
 * remainder. Three keeps the desktop row comfortable — the bar also carries
 * "More", Contact and the phone number, and switches to the hamburger at 920px.
 */
export const PRIMARY_NAV_COUNT = 3;

/**
 * Every section id, in page order. The scroll-spy tracks all of them (not just
 * the nav ones) so the URL hash always names the section actually on screen,
 * and the ORDER matters: the spy resolves the active section by walking this
 * list top to bottom.
 */
export const homeSectionIds: string[] = homeSections.map((section) => section.id);

/** Nav-eligible sections, in page order. */
export const homeNavSections: HomeSection[] = homeSections.filter(
  (section) => section.inNav,
);

/**
 * The label a section carries in navigation. Practice areas take theirs from
 * practice-areas.ts — the source of truth for their copy — so a renamed
 * practice area renames its nav item too.
 */
export const homeSectionLabel = (section: HomeSection): string =>
  section.kind === "block"
    ? section.label
    : (practiceAreaBySlug(section.id)?.navLabel ?? section.id);

if (process.env.NODE_ENV !== "production") {
  for (const section of homeSections) {
    if (section.kind === "practice" && !practiceAreaBySlug(section.id)) {
      console.warn(
        `[home-sections] "${section.id}" has no practice area — the section will not render.`,
      );
    }
  }
}
