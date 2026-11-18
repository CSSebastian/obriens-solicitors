/**
 * One-off migration: copies the site's current copy and photography from the
 * code (src/content/*, the page files and the built legal pages) into Sanity.
 *
 *   SANITY_API_WRITE_TOKEN=... npx tsx scripts/sanity/seed.ts [path/to/legal-html]
 *
 * Safe to re-run: singletons are replaced, collection documents are matched by
 * slug/name and updated in place, and Sanity de-duplicates uploaded images.
 * The legal pages are converted from the HTML that `next build` rendered for
 * them before the site was switched to Sanity (pass the folder holding
 * privacy-policy.html, terms-of-service.html, … as the first argument).
 */

import { createReadStream, existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { htmlToBlocks } from "@portabletext/block-tools";
import { Schema } from "@sanity/schema";
import { JSDOM } from "jsdom";
import { createClient } from "next-sanity";

import { communityIntro, communityOrgs } from "@/content/community";
import { timHistory, timPhotos } from "@/content/history";
import { images, type ImageKey } from "@/content/images";
import { practiceAreas } from "@/content/practice-areas";
import { areaList, areasCopy, jlLawyers } from "@/content/service-area";
import {
  faqs,
  featuredArticle,
  recentArticles,
  site,
  team,
  whyCards,
  whyIntro,
} from "@/content/site";
import { teamPhotos } from "@/content/team-photos";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p0i7hr40",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-11-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const PUBLIC = join(process.cwd(), "public");
const legalDir = process.argv[2];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

const uploaded = new Map<string, string>();

/** Upload a file from /public (e.g. "/images/x.jpg") and return its asset id. */
async function upload(publicPath: string): Promise<string> {
  const cached = uploaded.get(publicPath);
  if (cached) return cached;
  const file = join(PUBLIC, publicPath);
  const asset = await client.assets.upload("image", createReadStream(file), {
    filename: basename(file),
  });
  uploaded.set(publicPath, asset._id);
  console.log(`  ↑ ${publicPath}`);
  return asset._id;
}

/** "90% 50%" / "60% center" → a Sanity hotspot centred on that point. */
function hotspotFrom(position?: string) {
  if (!position) return undefined;
  const toFraction = (v: string) =>
    v === "center" ? 0.5 : v === "top" || v === "left" ? 0 : v === "bottom" || v === "right" ? 1 : parseFloat(v) / 100;
  const [x, y = "center"] = position.trim().split(/\s+/);
  return { _type: "sanity.imageHotspot", x: toFraction(x), y: toFraction(y), width: 0.3, height: 0.3 };
}

async function photo(publicPath: string, alt?: string, position?: string) {
  const hotspot = hotspotFrom(position);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: await upload(publicPath) },
    ...(alt !== undefined ? { alt } : {}),
    ...(hotspot ? { hotspot } : {}),
  };
}

const sitePhoto = (key: ImageKey, position?: string) =>
  photo(images[key].src, images[key].alt, position);

const paragraphs = (list: string[]) => list.join("\n\n");

/** Fractional-index ranks for the orderable lists ("0|000100:", "0|000200:", …). */
const rank = (index: number) => `0|${((index + 1) * 100).toString(36).padStart(6, "0")}:`;

const withKeys = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

/** Find a document of `type` by a field value, so re-runs update in place. */
async function findId(type: string, field: string, value: string) {
  return client.fetch<string | null>(`*[_type == $type && ${field} == $value && !(_id in path("drafts.**"))][0]._id`, {
    type,
    value,
  });
}

async function upsert(type: string, field: string, value: string, doc: Record<string, unknown>) {
  const existing = await findId(type, field, value);
  if (existing) {
    await client.patch(existing).set(doc).commit();
    return existing;
  }
  const created = await client.create({ _type: type, ...doc });
  return created._id;
}

/* ------------------------------------------------------------------ */
/* Legal pages (HTML → Portable Text)                                  */
/* ------------------------------------------------------------------ */

