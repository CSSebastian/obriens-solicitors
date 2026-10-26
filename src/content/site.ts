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
    "O'Briens Solicitors is a law firm in Berri, South Australia, serving the Riverland, Mallee and Pinnaroo with conveyancing, estate planning, commercial, family, criminal and employment law.",

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
   * Coordinates for 11 Riverview Drive, Berri SA (matches the Google Maps
   * geocode for the address). Used only for the LocalBusiness `geo` block in
   * JSON-LD.
   */
  geo: { latitude: -34.2876, longitude: 140.6016 },

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

  // The brief fixes the firm age as "Since 1920" everywhere.
  established: 1920,

  memberOf: {
    label: "A Member of the JL Lawyers Group",
    href: "https://www.jllaw.com.au/",
  },

  liabilityStatement:
    "Liability limited by a scheme approved under professional standards legislation.",

  /**
   * Facebook only (brief, global rule 8).
   * The footer renders this array as icon + page name.
   */
  socials: [
    {
      platform: "facebook",
      label: "O'Briens Solicitors",
      href: "https://www.facebook.com/obrienssolicitors/",
    },
  ] as SocialLink[],

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
  { label: "Home & hospital visits", href: "/home-hospital-visits" },
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
  { label: "Home & hospital visits", href: "/home-hospital-visits" },
  { label: "About us", href: "/about" },
];

export const footerNavSecondary: NavLink[] = [
  { label: "Our team", href: "/team" },
  { label: "Contact us", href: "/contact" },
  { label: "Get in touch", href: "/contact" },
];

// TODO APPROVAL: all five legal pages are drafts — O'Briens to review and
// approve the wording before launch (they are linked here so the firm can read
// them on staging).
export const footerLegalNav: NavLink[] = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Cookies", href: "/cookies-settings" },
  { label: "AML policy", href: "/aml-policy" },
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
}

export const whyIntro =
  "We're a local firm with deep Riverland roots. We know the people, the industries and the issues that matter here.";

/**
 * "What sets us apart" cards. `href` (optional) turns the card into a link —
 * "Part of the community" scrolls to the Community Support section.
 */
export const whyCards: (WhyCard & { href?: string })[] = [
  {
    title: "Local and here to stay",
    caption:
      "Our office has been in Berri since 1920, and our team lives and works in the communities we serve.",
  },
  {
    title: "One firm for most matters",
    caption:
      "From property and wills to family, employment and business law, most legal needs can be handled under one roof.",
  },
  {
    title: "We know regional industry",
    caption:
      "Horticulture, farming and water rights are everyday work for us, not specialist exceptions.",
  },
  {
    title: "Help beyond Berri",
    caption:
      "We see clients across the Riverland, the Mallee and Pinnaroo, offer phone appointments anywhere in South Australia, and support Adelaide clients through the JL Lawyers Group.",
  },
  {
    title: "Part of the community",
    caption:
      "We're proud to support the clubs and organisations that make the Riverland a great place to live.",
    href: "#community",
  },
];

/* ------------------------------------------------------------------ */
/* Team                                                                 */
/* ------------------------------------------------------------------ */

export interface TeamMember {
  /** Stable slug — used as the profile-modal key and the Person @id fragment. */
  id: string;
  name: string;
  role: string;
  /** Short one-liner shown on the card. */
  blurb: string;
  /** Fuller bio for the "View profile" modal — one entry per paragraph. */
  bio: string[];
  /**
   * TODO ON HOLD: practice areas awaiting O'Briens. Leave empty — profiles do
   * not show practice areas and people are not linked to practice area pages
   * until the firm supplies them (brief A3.6 / A6).
   */
  practiceAreas: string[];
  socials: SocialLink[];
}

/**
 * The team, in display order (one flat grid — no hierarchy). Headshots live in
 * src/content/team-photos.ts, keyed by `id`. Bios are the firm's refined
 * "Website Bios" text.
 * TODO CONFIRM: Merridy noted minor bio refinements may still come.
 * TODO: client to review photo quality (all supplied photos are used as is).
 */
