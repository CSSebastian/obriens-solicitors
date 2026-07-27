/**
 * Single source of truth for O'Briens Solicitors' real-world details.
 *
 * Contact details must ONLY be referenced from this file — never hardcoded in a
 * component. Values here come from the firm's live site
 * (www.obriens-solicitors.com) and win over anything shown in the design PNGs,
 * which contain template placeholder data.
 */

import {
  homeNavSections,
  homeSectionLabel,
  homeSections,
  PRIMARY_NAV_COUNT,
} from "@/content/home-sections";
import type { ImageKey } from "@/content/images";
import { practiceAreaBySlug } from "@/content/practice-areas";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "x"
  | "linkedin"
  | "youtube"
  | "dribbble";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export const site = {
  name: "O'Briens Solicitors",
  shortName: "O'Briens",
  tagline: "Legal counsel built to last",
  description:
    "O'Briens Solicitors is a law firm in Berri, South Australia, serving the Riverland, Mallee and Pinnaroo with conveyancing, estate planning, commercial, family and criminal law.",

  phone: "08 8582 1288",
  /** E.164-ish value for `tel:` links. */
  phoneHref: "tel:+61885821288",
  email: "obriens@obriens-solicitors.com.au",
  emailHref: "mailto:obriens@obriens-solicitors.com.au",

  address: "11 Riverview Drive, Berri SA 5343",
  addressLines: ["11 Riverview Drive", "Berri SA 5343"],
  /** Structured postal address — consumed by JSON-LD (see src/lib/structured-data.ts). */
  postalAddress: {
    streetAddress: "11 Riverview Drive",
    addressLocality: "Berri",
    addressRegion: "SA",
    postalCode: "5343",
    addressCountry: "AU",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=11+Riverview+Drive%2C+Berri+SA+5343",
  /**
   * Approximate coordinates for 11 Riverview Drive, Berri SA. Used only for the
   * LocalBusiness `geo` block in JSON-LD. TODO: confirm exact lat/long with the
   * client (from their Google Business Profile) if pin-accuracy matters.
   */
  geo: { latitude: -34.2823, longitude: 140.5988 },

  /**
   * Towns and the region the firm serves — drives the LocalBusiness `areaServed`
   * in JSON-LD and can back on-page copy. Kept broad but honest to the Riverland.
   */
  areaServed: [
    "Berri",
    "Renmark",
    "Loxton",
    "Barmera",
    "Waikerie",
    "Pinnaroo",
    "Riverland",
    "Mallee",
    "South Australia",
  ],

  hours: "Mon–Fri 9:00am–5:00pm, Sat–Sun closed",
  hoursLines: ["Mon–Fri 9:00am–5:00pm", "Sat–Sun closed"],

  abn: "20 164 052 331",

  // TODO: confirm year with client (design says 1926, current site says 1920)
  established: 1920,

  memberOf: {
    label: "A Member of the JL Lawyers Group",
    href: "https://www.jllaw.com.au/",
  },

  liabilityStatement:
    "Liability limited by a scheme approved under professional standards legislation.",

  /**
   * TODO: get real social URLs from client or remove icons.
   * The firm currently has no social profiles (only a Yellow Pages listing).
   * The design shows five icons — the footer and team cards render this array,
   * so leaving it empty simply renders nothing.
   */
  socials: [] as SocialLink[],

  /**
   * Authoritative external profiles that reference this firm — used for the
   * JSON-LD `sameAs` array so search engines and AI systems can reconcile the
   * business entity across the web. Socials are added automatically from
   * `socials` above; add third-party directory listings here.
   *
   * TODO: add the firm's Yellow Pages URL (and any Google Business Profile /
   * LawSociety listing) once confirmed with the client — do not invent one.
   */
  externalListings: [] as string[],

  url: "https://www.obriens-solicitors.com",
} as const;

/** Years in practice, derived so copy never drifts from `established`. */
export const yearsInPractice = (): number =>
  new Date().getFullYear() - site.established;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export interface NavLink {
  label: string;
  href: string;
}

// Nav items smooth-scroll to home-page sections (see src/lib/smooth-scroll.ts).
// `/#slug` works from anywhere: on the home page it eased-scrolls; from a deep
// page it navigates home and the hash is resolved on load.
//
// ORDER IS NOT DECLARED HERE. It is derived from `homeSections` — the home
// page's section sequence — so the nav can never disagree with the page. The
// visible top-level items are the first PRIMARY_NAV_COUNT nav-eligible sections
// in page order; "More" holds the remainder, still in page order. To reorder the
// nav, reorder src/content/home-sections.ts (which reorders the page with it).
const sectionNav: NavLink[] = homeNavSections.map((section) => ({
  label: homeSectionLabel(section),
  href: `/#${section.id}`,
}));

// Standalone routes with no home-page section of their own. They have no place
// in the page sequence, so they always trail the section links in "More".
const moreRoutes: NavLink[] = [
  { label: "About us", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export const primaryNav: NavLink[] = sectionNav.slice(0, PRIMARY_NAV_COUNT);

export const moreNav: NavLink[] = [
  ...sectionNav.slice(PRIMARY_NAV_COUNT),
  ...moreRoutes,
];

// The footer links to the deep pages (real routes) — this is where the SEO
// pages are reachable from, alongside the "Read more" links in each section.
// Derived from the same section order, filtered to areas that have a page
// (Rural & agribusiness does not).
export const footerNavPrimary: NavLink[] = [
  ...homeSections
    .filter(
      (section) =>
        section.kind === "practice" && practiceAreaBySlug(section.id)?.hasPage,
    )
    .map((section) => ({
      label: homeSectionLabel(section),
      href: `/${section.id}`,
    })),
  { label: "About us", href: "/about" },
];

export const footerNavSecondary: NavLink[] = [
  { label: "Our team", href: "/team" },
  { label: "Contact us", href: "/contact" },
  { label: "Get in touch", href: "/contact" },
];

export const footerLegalNav: NavLink[] = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "Cookies settings", href: "/cookies-settings" },
];

/* ------------------------------------------------------------------ */
/* Practice areas live in src/content/practice-areas.ts                 */
/* (single source of truth for both the home sections and deep pages).  */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Home — "Why" cards                                                   */
/* ------------------------------------------------------------------ */

export interface WhyCard {
  title: string;
  caption: string;
  image: ImageKey;
}

export const whyCards: WhyCard[] = [
  {
    title: "Experienced solicitors",
    caption:
      "Our team brings genuine expertise honed over decades of real cases.",
    image: "office-meeting",
  },
  {
    title: "Personalised attention",
    caption:
      "You're not a file number here—we listen and we care about your outcome.",
    image: "client-consultation",
  },
];

/* ------------------------------------------------------------------ */
/* Team                                                                 */
/* ------------------------------------------------------------------ */

/** People are grouped into these tiers on the team page + home section. */
export type TeamTier = "director" | "solicitor" | "support";

export interface TeamMember {
  /** Stable slug — used as the profile-modal key and the Person @id fragment. */
  id: string;
  name: string;
  role: string;
  tier: TeamTier;
  /** Short one-liner shown on the card. */
  blurb: string;
  /** Fuller bio for the "View profile" modal — one entry per paragraph. */
  bio: string[];
  socials: SocialLink[];
}

/**
 * The real team, transcribed from the firm's live site
 * (obriens-solicitors.com/our-team). Headshots live in src/content/team-photos.ts,
 * keyed by `id`; anyone without one falls back to an initials monogram.
 * TODO: client to confirm exact bio wording / qualifications.
 */
export const team: TeamMember[] = [
  {
    id: "john-levy",
    name: "John Levy",
    role: "Director — Solicitor",
    tier: "director",
    blurb:
      "Commercial, corporate and tax — 30+ years, with deep wine and agribusiness experience.",
    bio: [
      "John has more than 30 years' experience in commercial, corporate and tax matters, advising private and public companies, high-net-worth individuals, small and medium enterprises, and not-for-profit organisations.",
      "He has extensive experience in the wine and agricultural industries, and brings a practical, commercial focus to every matter he handles.",
    ],
    socials: [],
  },
  {
    id: "talia-begley",
    name: "Talia Begley",
    role: "Director — Solicitor",
    tier: "director",
    blurb:
      "Business structuring, restructuring and M&A across property, medical and not-for-profit sectors.",
    bio: [
      "Talia has more than 22 years' experience and broad commercial expertise, working closely with clients' accountants and advisors across the property, medical, retirement and not-for-profit sectors.",
      "She is skilled in business structuring and tax-effective restructuring, as well as mergers, acquisitions and divestitures.",
    ],
    socials: [],
  },
  {
    id: "nathaniel-nguyen",
    name: "Nathaniel Nguyen",
    role: "Director — Solicitor",
    tier: "director",
    blurb:
      "Commercial and property law for SMEs, with a clear, no-fuss approach.",
    bio: [
      "Nathaniel has an extensive background in commercial and property law, and regularly counsels small and medium enterprises, particularly in the pharmacy and healthcare sectors.",
      "He delivers commercial outcomes for his clients with a no-fuss, easy-to-understand approach.",
    ],
    socials: [],
  },
  {
    id: "sheena-vagg",
    name: "Sheena Vagg",
    role: "Solicitor",
    tier: "solicitor",
    blurb:
      "Family law, wills and estates, criminal and conveyancing — resolved early where possible.",
    bio: [
      "Sheena has 11 years' experience across family law, transfers, wills and estates, criminal law, conveyancing and employment law.",
      "She places real importance on the potential to resolve a matter at its earliest stage, sparing clients unnecessary cost and stress.",
    ],
    socials: [],
  },
  {
    id: "roxanne-gillespie",
    name: "Roxanne Gillespie",
    role: "Solicitor",
    tier: "solicitor",
    blurb:
      "Conveyancing — sales, purchases and subdivisions — and estate planning.",
    bio: [
      "Roxanne spent three years at the District Court of South Australia before returning to Berri in 2021.",
      "She focuses on conveyancing — sales, purchases and subdivisions — and is expanding her practice into estate planning.",
    ],
    socials: [],
  },
  {
    id: "sue-coden",
    name: "Sue Coden",
    role: "Paralegal",
    tier: "support",
    blurb: "Wills, powers of attorney, probate and estate administration.",
    bio: [
      "Sue has 42 years' experience as a clerk and legal secretary in the Riverland.",
      "She specialises in wills, powers of attorney, probate and estate administration.",
    ],
    socials: [],
  },
  {
    id: "simone-gunn",
    name: "Simone Gunn",
    role: "Paralegal",
    tier: "support",
    blurb: "Commercial law, leasing, probate and estate administration.",
    bio: [
      "Simone brings 37 years' experience in the legal industry, including time at an Adelaide firm.",
      "She handles commercial law, leasing documentation, probate and estate administration.",
    ],
    socials: [],
  },
  {
    id: "helen-pedler",
    name: "Helen Pedler",
    role: "Administration Clerk",
    tier: "support",
    blurb: "Client files, trust accounting and reception — a genuine all-rounder.",
    bio: [
      "Helen has more than 12 years' experience in legal administration.",
      "An all-rounder, she assists with client files, trust accounting, reception and general support.",
    ],
    socials: [],
  },
  {
    id: "merridy-rady",
    name: "Merridy Rady",
    role: "Receptionist — Administration Clerk",
    tier: "support",
    blurb:
      "Reception and file management, with deep knowledge of Riverland clients.",
    bio: [
      "Merridy is well known to the firm's Riverland clients and looks after reception.",
      "She maintains client files and assists staff across a range of areas.",
    ],
    socials: [],
  },
  {
    id: "cindy-kassebaum",
    name: "Cindy Kassebaum",
    role: "Conveyancing Clerk",
    tier: "support",
    blurb: "Conveyancing support, office administration and reception.",
    bio: [
      "Cindy has more than 27 years' administrative experience and began training as a conveyancing clerk in 2021.",
      "She handles office administration and reception.",
    ],
    socials: [],
  },
];

/** Tier metadata, in display order — drives the grouped team grid. */
export const teamTiers: { tier: TeamTier; label: string }[] = [
  { tier: "director", label: "Directors" },
  { tier: "solicitor", label: "Solicitors" },
  { tier: "support", label: "Support team" },
];

export const teamByTier = (tier: TeamTier): TeamMember[] =>
  team.filter((member) => member.tier === tier);

export const teamMemberById = (id: string): TeamMember | undefined =>
  team.find((member) => member.id === id);

/* ------------------------------------------------------------------ */
/* Insights                                                             */
/* ------------------------------------------------------------------ */

export type ArticleCategory =
  | "Business"
  | "Property"
  | "Family"
  | "Rural"
  | "Criminal";

export interface Article {
  slug: string;
  category: ArticleCategory;
  readTime: string;
  title: string;
  excerpt: string;
  /** Card + article-hero photography (see src/content/images.ts). */
  image: ImageKey;
}

// TODO: replace placeholder article copy with real insights content from the client.
export const featuredArticle: Article = {
  slug: "anti-money-laundering-laws",
  image: "case-discussion",
  category: "Business",
  readTime: "7 min read",
  // TODO: confirm with designer — the design reads "Anti-Lundering Money Laws",
  // which is a typo for "Anti-Money Laundering Laws".
  title: "Anti-Money Laundering Laws and why they matter",
  excerpt: "Short synopsis of the article here",
};

export const featuredSecondary: Article[] = [
  {
    slug: "conveyancing-essentials-south-australian-buyers",
    image: "contract-review",
    category: "Property",
    readTime: "6 min read",
    title: "Conveyancing essentials for South Australian buyers",
    excerpt:
      "What to check before you sign, and what happens between contract and settlement.",
  },
  {
    slug: "estate-planning-young-children",
    image: "lawyer-and-client",
    category: "Family",
    readTime: "8 min read",
    title: "Estate planning when you have young children",
    excerpt:
      "Guardianship, testamentary trusts, and the decisions worth making early.",
  },
  {
    slug: "water-rights-farming-succession",
    image: "solicitor-at-work",
    category: "Rural",
    readTime: "5 min read",
    title: "Water rights and farming succession planning",
    excerpt:
      "How water entitlements are treated when farmland passes to the next generation.",
  },
];

export const recentArticles: Article[] = [
  {
    slug: "legal-advice-partnerships",
    image: "case-discussion",
    category: "Business",
    readTime: "4 min read",
    title: "When to seek legal advice on partnerships",
    excerpt: "Getting it right from the start saves trouble later",
  },
  {
    slug: "rights-questioned-by-police",
    image: "courtroom-verdict",
    category: "Criminal",
    readTime: "6 min read",
    title: "Your rights if you're questioned by police",
    excerpt: "Know what to do when facing criminal allegations",
  },
  {
    slug: "separation-property-division",
    image: "lawyer-and-client",
    category: "Family",
    readTime: "7 min read",
    title: "Separation and property division explained",
    excerpt: "Understanding the process helps you plan ahead",
  },
  {
    slug: "leasing-agricultural-land",
    image: "solicitor-at-work",
    category: "Rural",
    readTime: "5 min read",
    title: "Leasing agricultural land, the right way",
    excerpt: "Protect your interests with a solid lease agreement",
  },
  {
    slug: "boundary-disputes",
    image: "contract-review",
    category: "Property",
    readTime: "5 min read",
    title: "Boundary disputes and how to resolve them",
    excerpt: "Early intervention often prevents expensive litigation",
  },
  {
    slug: "employment-law-basics",
    image: "case-discussion",
    category: "Business",
    readTime: "6 min read",
    title: "Employment law basics for small business owners",
    excerpt: "Stay compliant and avoid costly employment disputes",
  },
];

export const allArticles: Article[] = [
  featuredArticle,
  ...featuredSecondary,
  ...recentArticles,
];

export const articleBySlug = (slug: string): Article | undefined =>
  allArticles.find((article) => article.slug === slug);

/* ------------------------------------------------------------------ */
/* FAQs                                                                 */
/* ------------------------------------------------------------------ */

export interface Faq {
  question: string;
  /** One entry per paragraph. */
  answer: string[];
}

// TODO: client to review FAQ answers
export const faqs: Faq[] = [
  {
    question: "How do I start?",
    answer: [
      "Getting started is simple. Ring the office or send us an email with a short outline of what you need, and we'll arrange a time to talk it through — in person here in Berri, or by phone if that's easier for you.",
      "That first conversation is about understanding your situation and explaining your options in plain English. There's no obligation and no pressure — just honest advice about whether we can help and what the sensible next step looks like.",
    ],
  },
  {
    question: "What areas do you cover?",
    answer: [
      "We're a general practice serving Berri, the Riverland, the Mallee and Pinnaroo, and we cover the six areas most people and businesses in the region actually need: conveyancing, wills and estates, commercial law, family law, criminal law, and agribusiness and rural matters.",
      "That local breadth matters. Farming families, in particular, need solicitors who understand water rights, succession and the way rural property works. If you're not sure your matter fits neatly into one of those areas, ask anyway — if we can't help, we'll point you to someone who can.",
    ],
  },
  {
    question: "How much will it cost?",
    answer: [
      "Cost depends on the type and complexity of your matter, so we won't quote a figure before we understand what's involved. What we will do is give you a clear picture upfront — how we charge, what's likely to be involved, and what could change the estimate.",
      "We've been part of this community since 1920, and being straight about fees is part of how we've kept that trust. We'll work within your budget wherever the matter allows, and you'll never be surprised by an invoice.",
    ],
  },
  {
    question: "Do you offer fixed fees?",
    answer: [
      "For many everyday matters, yes. Conveyancing, straightforward wills and powers of attorney, and similar defined pieces of work often suit a fixed fee, so you know the cost before we begin.",
      "Other matters — a contested estate, a family law dispute, or ongoing commercial advice — are harder to price as a single figure because the work genuinely varies. In those cases we'll talk options and agree an arrangement that's fair and transparent before any work starts.",
    ],
  },
  {
    question: "How long will it take?",
    answer: [
      "Timelines vary more than most people expect. A standard conveyance follows the contract dates; a will can often be turned around quickly; probate, a property settlement or a commercial dispute can take weeks or months depending on the other parties and the courts.",
      "We'll give you a realistic sense of the timeframe at the outset and keep you informed at each step, so you're never left wondering where your matter stands.",
    ],
  },
  {
    question: "Can you handle urgent matters?",
    answer: [
      "Yes. Some legal problems can't wait — an imminent settlement, a court date, or a police matter where the first 48 hours count. If something is time-critical, call the office rather than emailing so we can respond quickly.",
      "Wherever we can, we'll make room to give an urgent matter the attention it needs, and tell you honestly if a deadline is tight so we can act on it together.",
    ],
  },
];
