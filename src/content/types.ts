/**
 * Shapes of the site's editable content. The values come from Sanity (see
 * src/sanity/content.ts) — this file only describes them.
 */

import type { PortableTextBlock } from "next-sanity";

/** A photo ready for next/image. `position` is the editor-set focal point. */
export interface SiteImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Tiny inline preview for `placeholder="blur"`. */
  blurDataURL?: string;
  /** CSS `object-position`, from the image's hotspot. */
  position?: string;
}

export type SocialPlatform = "facebook" | "x" | "linkedin" | "youtube" | "dribbble";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Site {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  phone: string;
  /** `tel:` link derived from `phone`. */
  phoneHref: string;
  email: string;
  emailHref: string;
  /** One-line address, e.g. "11 Riverview Drive, Berri SA 5343". */
  address: string;
  addressLines: string[];
  postalAddress: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  mapsUrl: string;
  geo: { latitude: number; longitude: number };
  areaServed: string[];
  hours: string;
  hoursLines: string[];
  abn: string;
  established: number;
  memberOf: { label: string; href: string };
  liabilityStatement: string;
  socials: SocialLink[];
  externalListings: string[];
  url: string;
}

export type PracticeIcon =
  | "home"
  | "gem"
  | "briefcase"
  | "scales"
  | "shield"
  | "tractor"
  | "document"
  | "fence";

export interface PracticeArea {
  /** Deep-page route AND home-section anchor id, e.g. "conveyancing". */
  slug: string;
  navLabel: string;
  title: string;
  eyebrow: string;
  heading: string;
  tagline: string;
  blurb: string;
  icon: PracticeIcon;
  image: SiteImage;
  services: string[];
  /** Home-page section body: 2–3 short paragraphs. */
  summary: string[];
  /** Deep-page body. */
  full: { heading: string; text: string }[];
  metaTitle: string;
  metaDescription: string;
  /** Family law: warm tone + a prominent confidential-consultation path. */
  sensitive: boolean;
  /** Keep the label's capitals mid-sentence ("Read more about …"). */
  keepCase: boolean;
  /** Whether this area has its own deep page (all nine do today). */
  hasPage: boolean;
  callouts: { text: string; href: string; linkLabel: string }[];
}

export interface TeamMember {
  /** Stable slug — the profile-modal key and the Person @id fragment. */
  id: string;
  name: string;
  role: string;
  blurb: string;
  bio: string[];
  /** Practice-area slugs this person works in. */
  practiceAreas: string[];
  photo?: SiteImage;
  socials: SocialLink[];
}

export interface Article {
  slug: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: SiteImage;
  featured: boolean;
  date?: string;
  /** Until an article has a body it is a "coming soon" placeholder. */
  body?: PortableTextBlock[];
}

export interface Faq {
  question: string;
  answer: string[];
}

export interface CommunityOrg {
  name: string;
  logo: SiteImage;
  tilePadding: string;
}

export interface SectionCopy {
  eyebrow: string;
  heading: string;
  intro: string;
}

export interface WhyCard {
  title: string;
  caption: string;
  href?: string;
}

export interface HomeContent {
  hero: { heading: string; intro: string; image: SiteImage };
  services: SectionCopy;
  team: SectionCopy;
  why: SectionCopy & { cards: WhyCard[] };
  areas: SectionCopy & { list: { heading: string; text: string }[] };
  community: SectionCopy;
  history: SectionCopy & { points: string[]; image: SiteImage };
  insights: SectionCopy;
  faqs: SectionCopy & { moreHeading: string; moreText: string };
}

export interface AboutContent {
  hero: SectionCopy;
  firm: SectionCopy & { points: string[]; image: SiteImage };
  history: { eyebrow: string; heading: string; body: string[]; photos: SiteImage[] };
  adelaide: SectionCopy & {
    officeName: string;
    officeAddress: string;
    officePhone: string;
    officePhoneHref: string;
    linkLabel: string;
  };
}

export interface VisitsContent {
  eyebrow: string;
  title: string;
  intro: string;
  coverLabel: string;
  cover: string[];
  ctaHeading: string;
  ctaSubline: string;
}

export interface PageIntros {
  team: SectionCopy;
  practiceAreas: SectionCopy;
  insights: SectionCopy;
  contact: SectionCopy;
}

export interface LegalDoc {
  slug: string;
  title: string;
  intro: string;
  metaDescription: string;
  body: PortableTextBlock[];
}

export interface CtaContent {
  heading: string;
  subline: string;
  image?: SiteImage;
}

export interface SiteContent {
  site: Site;
  cta: CtaContent;
  home: HomeContent;
  about: AboutContent;
  visits: VisitsContent;
  pages: PageIntros;
  practiceAreas: PracticeArea[];
  team: TeamMember[];
  /** Newest first; the featured article is flagged, not reordered. */
  articles: Article[];
  faqs: Faq[];
  community: CommunityOrg[];
  legal: LegalDoc[];
}