export const team: TeamMember[] = [
  {
    id: "nathaniel-nguyen",
    name: "Nathaniel Nguyen",
    role: "Director",
    blurb: "Commercial and property law, with a clear, no-fuss approach.",
    bio: [
      "Nathaniel joined O'Briens Solicitors as Director in 2022. He has broad legal experience and expertise across commercial and property law, and a comprehensive understanding of all areas of business law.",
      "Nathaniel also offers estate planning and legal documentation for clients wishing to secure their future. He delivers positive commercial outcomes for his clients with a no-fuss, easy-to-understand approach.",
      "Nathaniel is happy to meet with clients in person, by phone or via Microsoft Teams. He holds dual degrees in Law and Commerce, as well as a Graduate Diploma in Legal Practice.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "sheena-vagg",
    name: "Sheena Vagg",
    role: "Principal Solicitor",
    blurb: "Family, employment, criminal, estates and conveyancing.",
    bio: [
      "After 14 years working across several fields of law, Sheena has experience in family law, including children's matters and property settlements, as well as wills and estates, criminal law, conveyancing and employment law. Having worked in employment law, Sheena also specialises in advice and representation across all employment matters.",
      "She enjoys working with clients to provide concise, timely and considered advice. Sheena demonstrates empathy and understanding when listening to clients and has achieved successful outcomes on their behalf in many legal matters. A dedicated solicitor, she places importance on resolving matters at the earliest possible stage.",
      "Sheena holds dual degrees in Law and Behavioural Science (Psychology).",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "dajana-vujica",
    name: "Dajana Vujica",
    role: "Senior Associate",
    blurb: "Family law, plus wills and powers of attorney.",
    bio: [
      "Dajana began her career as an Associate to a family law Judge in Adelaide, a role that gave her a strong foundation in family law. She joined O'Briens Solicitors in 2025 and brings special expertise to this area of our practice.",
      "Dajana has a passion for working closely with clients and their families to achieve positive outcomes. She is the Riverland Representative for the Family Law Section Regional Liaison Group. Dajana delivers a streamlined, step-by-step process for clients, from the beginning of their matter through to resolution.",
      "She also provides advice on, and prepares, wills, enduring powers of attorney and advance care directives. Dajana holds a Bachelor of Laws degree.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "roxanne-gillespie",
    name: "Roxanne Gillespie",
    role: "Associate",
    blurb: "Conveyancing, commercial matters and estate planning.",
    bio: [
      "Having worked at the District Court of South Australia for three years before moving back to the Riverland in 2021, Roxanne now specialises in conveyancing, including sales and purchases, land division and subdivisions.",
      "She attends to commercial matters such as the preparation of deeds and agreements, contract advice and general business advice. Roxanne also takes instructions for the preparation of wills, enduring powers of attorney and advance care directives, advising clients as they plan for the future.",
      "With her quiet and considered manner, Roxanne is sensitive to her clients' needs and provides a tailored approach to all matters. She holds dual degrees in Law and Social Sciences.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "simone-gunn",
    name: "Simone Gunn",
    role: "Practice Manager / Paralegal",
    blurb: "Commercial, leasing, probate and estate administration.",
    bio: [
      "Simone brings over 40 years of legal experience to her dual role as Practice Manager and Paralegal, including more than a decade serving the Riverland community.",
      "Specialising in general commercial law, leasing, probate and estate administration, she understands the importance of providing tailored, individual support. With her warm and approachable manner, Simone combines expertise with a client-first philosophy, ensuring everyone she works with feels supported and valued.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "sue-coden",
    name: "Sue Coden",
    role: "Paralegal",
    blurb: "Wills, powers of attorney, probate and estates.",
    bio: [
      "Sue is a valued member of our team, working as a Paralegal. She has supported clients in the Riverland legal community for more than 44 years, including 30 years with O'Briens Solicitors.",
      "Over the course of her career, Sue has worked across many areas of law and brings a wealth of experience, practical knowledge and a calm, approachable manner to her role. She now works primarily in wills and powers of attorney, probate and estate administration, assisting clients through what are often important and sensitive life matters with care and understanding.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "felicity-bannister",
    name: "Felicity Bannister",
    role: "Registered Conveyancer / Law Clerk",
    blurb: "Smooth, stress-free property transactions.",
    bio: [
      "Felicity is our Registered Conveyancer, holding an Advanced Diploma in Conveyancing and currently studying towards a Bachelor of Laws. She brings over 10 years of experience in management and customer service roles.",
      "Felicity has a solid understanding of our clients' specific needs and offers a professional, responsive approach. Her commitment is to ensure that each property transaction is as smooth and stress-free as possible.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "cindy-kassebaum",
    name: "Cindy Kassebaum",
    role: "Conveyancing Clerk",
    blurb: "Conveyancing support and office administration.",
    bio: [
      "Cindy has developed strong conveyancing skills and experience since commencing as a Conveyancing Clerk in 2021. She provides valuable support across all property transactions, including liaising with clients, preparing documentation and managing conveyancing files.",
      "A local with more than 28 years' experience in administrative roles, Cindy also provides reliable backup for reception and general office administration.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "kieran-walter",
    name: "Kieran Walter",
    role: "Law Clerk",
    blurb: "Research, drafting and local court support.",
    bio: [
      "Kieran holds a Certificate IV in Legal Services and is undertaking a Bachelor of Laws degree. As a Law Clerk, he supports the firm's solicitors with research, drafting legal documents and liaising with clients.",
      "Kieran is also involved in local court matters, file maintenance and general administration. Prior to joining O'Briens Solicitors, Kieran worked in retail management and construction, bringing a practical and approachable perspective to his role.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "merridy-rady",
    name: "Merridy Rady",
    role: "Receptionist / Legal Administrative Assistant",
    blurb: "A friendly first point of contact with deep Riverland knowledge.",
    bio: [
      "Having worked for many years as a local librarian, Merridy brings a broad range of skills to our team. Born in Berri, she has a deep knowledge of the Riverland and its people.",
      "Merridy has worked at O'Briens Solicitors for more than 10 years and understands the legal sector well. She provides a personal and friendly approach so that clients feel comfortable and valued. Her role as Legal Administrative Assistant is varied, providing support to our solicitors and across other areas of the practice.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "dianne-trautwein",
    name: "Dianne Trautwein",
    role: "Receptionist / Legal Administrative Assistant",
    blurb: "Reception, solicitor support and administration.",
    bio: [
      "Di has over 35 years' experience in business administration, including running a family business. She has a clear understanding of the diversity and culture of our region.",
      "Having employed and worked alongside people from different cultural backgrounds, Di has a sensitive and patient approach to client service. Her role includes solicitor support, reception and general administrative duties.",
    ],
    practiceAreas: [],
    socials: [],
  },
  {
    id: "julie-lawrie",
    name: "Julie Lawrie",
    role: "Administrative Assistant",
    blurb: "Trust accounting and file management.",
    bio: [
      "Julie has a wealth of experience gained over many years, having owned and operated various businesses. She has worked in a number of administrative roles in bookkeeping, conveyancing and the travel industry.",
      "In her role at O'Briens Solicitors, Julie is responsible for trust accounting, filing, file management and general support work.",
    ],
    practiceAreas: [],
    socials: [],
  },
];

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
  excerpt:
    "What the new anti-money laundering rules mean for property and business transactions.",
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

// TODO CONFIRM: client to review FAQ answers
export const faqs: Faq[] = [
  {
    question: "How do I start?",
    answer: [
      "Getting started is simple. Ring the office or send us an email with a short outline of what you need, and we'll arrange a time to talk it through — in person here in Berri, or by phone if that's easier for you.",
      "That first conversation is about understanding your situation and explaining your options in plain English, so you know whether we can help and what the sensible next step is.",
    ],
  },
  {
    question: "What areas do you cover?",
    answer: [
      "We're a general practice serving Berri, the Riverland, the Mallee and Pinnaroo, with support for Adelaide clients through the JL Lawyers Group. We cover the seven areas most people and businesses in the region need: conveyancing, wills and estates, commercial law, family law, criminal law, employment law, and agribusiness and rural matters.",
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
