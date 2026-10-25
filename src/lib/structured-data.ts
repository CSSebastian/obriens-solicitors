/**
 * schema.org / JSON-LD builders.
 *
 * Every fact is derived from `src/content` — never hardcode a duplicated value
 * here. If a detail belongs to the firm (address, hours, practice areas), it
 * lives in `site.ts` / `practice-areas.ts` and is read from there, so the
 * structured data can never drift from what the site actually shows.
 *
 * These are plain functions returning plain objects. Render them with
 * {@link JsonLd} (see src/components/site/json-ld.tsx).
 */

import { practiceAreas, type PracticeArea } from "@/content/practice-areas";
import { faqs, site, team, type TeamMember } from "@/content/site";
import { teamPhoto } from "@/content/team-photos";

/** A JSON-LD node. Kept loose on purpose — schema.org shapes are open-ended. */
export type SchemaObject = Record<string, unknown>;

/** Stable @id for the firm, so other nodes can reference the one entity. */
export const ORGANIZATION_ID = `${site.url}/#organization` as const;
const WEBSITE_ID = `${site.url}/#website` as const;

/** Absolute URL helper — schema.org wants fully-qualified URLs. */
const abs = (path: string): string =>
  path.startsWith("http") ? path : `${site.url}${path}`;

const telephone = site.phoneHref.replace("tel:", "");

/**
 * `sameAs` — authoritative profiles that describe the same business. Socials
 * are folded in automatically; directory listings come from `externalListings`.
 * Returns undefined (rather than an empty array) so the property is omitted
 * cleanly until the client supplies real URLs.
 */
function sameAs(): string[] | undefined {
  const urls = [
    ...site.externalListings,
    ...site.socials.map((s) => s.href),
  ].filter(Boolean);
  return urls.length ? urls : undefined;
}

/**
 * The firm as a `LegalService` that is also a `LocalBusiness`. This is the
 * anchor entity of the whole site; everything else references its @id.
 */
export function organizationSchema(): SchemaObject {
  return prune({
    "@context": "https://schema.org",
    "@type": ["LegalService", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone,
    email: site.email,
    priceRange: "$$",
    // Both point at real, committed assets served from /public and the app dir.
    logo: abs("/icon.png"),
    image: abs("/opengraph-image"),
    // The firm's founding year: "Since 1920" (brief, global rule 4).
    foundingDate: String(site.established),
    address: {
      "@type": "PostalAddress",
      ...site.postalAddress,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: site.areaServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    // Mon–Fri 9–5; the absence of a weekend spec correctly signals closed.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    knowsAbout: practiceAreas.map((area) => area.heading),
    sameAs: sameAs(),
  });
}

/** FAQ rich-result data, generated from the on-page FAQ content. */
export function faqPageSchema(): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.join(" "),
      },
    })),
  };
}

/** A single practice area as a `Service` provided by the firm. */
export function serviceSchema(area: PracticeArea): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: area.metaTitle,
    description: area.metaDescription,
    serviceType: area.heading,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    url: abs(`/${area.slug}`),
    // The concrete things the firm does within this area.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${area.heading} services`,
      itemListElement: area.services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
  };
}

/** Breadcrumb trail. Pass items in order, root-first (e.g. Home → Area). */
export function breadcrumbSchema(
  items: { name: string; path: string }[],
): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/**
 * A team member as a `Person` who works for the firm, built from the team
 * data file.
 */
export function personSchema(member: TeamMember): SchemaObject {
  const photo = teamPhoto(member.id);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    description: member.blurb,
    worksFor: { "@id": ORGANIZATION_ID },
    // Only for people the firm has supplied a headshot for; the rest render a
    // monogram, which is not a photo of the person and must not be published
    // as their `image`.
    ...(photo ? { image: abs(photo.src) } : {}),
    ...(member.socials.length
      ? { sameAs: member.socials.map((s) => s.href) }
      : {}),
  };
}

/**
 * Person nodes for the team — only real, named people (placeholder "Name"
 * entries, if ever present, are skipped).
 */
export function teamPeopleSchema(): SchemaObject[] {
  return team
    .filter((member) => member.name.trim().toLowerCase() !== "name")
    .map(personSchema);
}

/** The site itself. No SearchAction — the site has no on-site search. */
export function websiteSchema(): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-AU",
  };
}

/**
 * Drop keys whose value is undefined (or an empty array) so optional facts —
 * `sameAs` before the client supplies URLs — never publish as empty noise.
 */
function prune(obj: SchemaObject): SchemaObject {
  const out: SchemaObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}