const blockContentType = Schema.compile({
  name: "seed",
  types: [
    {
      name: "body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Sub-heading", value: "h3" },
          ],
          marks: {
            annotations: [{ name: "link", type: "object", fields: [{ name: "href", type: "url" }] }],
          },
        },
      ],
    },
  ],
}).get("body");

function legalBlocks(slug: string) {
  const file = join(legalDir, `${slug}.html`);
  if (!legalDir || !existsSync(file)) {
    console.warn(`  ! no rendered HTML for /${slug} — skipping its body`);
    return undefined;
  }
  const dom = new JSDOM(readFileSync(file, "utf8"));
  const container = dom.window.document.querySelector(".max-w-3xl.flex-col.gap-10");
  if (!container) throw new Error(`Couldn't find the content of /${slug}`);
  // Drop the decorative bullet glyphs; the list itself carries the bullets.
  container.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
  // Section headings are styled h2s already; flatten the wrappers.
  return htmlToBlocks(container.innerHTML, blockContentType, {
    parseHtml: (html) => new JSDOM(html).window.document,
  });
}

const legalPages = [
  {
    slug: "privacy-policy",
    title: "Privacy policy",
    intro: `How ${site.name} collects, uses, discloses and protects your personal information.`,
    metaDescription: `How ${site.name} collects, uses, discloses and protects your personal information under the Privacy Act 1988 (Cth).`,
  },
  {
    slug: "terms-of-service",
    title: "Terms of service",
    intro: `The terms that apply when you use the ${site.name} website.`,
    metaDescription: `The terms that apply when you use the ${site.name} website.`,
  },
  {
    slug: "disclaimer",
    title: "Website disclaimer",
    intro: `Important information about the content on the ${site.name} website.`,
    metaDescription: `Important information about the content on the ${site.name} website, and a warning about trust-money scams.`,
  },
  {
    slug: "cookies-settings",
    title: "Cookies",
    intro: `How ${site.name} uses cookies on this website.`,
    metaDescription: `How ${site.name} uses cookies on this website.`,
  },
  {
    slug: "aml-policy",
    title: "AML policy",
    intro: `How ${site.name} meets its anti-money laundering and counter-terrorism financing obligations.`,
    metaDescription: `How ${site.name} meets its obligations under the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth).`,
  },
];

