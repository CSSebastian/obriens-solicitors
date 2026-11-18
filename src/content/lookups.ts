/**
 * Derived views of the site content: navigation, lookups and article helpers.
 * Pure functions over {@link SiteContent}, usable on the server and client.
 */

import {
  homeNavSections,
  homeSections,
  PRIMARY_NAV_COUNT,
  type HomeSection,
} from "@/content/home-sections";
import type {
  Article,
  NavLink,
  PracticeArea,
  Site,
  SiteContent,
  TeamMember,
} from "@/content/types";

export const practiceAreaBySlug = (
  areas: PracticeArea[],
  slug: string,
): PracticeArea | undefined => areas.find((area) => area.slug === slug);

/** Team members who work in a practice area, in team display order. */
export const teamForPracticeArea = (team: TeamMember[], slug: string): TeamMember[] =>
  team.filter((member) => member.practiceAreas.includes(slug));

export const teamMemberById = (team: TeamMember[], id: string): TeamMember | undefined =>
  team.find((member) => member.id === id);

/** An article is published once it has body text. */
export const isPublished = (article: Article): boolean => Boolean(article.body?.length);

export const articleBySlug = (articles: Article[], slug: string): Article | undefined =>
  articles.find((article) => article.slug === slug);

/** The home page's featured article, and the rest in date order. */
export function splitArticles(articles: Article[]): {
  featured?: Article;
  recent: Article[];
} {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  return { featured, recent: articles.filter((a) => a !== featured) };
}

/** Years in practice, derived so copy never drifts from `established`. */
export const yearsInPractice = (site: Site): number =>
  new Date().getFullYear() - site.established;

/**
 * The label a home section carries in navigation. Practice areas take theirs
 * from the practice-area content, so a renamed area renames its nav item too.
 */
export const homeSectionLabel = (section: HomeSection, areas: PracticeArea[]): string =>
  section.kind === "block"
    ? section.label
    : (practiceAreaBySlug(areas, section.id)?.navLabel ?? section.id);

// Standalone routes with no home-page section of their own; they always
// trail the section links in "More".
const moreRoutes: NavLink[] = [
  { label: "Home & hospital visits", href: "/home-hospital-visits" },
  { label: "About us", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export interface Navigation {
  primaryNav: NavLink[];
  moreNav: NavLink[];
  footerNavPrimary: NavLink[];
  footerNavSecondary: NavLink[];
  footerLegalNav: NavLink[];
}

/**
 * Nav order is derived from `homeSections` — the home page's section sequence
 * — so the nav can never disagree with the page. The visible top-level items
 * are the first PRIMARY_NAV_COUNT nav-eligible sections; "More" holds the rest.
 */
export function buildNavigation(content: Pick<SiteContent, "practiceAreas" | "legal">): Navigation {
  const areas = content.practiceAreas;
  const sectionNav: NavLink[] = homeNavSections
    .filter((section) => section.kind === "block" || practiceAreaBySlug(areas, section.id))
    .map((section) => ({
      label: homeSectionLabel(section, areas),
      href: `/#${section.id}`,
    }));

  const legalOrder = ["privacy-policy", "terms-of-service", "disclaimer", "cookies-settings", "aml-policy"];
  const legalLabels: Record<string, string> = {
    "privacy-policy": "Privacy policy",
    "terms-of-service": "Terms of service",
    disclaimer: "Disclaimer",
    "cookies-settings": "Cookies",
    "aml-policy": "AML policy",
  };

  return {
    primaryNav: sectionNav.slice(0, PRIMARY_NAV_COUNT),
    moreNav: [...sectionNav.slice(PRIMARY_NAV_COUNT), ...moreRoutes],
    // The footer links to the deep pages, in home-section order.
    footerNavPrimary: [
      ...homeSections
        .filter(
          (section) =>
            section.kind === "practice" && practiceAreaBySlug(areas, section.id)?.hasPage,
        )
        .map((section) => ({
          label: homeSectionLabel(section, areas),
          href: `/${section.id}`,
        })),
      { label: "Home & hospital visits", href: "/home-hospital-visits" },
      { label: "About us", href: "/about" },
    ],
    footerNavSecondary: [
      { label: "Our team", href: "/team" },
      { label: "Contact us", href: "/contact" },
      { label: "Get in touch", href: "/contact" },
    ],
    footerLegalNav: legalOrder
      .filter((slug) => content.legal.some((doc) => doc.slug === slug))
      .map((slug) => ({ label: legalLabels[slug], href: `/${slug}` })),
  };
}
