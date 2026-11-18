/**
 * Practice-area content — the single source of truth for both the home-page
 * sections and the deep SEO pages. Copy is tidied from the firm's live site
 * (www.obriens-solicitors.com); nothing here is invented.
 *
 * `summary` drives the home-page section (short, 2–3 paragraphs).
 * `full` drives the deep page (fuller blocks). Never duplicate copy across
 * files — a page or section renders from this module.
 */

import type { ImageKey } from "@/content/images";

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
  /** Nav / menu / card label. */
  navLabel: string;
  /** Card + section short title. */
  title: string;
  /** Section eyebrow. */
  eyebrow: string;
  /** Deep-page H1 / home-section H2. */
  heading: string;
  /** The style-guide-style italic sub-line, e.g. "Protecting your assets". */
  tagline: string;
  /** One-line blurb for the services-overview card. */
  blurb: string;
  icon: PracticeIcon;
  /** Home-section photography (see src/content/images.ts). */
  image: ImageKey;
  /** Optional `object-position` focal point for the home-section photo. */
  imagePosition?: string;
  services: string[];
  /** Home-page section body: 2–3 short paragraphs. */
  summary: string[];
  /** Deep-page body: fuller content blocks. */
  full: { heading: string; text: string }[];
  /** Deep-page <title>. */
  metaTitle: string;
  /** Deep-page meta description. */
  metaDescription: string;
  /** Family law: warm tone + a prominent confidential-consultation path. */
  sensitive?: boolean;
  /** Placeholder content awaiting the client — surfaced as a code TODO. */
  todo?: string;
  /** Whether this area has its own deep page (all nine do today). */
  hasPage: boolean;
  /** Optional "see also" links shown on the deep page (e.g. home visits). */
  callouts?: { text: string; href: string; linkLabel: string }[];
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: "conveyancing",
    navLabel: "Conveyancing",
    title: "Conveyancing",
    eyebrow: "Practice area",
    heading: "Conveyancing",
    tagline: "Individual and business conveyancing services",
    blurb:
      "Buying or selling property or a business, made smooth from valuation to settlement.",
    icon: "home",
    // Couple with the keys to their new home. Wide source, so the crop is
    // biased right to keep both people in frame.
    image: "conveyancing-keys",
    imagePosition: "90% 50%",
    services: [
      "Buying or selling a house",
      "Buying or selling a horticultural or farming property",
      "Buying or selling a business",
      "Property transfers",
      "Transfer of water rights",
      "Easements and subdivisions",
      "Preparation of contracts",
      "Preparation of Form 1s",
    ],
    summary: [
      "We provide comprehensive conveyancing for both individuals and businesses, with experienced solicitors across every aspect of conveyancing law.",
      "Buying or selling property is stressful, so we work to make it smooth and hassle-free, guiding you from the initial valuation to settlement.",
      "Specialist support for first home buyers: we'll guide you through the process with confidence.",
    ],
    full: [
      {
        heading: "From valuation through to settlement",
        text: "Buying or selling property is one of the largest transactions most people ever make, and it is rarely simple. We handle the legal detail — contracts, Form 1s, searches, and settlement — so the process stays smooth and hassle-free, and we keep you informed at each step from the initial valuation through to settlement.",
      },
      {
        heading: "Property, business and rural transfers",
        text: "We act on the sale and purchase of houses, of horticultural and farming properties, and of businesses, and we prepare property transfers. Rural and regional property brings its own complexity, and our strong network of industry contacts means we can draw on the right expertise whenever a matter calls for it. First home buyers get specialist support from us at every step.",
      },
      {
        heading: "Water rights, easements and subdivisions",
        text: "We advise on the transfer of water rights, easements over neighbouring land, and the process of subdividing a title — the matters that so often sit alongside a Riverland property transaction.",
      },
    ],
    metaTitle: "Conveyancing Solicitors in Berri",
    metaDescription:
      "Conveyancing services for individuals and businesses across Berri and the Riverland — buying or selling property, farming properties, businesses, water rights, easements and subdivisions.",
    hasPage: true,
  },
  {
    slug: "estate-planning",
    navLabel: "Estate planning",
    title: "Estate planning & probate",
    eyebrow: "Practice area",
    heading: "Estate planning and probate",
    tagline: "Protecting your assets",
    blurb:
      "Wills, powers of attorney and probate that protect your assets and your family.",
    icon: "gem",
    // No domestic/generational image in the set — the Lady Justice still-life
    // reads as calm and protective. TODO: warmer family/generational imagery.
    image: "lady-justice",
    services: [
      "Making your will",
      "Enduring power of attorney",
      "Advance care directive",
      "Probate",
      "Estate administration",
      "Succession planning implementation",
    ],
    summary: [
      "Estate planning makes sure your assets are protected and your wishes are carried out. Making a will is the best way to ensure your property is distributed as you intend — without one, the state decides. A will can also appoint a guardian for minor children.",
      "Good planning looks ahead to incapacity as well: appointing a power of attorney, or setting up a trust, so someone you trust can act if you no longer can.",
      "Estate administration is carrying those plans out — settling debts and distributing property. If you have been appointed executor, we guide you through obtaining probate and distributing the estate in accordance with the will.",
    ],
    full: [
      {
        heading: "Wills and guardianship",
        text: "Making a will is the best way to ensure your property is distributed as you intend; without one, the law decides for you. A will is also where guardianship of minor children is appointed. We draft wills that reflect what you actually want and explain the consequences of each decision in plain language before you sign.",
      },
      {
        heading: "Planning for incapacity",
        text: "Estate planning is not only about what happens after death. We help you appoint an enduring power of attorney, prepare an advance care directive, and — where it suits your circumstances — set up a trust, so your affairs can be managed if you are ever unable to manage them yourself.",
      },
      {
        heading: "Probate and estate administration",
        text: "Administering an estate is unfamiliar territory for most people. If you have been appointed executor, we guide you through obtaining probate, settling debts, and distributing the estate in accordance with the will, keeping the family informed throughout.",
      },
      {
        heading: "Succession planning",
        text: "For farming families and business owners, succession planning is about more than a will. We help implement the transfer of land, water and business interests to the next generation in a way that holds up over time.",
      },
    ],
    metaTitle: "Estate Planning & Probate Lawyers in Berri",
    metaDescription:
      "Wills, enduring powers of attorney, advance care directives, probate and estate administration in Berri and the Riverland. Protect your assets and carry out your wishes with O'Briens Solicitors.",
    hasPage: true,
    callouts: [
      {
        text: "Can't come to us? We offer home and hospital visits across the Riverland.",
        href: "/home-hospital-visits",
        linkLabel: "Home & hospital visits",
      },
    ],
  },
  {
    slug: "commercial-law",
    navLabel: "Commercial law",
    title: "Commercial law",
    eyebrow: "Practice area",
    heading: "Commercial law",
    tagline: "Understanding your rights",
    blurb:
      "Clear, practical advice for businesses of every size — from setup to sale.",
    icon: "briefcase",
    image: "commercial-meeting",
    services: [
      "Corporate advice",
      "Company incorporation",
      "Planning and development matters",
      "Sale of business assets",
      "Business and investment structures",
    ],
    summary: [
      "Commercial law governs the rights, relations and conduct of people and businesses in commerce, trade and sales — spanning advertising and marketing, collections and credit, contracts, negotiable instruments, secured transactions and transportation.",
      "Businesses need clarity on their rights and responsibilities. We support businesses of all sizes, from setting up the business and drafting contracts through to mergers and acquisitions.",
      "Throughout, we favour practical solutions that work over the long term, not just the quick answer.",
    ],
    full: [
      {
        heading: "Advice for businesses of every size",
        text: "Commercial law governs the rights, relations and conduct of people and businesses in commerce, trade and sales. Whatever the size of your business, you need a clear view of your rights and responsibilities before you commit — and we give you that in plain terms.",
      },
      {
        heading: "From incorporation to sale",
        text: "We support businesses from the very start — incorporating the company and putting the right structures in place — through the everyday work of contracts and corporate advice, and on to the sale of business assets, mergers and acquisitions.",
      },
      {
        heading: "Planning, development and structures",
        text: "We act on planning and development matters and advise on the business and investment structures that sit behind them, always favouring practical solutions built to work over the long term.",
      },
    ],
    metaTitle: "Commercial Lawyers in Berri",
    metaDescription:
      "Practical commercial law advice for Riverland businesses — corporate advice, company incorporation, contracts, sale of business assets, mergers and acquisitions, and investment structures.",
    hasPage: true,
  },
  {
    slug: "property-law",
    navLabel: "Property law",
    title: "Property law",
    eyebrow: "Practice area",
    heading: "Property law",
    tagline: "Property matters that go beyond conveyancing",
    blurb:
      "Boundaries, fences, easements and other property disputes that go beyond a sale or purchase.",
    icon: "fence",
    image: "property-aerial",
    services: [
      "Boundary disputes",
      "Encroachments",
      "Fences",
      "Easements and rights of way",
      "Adverse possession",
    ],
    summary: [
      "Not every property matter is a sale or a purchase. We act for landowners in disputes that sit outside conveyancing, including boundaries, encroachments, fences, easements and rights of way, and adverse possession.",
      "These problems are usually easier to resolve early, so we give you clear, practical advice on where you stand and the options open to you.",
    ],
    full: [
      {
        heading: "Property matters beyond conveyancing",
        text: "A large part of our property work has nothing to do with buying or selling. We advise landowners on disputes about boundaries, encroachments, fences, easements and rights of way, and adverse possession, with clear advice on your position and the practical options available.",
      },
      {
        heading: "Boundaries, fences and encroachments",
        text: "We advise on boundary disputes, on structures or plantings that cross a boundary, and on fencing issues between neighbours, working to resolve them early and practically wherever we can.",
      },
      {
        heading: "Easements, rights of way and adverse possession",
        text: "We advise on easements and rights of way over land, and on claims to land through adverse possession, whether you are making a claim or responding to one.",
      },
    ],
    metaTitle: "Property Lawyers in Berri",
    metaDescription:
      "Property law advice in Berri and the Riverland beyond conveyancing — boundary disputes, encroachments, fences, easements and rights of way, and adverse possession.",
    hasPage: true,
    callouts: [
      {
        text: "Related insight:",
        href: "/insights/boundary-disputes",
        linkLabel: "Boundary disputes and how to resolve them",
      },
    ],
  },
  {
    slug: "debt-collection",
    navLabel: "Debt collection",
    title: "Debt collection",
    eyebrow: "Practice area",
    heading: "Debt collection",
    tagline: "Recovering what you are owed",
    blurb:
      "Practical help recovering unpaid accounts and debts, for businesses and individuals.",
    icon: "document",
    image: "contract-review",
    services: [
      "Letters of demand",
      "Recovery of unpaid accounts and invoices",
      "Court proceedings to recover a debt",
      "Advice on your options when you are owed money",
    ],
    summary: [
      "When money you are owed goes unpaid, it can put real pressure on a business or a household. We help you recover it, with practical advice on the steps open to you and what each is likely to involve.",
      "We act for businesses and individuals, and we aim to resolve matters early wherever we can, so you can get back to running your business.",
    ],
    full: [
      {
        heading: "Recovering unpaid accounts and debts",
        text: "If an invoice or account has gone unpaid, we advise on the options available to you, from a letter of demand through to court proceedings, and explain the likely steps and costs before you decide how to proceed.",
      },
      {
        heading: "For businesses and individuals",
        text: "We act for Riverland businesses chasing unpaid accounts, and for individuals who are owed money. Wherever possible we work to resolve the matter early and practically.",
      },
    ],
    metaTitle: "Debt Collection Lawyers in Berri",
    metaDescription:
      "Debt collection advice in Berri and the Riverland, including letters of demand, recovery of unpaid accounts and invoices, and court proceedings to recover a debt.",
    todo: "client to confirm debt collection copy (drafted from the firm's practice-area list)",
    hasPage: true,
  },
  {
    slug: "family-law",
    navLabel: "Family law",
    title: "Family law",
    eyebrow: "Practice area",
    heading: "Family law",
    tagline: "Compassionate family lawyers in Berri",
    blurb:
      "Compassionate, confidential guidance through separation, property and parenting.",
    icon: "scales",
    image: "family-law-close",
    services: [
      "Divorce and family law matters",
      "Financial agreements",
      "Property settlements",
      "Spousal maintenance",
      "Child support, including limited child support agreements",
      "Parenting plans",
      "Family law watchlist orders",
      "Family violence intervention orders",
    ],
    summary: [
      "Family law matters are among the most emotionally charged issues anyone faces. We offer compassionate, professional guidance, and we tailor our advice to your situation rather than treating it as a template.",
      "Our experience runs across both property and children's matters, so whatever you are dealing with, you have someone beside you who has seen it before.",
      "If you would like to talk something through, a confidential consultation is available.",
    ],
    full: [
      {
        heading: "Guidance when it matters most",
        text: "Family law matters are among the most emotionally charged issues clients face. We offer compassionate, professional guidance and tailor our advice to your circumstances, with experience across both property and children's matters.",
      },
      {
        heading: "Property and financial matters",
        text: "We advise on property settlements, financial agreements, spousal maintenance and child support — including limited child support agreements — working towards outcomes that let you move forward.",
      },
      {
        heading: "Children and safety",
        text: "We assist with parenting plans, family law watchlist orders, and family violence intervention orders, always with your family's wellbeing at the centre.",
      },
    ],
    metaTitle: "Compassionate Family Lawyers in Berri",
    metaDescription:
      "Confidential, compassionate family law advice in Berri and the Riverland — divorce, property settlements, financial agreements, parenting, child support and intervention orders. Confidential consultations available.",
    sensitive: true,
    hasPage: true,
  },
  {
    slug: "criminal-law",
    navLabel: "Criminal law",
    title: "Criminal law",
    eyebrow: "Practice area",
    heading: "Criminal law",
    tagline: "Advice from the first contact",
    blurb:
      "Experienced representation from the first police contact through to court.",
    icon: "shield",
    image: "criminal-courtroom",
    services: [
      "Police interviews",
      "Bail applications",
      "Summary and indictable matters",
      "Court representation",
    ],
    summary: [
      "If you have been charged, or asked to attend an interview, the most important thing is to get advice before you say anything.",
      "We act with experience and a clear head, and we appear in Riverland courts regularly. Whatever the size of the matter, we prepare it properly.",
    ],
    full: [
      {
        heading: "Advice from the first contact",
        text: "What happens in the first 48 hours often shapes the whole matter. If you have been asked to attend a police interview, contact us first, so you understand your rights before you say anything.",
      },
      {
        heading: "Representation in court",
        text: "We appear in Riverland courts regularly, across both summary and indictable matters, and we prepare each case properly whatever its size.",
      },
    ],
    metaTitle: "Criminal Lawyers in Berri",
    metaDescription:
      "Criminal law advice and representation in Berri and the Riverland — police interviews, bail applications, and summary and indictable court matters.",
    todo: "client to supply criminal law copy",
    hasPage: true,
  },
  {
    slug: "rural-agribusiness",
    navLabel: "Rural & agribusiness",
    title: "Rural & agribusiness",
    eyebrow: "Practice area",
    heading: "Rural and agribusiness",
    tagline: "Solicitors who understand the land",
    blurb:
      "Solicitors who understand the land, water and the way rural business works.",
    icon: "tractor",
    // Stock wine-region vineyard shot. TODO: client may supply Riverland
    // vines/orchard/river imagery to replace it.
    image: "agribusiness-vineyard",
    services: [
      "Buying and selling farming and horticultural property",
      "Water rights, entitlements and transfers",
      "Farm leases and share-farming arrangements",
      "Rural business structures, partnerships and trusts",
      "Succession planning for farming families",
      "Farm machinery, supply and grower contracts",
    ],
    summary: [
      "Farming families need solicitors who understand the land and the complexities that come with it — from water entitlements to the way rural businesses are structured and passed on.",
      "We bring that local understanding to every rural matter, working alongside our conveyancing, commercial and estate-planning teams as each situation requires.",
    ],
    full: [
      {
        heading: "Local knowledge of rural matters",
        text: "From irrigated blocks along the Murray to dryland farms in the Mallee and around Pinnaroo, rural property and business in our region work differently. Farming families need solicitors who understand water, succession and the way agricultural businesses actually run, and we bring that understanding to every matter.",
      },
      {
        heading: "Farm and horticultural property",
        text: "We act on the purchase and sale of farming and horticultural properties, including the transfer of water rights that so often comes with them. We also prepare and review farm leases and share-farming arrangements, so that everyone knows where they stand before the season starts.",
      },
      {
        heading: "Water rights and entitlements",
        text: "Water is often worth as much as the land itself. We advise on water entitlements and allocations, and on transferring them, whether on their own or as part of a property sale, a restructure or a change in the family.",
      },
      {
        heading: "Structuring and passing on the family farm",
        text: "Many farms are run through partnerships, companies or family trusts. We help set up and review those structures, and we work with our estate-planning team on succession, so that the farm can pass to the next generation in a way that is fair to the whole family.",
      },
      {
        heading: "Contracts and everyday rural business",
        text: "We prepare and review the contracts that keep a rural business running, from machinery purchases to supply and grower agreements, and we can help when payments go unpaid.",
      },
    ],
    metaTitle: "Rural & Agribusiness Lawyers in Berri",
    metaDescription:
      "Rural and agribusiness legal advice in Berri, the Riverland and the Mallee: farm and horticultural property, water rights and transfers, farm leases, rural business structures and succession planning for farming families.",
    todo: "client to confirm rural & agribusiness copy (drafted from the firm's practice-area list and site content)",
    hasPage: true,
    callouts: [
      {
        text: "Related insight:",
        href: "/insights/water-rights-farming-succession",
        linkLabel: "Water rights and farming succession planning",
      },
      {
        text: "Related insight:",
        href: "/insights/leasing-agricultural-land",
        linkLabel: "Leasing agricultural land, the right way",
      },
    ],
  },
  {
    slug: "employment-law",
    navLabel: "Employment law",
    title: "Employment law",
    eyebrow: "Practice area",
    heading: "Employment law",
    tagline: "Clear advice for employers and employees",
    blurb:
      "Fair Work, unfair dismissal and workplace advice for employers and employees.",
    icon: "document",
    image: "employment-discussion",
    services: [
      "Unfair dismissals",
      "Workplace investigations, including discrimination, bullying and sexual harassment",
      "Review of employment contracts",
      "Employer representation",
      "Employee representation",
      "Redundancy advice",
      "Underpayments and unpaid entitlements",
    ],
    summary: [
      "Our key points of difference include representation before the Fair Work Commission, extensive expertise developed alongside leading employment law practitioners, thoroughly reviewing employment agreements and assisting with General Protections claims.",
    ],
    full: [],
    metaTitle: "Employment Lawyers in Berri",
    metaDescription:
      "Employment law advice for employers and employees in Berri and the Riverland — unfair dismissals, workplace investigations, employment contracts, redundancy and unpaid entitlements.",
    hasPage: true,
    callouts: [
      {
        text: "Related insight:",
        href: "/insights/employment-law-basics",
        linkLabel: "Employment law basics for small business owners",
      },
    ],
  },
];

export const practiceAreaBySlug = (slug: string): PracticeArea | undefined =>
  practiceAreas.find((area) => area.slug === slug);

/** Only the areas with their own deep page (for routes / sitemap). */
export const practiceAreasWithPages = practiceAreas.filter(
  (area) => area.hasPage,
);
