/**
 * Single source of truth for O'Briens Solicitors' real-world details.
 *
 * Contact details must ONLY be referenced from this file — never hardcoded in a
 * component. Values here come from the firm's live site
 * (www.obriens-solicitors.com) and win over anything shown in the design PNGs,
 * which contain template placeholder data.
 */

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
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=11+Riverview+Drive%2C+Berri+SA+5343",

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

  url: "https://www.obriens-solicitors.com.au",
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

export const primaryNav: NavLink[] = [
  { label: "Commercial law", href: "/commercial-law" },
  { label: "Family law", href: "/family-law" },
  { label: "Conveyancing", href: "/conveyancing" },
];

export const moreNav: NavLink[] = [
  { label: "Criminal law", href: "/criminal-law" },
  { label: "About us", href: "/about" },
  { label: "Our team", href: "/team" },
  { label: "Insights", href: "/insights" },
];

export const footerNavPrimary: NavLink[] = [
  { label: "Commercial law", href: "/commercial-law" },
  { label: "Family law", href: "/family-law" },
  { label: "Conveyancing", href: "/conveyancing" },
  { label: "Criminal law", href: "/criminal-law" },
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
/* Practice areas — descriptions seeded from the firm's live site       */
/* ------------------------------------------------------------------ */

export type PracticeIcon = "document" | "tractor" | "gem" | "scales";

export interface PracticeArea {
  slug: string;
  /** Nav / card label. */
  title: string;
  /** Page H1. */
  heading: string;
  intro: string;
  icon: PracticeIcon;
  services: string[];
  body: { heading: string; text: string }[];
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: "conveyancing",
    title: "Conveyancing",
    heading: "Conveyancing",
    intro:
      "Buying or selling property or a business is one of the largest transactions most people make. We handle the legal detail so settlement happens on time and without surprises.",
    icon: "document",
    services: [
      "Buying and selling property",
      "Buying and selling a business",
      "Transfer of water rights",
      "Easements",
      "Subdivisions",
    ],
    body: [
      {
        heading: "Property and business transfers",
        text: "We act for buyers and sellers across the Riverland, Mallee and Pinnaroo, preparing and reviewing contracts, attending to searches, and managing settlement from start to finish.",
      },
      {
        heading: "Water rights, easements and subdivisions",
        text: "Rural and regional property brings its own complexity. We advise on the transfer of water rights, easements over neighbouring land, and the process of subdividing a title.",
      },
    ],
  },
  {
    slug: "estate-planning",
    title: "Estate planning & probate",
    heading: "Estate planning and probate",
    intro:
      "Clear, properly drafted documents protect the people you care about. We help you plan ahead, and we guide families through administration when the time comes.",
    icon: "gem",
    services: [
      "Wills",
      "Power of attorney",
      "Probate",
      "Estate administration",
      "Succession planning",
    ],
    body: [
      {
        heading: "Wills and powers of attorney",
        text: "We draft wills and powers of attorney that reflect what you actually want, and we explain the consequences of each decision in plain language before you sign.",
      },
      {
        heading: "Probate and estate administration",
        text: "Applying for probate and administering an estate is unfamiliar territory for most people. We take carriage of the process and keep the family informed at each step.",
      },
      {
        heading: "Succession planning",
        text: "For farming families and business owners, succession planning is about more than a will. We help structure the transfer of land, water and business interests to the next generation.",
      },
    ],
  },
  {
    slug: "commercial-law",
    title: "Commercial law",
    heading: "Commercial law",
    intro:
      "We advise on contracts, disagreements, and the strategic decisions that shape your business — from incorporation through to sale.",
    icon: "document",
    services: [
      "Corporate advice",
      "Company incorporation",
      "Planning and development",
      "Sale of business assets",
      "Investment structures",
    ],
    body: [
      {
        heading: "Advice for businesses of every size",
        text: "Whether you are incorporating a company, restructuring, or negotiating a supply agreement, we give you a clear view of the risk before you commit.",
      },
      {
        heading: "Planning, development and asset sales",
        text: "We act on planning and development matters, the sale of business assets, and the investment structures that sit behind them.",
      },
    ],
  },
  {
    slug: "family-law",
    title: "Family law",
    heading: "Family law",
    intro:
      "Family matters are difficult enough without legal uncertainty. We give practical advice, and we work towards outcomes that let you move forward.",
    icon: "scales",
    services: [
      "Divorce",
      "Binding financial agreements",
      "Property settlements",
    ],
    body: [
      {
        heading: "Separation and divorce",
        text: "We explain your options early, so decisions are made with a clear understanding of where you stand rather than under pressure.",
      },
      {
        heading: "Property settlements and financial agreements",
        text: "We negotiate property settlements and prepare binding financial agreements, aiming to resolve matters without the cost and delay of court wherever that is realistic.",
      },
    ],
  },
  {
    slug: "criminal-law",
    title: "Criminal law",
    heading: "Criminal law",
    intro:
      "If you have been charged or asked to attend an interview, get advice before you say anything. We act with experience and strategic thinking.",
    icon: "scales",
    services: [
      "Police interviews",
      "Bail applications",
      "Summary and indictable matters",
      "Court representation",
    ],
    body: [
      {
        heading: "Advice from the first contact",
        text: "What happens in the first 48 hours often shapes the whole matter. Contact us before an interview so you understand your rights.",
      },
      {
        heading: "Representation in court",
        text: "We appear in Riverland courts regularly and prepare each matter properly, whatever its size.",
      },
    ],
  },
];