/* ------------------------------------------------------------------ */
/* Run                                                                  */
/* ------------------------------------------------------------------ */

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error("Set SANITY_API_WRITE_TOKEN");

  console.log("Firm details");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: site.name,
    shortName: site.shortName,
    tagline: site.tagline,
    description: site.description,
    established: site.established,
    abn: site.abn,
    phone: site.phone,
    email: site.email,
    addressLines: [...site.addressLines],
    postalAddress: {
      streetAddress: site.postalAddress.streetAddress,
      addressLocality: site.postalAddress.addressLocality,
      addressRegion: site.postalAddress.addressRegion,
      postalCode: site.postalAddress.postalCode,
    },
    hoursLines: [...site.hoursLines],
    memberOf: { label: site.memberOf.label, href: site.memberOf.href },
    liabilityStatement: site.liabilityStatement,
    facebookLabel: site.socials[0]?.label,
    facebookUrl: site.socials[0]?.href,
    ctaHeading: "Ready to resolve your matter?",
    ctaSubline: "Get in touch with our team today for straightforward legal advice.",
    ctaImage: await sitePhoto("hero-documents"),
  });

  console.log("Home page");
  const firmIntro = `${site.name} has been a trusted partner for individuals and businesses across South Australia since ${site.established}. From our home in Berri, we provide dedicated legal support across the Riverland, the Mallee, Pinnaroo and Adelaide. We handle the matters that shape your life and livelihood with the care they deserve.`;
  const historyPoints = [
    `In practice since ${site.established}`,
    "Trusted by individuals and businesses",
    "Deep roots in South Australia",
  ];
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    hero: {
      heading: "Looking after local families for generations",
      intro: firmIntro,
      image: await sitePhoto("hero-farm-family"),
    },
    services: {
      eyebrow: "Services",
      heading: "Legal expertise across nine practice areas",
      intro: `${site.name} handles the full range of legal matters that affect individuals and businesses in Berri, the Riverland and across South Australia. Whatever brings you through our door, we have the experience and judgment to guide you through it.`,
    },
    team: {
      eyebrow: "People",
      heading: "Meet the team",
      intro: "Meet the local team who’ll look after you.",
    },
    why: {
      eyebrow: "Why",
      heading: "What sets us apart",
      intro: whyIntro,
      cards: withKeys(
        whyCards.map((c) => ({ _type: "whyCard", title: c.title, caption: c.caption, href: c.href })),
        "why",
      ),
    },
    areas: {
      eyebrow: "Where we work",
      heading: "Areas we service",
      intro: areasCopy,
      list: withKeys(areaList.map((a) => ({ _type: "areaItem", ...a })), "area"),
    },
    community: { eyebrow: "Community", heading: "Community support", intro: communityIntro },
    history: {
      eyebrow: "History",
      heading: "Built on trust, built in Berri",
      intro: `Since ${site.established}, ${site.name} has been part of this community. We’ve grown with Berri, learned its rhythms, and earned the confidence of generations.`,
      points: historyPoints,
      image: await sitePhoto("gavel-and-books", "60% center"),
    },
    insights: {
      eyebrow: "Insights",
      heading: "Practical guidance from our solicitors",
      intro: "Plain-language notes on the legal questions we are asked most often.",
    },
    faqs: {
      heading: "FAQs",
      moreHeading: "Still have questions?",
      moreText:
        "We’re here to help. Find answers to frequently asked questions with our chat bot. If it can’t help, we’ll direct your enquiry to our team.",
    },
  });

  console.log("About page");
  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    hero: {
      eyebrow: "History",
      heading: "Built on trust, built in Berri",
      intro: `Since ${site.established}, ${site.name} has been part of this community. We've grown with Berri, learned its rhythms, and earned the confidence of generations.`,
    },
    firm: {
      eyebrow: "The firm",
      heading: "A local practice with real reach",
      intro:
        "From our home in Berri, we provide dedicated legal support across the Riverland, the Mallee, Pinnaroo and Adelaide. We handle the matters that shape your life and livelihood with the care they deserve.",
      points: historyPoints,
      image: await sitePhoto("lady-justice"),
    },
    history: {
      eyebrow: "Our history",
      heading: "Tim O’Brien and the Riverland",
      body: paragraphs(timHistory),
      photos: await Promise.all(
        timPhotos.map(async (p, i) => ({ _key: `tim${i}`, ...(await photo(p.src, p.alt)) })),
      ),
    },
    adelaide: {
      eyebrow: "Adelaide",
      heading: "Our Adelaide Partner, JL Lawyers Group",
      intro:
        "Heading to Adelaide? Our Company Director, Nathaniel, meets with clients at our Adelaide office, so you can see us in the city too. It’s the same personal, family-focused service you know from home, available wherever it suits you best.",
      officeName: jlLawyers.name,
      officeAddress: jlLawyers.address,
      officePhone: jlLawyers.phone,
      linkLabel: "Visit the JL Lawyers Group website",
    },
  });

  console.log("Home & hospital visits page");
  await client.createOrReplace({
    _id: "visitsPage",
    _type: "visitsPage",
    eyebrow: "Visits",
    title: "Home & hospital visits",
    intro:
      "Planning ahead is one of the practical things you can do for your family. We help local families prepare Wills, Enduring Powers of Attorney and Advance Care Directives, explaining your options simply so your wishes are clear. As life changes, we'll help you update your plans so you can keep looking after your family for generations to come.",
    coverLabel: "We cover",
    cover: [
      "Preparation of Wills, Enduring Powers of Attorney and Advance Care Directives",
      "Estate planning and division of assets",
      "Other matters, considered case by case",
      "Visits to all Riverland towns",
    ],
    ctaHeading: "Arrange a visit",
    ctaSubline: `Call ${site.phone} to arrange a visit`,
  });

  console.log("Other page headings");
  await client.createOrReplace({
    _id: "pageIntros",
    _type: "pageIntros",
    team: { eyebrow: "People", heading: "Our people", intro: "Meet the local team who'll look after you." },
    practiceAreas: {
      eyebrow: "Services",
      heading: "Practice areas",
      intro: `${site.name} handles the full range of legal matters that affect individuals and businesses in South Australia.`,
    },
    insights: {
      eyebrow: "Insights",
      heading: "Practical guidance from our solicitors",
      intro: "Plain-language notes on the legal questions we are asked most often.",
    },
    contact: {
      eyebrow: "Write",
      heading: "Send your message",
      intro: "Tell us a little about your matter and we’ll be in touch.",
    },
  });

  console.log("Practice areas");
  const areaIds = new Map<string, string>();
  for (const [i, area] of practiceAreas.entries()) {
    const id = await upsert("practiceArea", "slug.current", area.slug, {
      orderRank: rank(i),
      title: area.title,
      slug: { _type: "slug", current: area.slug },
      navLabel: area.navLabel,
      eyebrow: area.eyebrow,
      heading: area.heading,
      tagline: area.tagline,
      blurb: area.blurb,
      icon: area.icon,
      image: await sitePhoto(area.image, area.imagePosition),
      services: area.services,
      summary: paragraphs(area.summary),
      full: withKeys(area.full.map((b) => ({ _type: "pageSection", ...b })), "full"),
      callouts: withKeys((area.callouts ?? []).map((c) => ({ _type: "callout", ...c })), "callout"),
      sensitive: Boolean(area.sensitive),
      keepCase: Boolean(area.keepCase),
      metaTitle: area.metaTitle,
      metaDescription: area.metaDescription,
    });
    areaIds.set(area.slug, id);
    console.log(`  ✓ ${area.title}`);
  }

  console.log("Team");
  for (const [i, member] of team.entries()) {
    const headshot = teamPhotos[member.id];
    await upsert("teamMember", "slug.current", member.id, {
      orderRank: rank(i),
      name: member.name,
      slug: { _type: "slug", current: member.id },
      role: member.role,
      blurb: member.blurb,
      bio: paragraphs(member.bio),
      ...(headshot ? { photo: await photo(headshot.src) } : {}),
      practiceAreas: member.practiceAreas
        .filter((slug) => areaIds.has(slug))
        .map((slug, j) => ({ _key: `pa${j}`, _type: "reference", _ref: areaIds.get(slug)! })),
    });
    console.log(`  ✓ ${member.name}`);
  }

  console.log("Insights");
  const articles = [featuredArticle, ...recentArticles];
  for (const [i, article] of articles.entries()) {
    await upsert("article", "slug.current", article.slug, {
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      featured: i === 0,
      // Newest first matches today's order: featured, then the others.
      date: `2026-11-${String(10 - i).padStart(2, "0")}`,
      category: article.category,
      readTime: article.readTime,
      excerpt: article.excerpt,
      image: await sitePhoto(article.image),
      ...(article.body?.length
        ? {
            body: article.body.map((text, j) => ({
              _key: `p${j}`,
              _type: "block",
              style: "normal",
              markDefs: [],
              children: [{ _key: `s${j}`, _type: "span", text, marks: [] }],
            })),
          }
        : {}),
    });
    console.log(`  ✓ ${article.title}`);
  }

  console.log("FAQs");
  for (const [i, faq] of faqs.entries()) {
    await upsert("faq", "question", faq.question, {
      orderRank: rank(i),
      question: faq.question,
      answer: paragraphs(faq.answer),
    });
  }

  console.log("Community organisations");
  for (const [i, org] of communityOrgs.entries()) {
    await upsert("communityOrg", "name", org.name, {
      orderRank: rank(i),
      name: org.name,
      logo: await photo(org.logo),
      tilePadding: org.tilePadding ?? "p-5",
      hidden: Boolean(org.hidden),
    });
  }

  console.log("Legal pages");
  for (const page of legalPages) {
    const body = legalBlocks(page.slug);
    await upsert("legalPage", "slug.current", page.slug, {
      title: page.title,
      slug: { _type: "slug", current: page.slug },
      intro: page.intro,
      metaDescription: page.metaDescription,
      ...(body ? { body } : {}),
    });
    console.log(`  ✓ ${page.title}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