export const practiceAreaBySlug = (slug: string): PracticeArea | undefined =>
  practiceAreas.find((area) => area.slug === slug);

/* ------------------------------------------------------------------ */
/* Home — services feature row (copy transcribed from the design PNGs)  */
/* ------------------------------------------------------------------ */

export interface ServiceFeature {
  title: string;
  blurb: string;
  icon: PracticeIcon;
  href: string;
}

export const serviceFeatures: ServiceFeature[] = [
  {
    title: "Family Law and Commercial Law",
    blurb:
      "We advise on contracts, disagreements, and the strategic decisions that shape your business.",
    icon: "document",
    href: "/family-law",
  },
  {
    title: "Rural and agricultural matters",
    blurb:
      "Farming families need solicitors who understand the land and the complexities that come with it.",
    icon: "tractor",
    href: "/conveyancing",
  },
  {
    title: "Wills, estates, and family planning",
    blurb:
      "We help you protect what matters most and ensure your wishes are clear and legally sound.",
    icon: "gem",
    href: "/estate-planning",
  },
  {
    title: "Commercial law and business disputes",
    blurb:
      "We advise on contracts, disagreements, and the strategic decisions that shape your business.",
    icon: "document",
    href: "/commercial-law",
  },
];

/* ------------------------------------------------------------------ */
/* Home — "Why" cards                                                   */
/* ------------------------------------------------------------------ */

export interface WhyCard {
  title: string;
  caption: string;
}

export const whyCards: WhyCard[] = [
  {
    title: "Experienced solicitors",
    caption:
      "Our team brings genuine expertise honed over decades of real cases.",
  },
  {
    title: "Personalised attention",
    caption:
      "You're not a file number here—we listen and we care about your outcome.",
  },
];

/* ------------------------------------------------------------------ */
/* Team                                                                 */
/* ------------------------------------------------------------------ */

export interface TeamMember {
  name: string;
  role: string;
  blurb: string;
  socials: SocialLink[];
}

// TODO: replace placeholder names, roles and photos with the real team from the client.
export const team: TeamMember[] = [
  {
    name: "Name",
    role: "Senior solicitor",
    blurb:
      "Specialises in commercial law and business disputes with deep local knowledge",
    socials: [],
  },
  {
    name: "Name",
    role: "Solicitor",
    blurb: "Handles family law and wills with compassion and attention to detail",
    socials: [],
  },
  {
    name: "Name",
    role: "Solicitor",
    blurb:
      "Expert in conveyancing and property matters across South Australia",
    socials: [],
  },
  {
    name: "Name",
    role: "Solicitor",
    blurb: "Specialises in agribusiness and rural legal issues for farming families",
    socials: [],
  },
  {
    name: "Name",
    role: "Solicitor",
    blurb: "Handles criminal law matters with experience and strategic thinking",
    socials: [],
  },
  {
    name: "Name",
    role: "Solicitor",
    blurb: "Assists across all practice areas with dedication to client outcomes",
    socials: [],
  },
];

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
}

// TODO: replace placeholder article copy with real insights content from the client.
export const featuredArticle: Article = {
  slug: "anti-money-laundering-laws",
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
    category: "Property",
    readTime: "6 min read",
    title: "Conveyancing essentials for South Australian buyers",
    excerpt:
      "What to check before you sign, and what happens between contract and settlement.",
  },
  {
    slug: "estate-planning-young-children",
    category: "Family",
    readTime: "8 min read",
    title: "Estate planning when you have young children",
    excerpt:
      "Guardianship, testamentary trusts, and the decisions worth making early.",
  },
  {
    slug: "water-rights-farming-succession",
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
    category: "Business",
    readTime: "4 min read",
    title: "When to seek legal advice on partnerships",
    excerpt: "Getting it right from the start saves trouble later",
  },
  {
    slug: "rights-questioned-by-police",
    category: "Criminal",
    readTime: "6 min read",
    title: "Your rights if you're questioned by police",
    excerpt: "Know what to do when facing criminal allegations",
  },
  {
    slug: "separation-property-division",
    category: "Family",
    readTime: "7 min read",
    title: "Separation and property division explained",
    excerpt: "Understanding the process helps you plan ahead",
  },
  {
    slug: "leasing-agricultural-land",
    category: "Rural",
    readTime: "5 min read",
    title: "Leasing agricultural land, the right way",
    excerpt: "Protect your interests with a solid lease agreement",
  },
  {
    slug: "boundary-disputes",
    category: "Property",
    readTime: "5 min read",
    title: "Boundary disputes and how to resolve them",
    excerpt: "Early intervention often prevents expensive litigation",
  },
  {
    slug: "employment-law-basics",
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
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "How do I start?",
    answer:
      "Ring us or send an email. We'll discuss your situation and explain what comes next. There's no obligation, just honest advice.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We handle commercial law, agribusiness, wills and estates, conveyancing, family law, and criminal matters. If you're unsure whether we can help, ask anyway.",
  },
  {
    question: "How much will it cost?",
    answer:
      "Costs depend on your matter. We'll give you a clear picture upfront so there are no surprises. We work within your budget where possible.",
  },
  {
    question: "Do you offer fixed fees?",
    answer:
      "For some matters, yes. We'll discuss options and find an arrangement that suits you.",
  },
  {
    question: "How long will it take?",
    answer:
      "Timelines vary. Some matters resolve quickly; others take longer. We'll keep you informed every step of the way.",
  },
  {
    question: "Can you handle urgent matters?",
    answer:
      "We understand that legal problems don't always wait. Contact us immediately if you need urgent assistance.",
  },
];
