import { createImageUrlBuilder } from "@sanity/image-url";
import { stegaClean } from "next-sanity";
import { draftMode } from "next/headers";
import { cache } from "react";

import type {
  Article,
  PracticeArea,
  PracticeIcon,
  SiteContent,
  SiteImage,
  SocialLink,
} from "@/content/types";
import { AREA_SERVED, GEO, SITE_URL } from "@/content/constants";
import { client } from "@/sanity/client";
import { dataset, projectId } from "@/sanity/env";
import { CONTENT_QUERY } from "@/sanity/queries";

/** Tag on every content fetch; the publish webhook revalidates it. */
export const CONTENT_TAG = "sanity";

/** Without the webhook, published edits still appear within this many seconds. */
const REVALIDATE_SECONDS = 60;

/* ------------------------------------------------------------------ */
/* Fetch                                                               */
/* ------------------------------------------------------------------ */

async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // Outside a request (sitemap, build-time params): published content.
    return false;
  }
}

/**
 * All of the site's content, fetched once per request. Visitors get the
 * published content from Sanity's CDN (cached, see REVALIDATE_SECONDS); the
 * Studio's live preview runs in draft mode and gets unpublished edits with
 * click-to-edit markers.
 *
 * `stega: false` is for anything that is not visible page text — metadata,
 * JSON-LD, emails, the chat prompt.
 */
export const getContent = cache(async (stega = true): Promise<SiteContent> => {
  const preview = await isDraftMode();
  const raw = preview
    ? await client.fetch(CONTENT_QUERY, {}, {
        perspective: "drafts",
        useCdn: false,
        stega,
        token: process.env.SANITY_API_READ_TOKEN,
        cache: "no-store",
      })
    : await client.fetch(CONTENT_QUERY, {}, {
        stega: false,
        next: { revalidate: REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
      });
  return toSiteContent(raw);
});

/** Content without click-to-edit markers, for metadata and non-page output. */
export const getCleanContent = () => getContent(false);

/* ------------------------------------------------------------------ */
/* Mapping                                                             */
/* ------------------------------------------------------------------ */

type Raw = Awaited<ReturnType<typeof client.fetch<typeof CONTENT_QUERY>>>;
// The query result is loosely typed (no TypeGen yet); describe what we read.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const builder = createImageUrlBuilder({ projectId, dataset });

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

/** Split a multi-paragraph text field on blank lines. */
const paragraphs = (value: unknown): string[] =>
  text(value)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const section = (value: Any) => ({
  eyebrow: text(value?.eyebrow),
  heading: text(value?.heading),
  intro: text(value?.intro),
});

/** Sanity image → next/image-ready data, honouring the editor's crop and focal point. */
export function toSiteImage(image: Any, fallbackAlt = ""): SiteImage | undefined {
  const asset = image?.asset;
  const dims = asset?.metadata?.dimensions;
  if (!asset?.url || !dims) return undefined;

  const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const width = Math.round(dims.width * (1 - (crop.left ?? 0) - (crop.right ?? 0)));
  const height = Math.round(dims.height * (1 - (crop.top ?? 0) - (crop.bottom ?? 0)));
  const hasCrop = Boolean(crop.top || crop.bottom || crop.left || crop.right);

  // Hotspot is relative to the full image; re-express it inside the crop.
  let position: string | undefined;
  if (image.hotspot) {
    const x = (image.hotspot.x - (crop.left ?? 0)) / (1 - (crop.left ?? 0) - (crop.right ?? 0));
    const y = (image.hotspot.y - (crop.top ?? 0)) / (1 - (crop.top ?? 0) - (crop.bottom ?? 0));
    const pct = (n: number) => `${Math.round(Math.min(1, Math.max(0, n)) * 100)}%`;
    position = `${pct(x)} ${pct(y)}`;
  }

  return {
    src: hasCrop ? builder.image(image).url() : asset.url,
    width,
    height,
    alt: text(image.alt, fallbackAlt),
    blurDataURL: asset.metadata?.lqip ?? undefined,
    position,
  };
}

/** A required image: an empty frame rather than a crash if an editor removes it. */
const requiredImage = (image: Any, fallbackAlt = ""): SiteImage =>
  toSiteImage(image, fallbackAlt) ?? { src: "", width: 3, height: 2, alt: fallbackAlt };

const ICONS: PracticeIcon[] = [
  "home",
  "gem",
  "briefcase",
  "scales",
  "shield",
  "tractor",
  "document",
  "fence",
];

const digits = (value: string) => stegaClean(value).replace(/[^\d+]/g, "");

/** "08 8582 1288" → "tel:+61885821288" (Australian numbers). */
function telHref(phone: string): string {
  const d = digits(phone);
  if (d.startsWith("+")) return `tel:${d}`;
  return `tel:+61${d.replace(/^0/, "")}`;
}

function toSiteContent(raw: Raw): SiteContent {
  const r = (raw ?? {}) as Any;
  const s = r.settings ?? {};

  const addressLines = list(s.addressLines);
  const address = addressLines.join(", ");
  const hoursLines = list(s.hoursLines);
  const phone = text(s.phone);
  const email = text(s.email);
  const name = text(s.name, "O'Briens Solicitors");

  const socials: SocialLink[] = s.facebookUrl
    ? [{ platform: "facebook", label: text(s.facebookLabel, name), href: stegaClean(s.facebookUrl) }]
    : [];

  const practiceAreas: PracticeArea[] = (r.practiceAreas ?? []).map((a: Any) => ({
    slug: a.slug,
    navLabel: text(a.navLabel, text(a.title)),
    title: text(a.title),
    eyebrow: text(a.eyebrow),
    heading: text(a.heading, text(a.title)),
    tagline: text(a.tagline),
    blurb: text(a.blurb),
    icon: ICONS.includes(a.icon) ? a.icon : "document",
    image: requiredImage(a.image),
    services: list(a.services),
    summary: paragraphs(a.summary),
    full: (a.full ?? []).map((b: Any) => ({ heading: text(b?.heading), text: text(b?.text) })),
    callouts: (a.callouts ?? [])
      .filter((c: Any) => c?.href)
      .map((c: Any) => ({ text: text(c.text), href: c.href, linkLabel: text(c.linkLabel) })),
    sensitive: Boolean(a.sensitive),
    keepCase: Boolean(a.keepCase),
    hasPage: true,
    metaTitle: text(a.metaTitle, text(a.title)),
    metaDescription: text(a.metaDescription, text(a.blurb)),
  }));

  const articles: Article[] = (r.articles ?? []).map((a: Any) => ({
    slug: a.slug,
    title: text(a.title),
    category: text(a.category, "Business"),
    readTime: text(a.readTime),
    excerpt: text(a.excerpt),
    featured: Boolean(a.featured),
    date: a.date ?? undefined,
    image: requiredImage(a.image),
    body: Array.isArray(a.body) && a.body.length ? a.body : undefined,
  }));

  const h = r.home ?? {};
  const ab = r.about ?? {};
  const v = r.visits ?? {};
  const p = r.pages ?? {};

  return {
    site: {
      name,
      shortName: text(s.shortName, name),
      tagline: text(s.tagline),
      description: text(s.description),
      phone,
      phoneHref: telHref(phone),
      email,
      emailHref: `mailto:${stegaClean(email)}`,
      address,
      addressLines,
      postalAddress: {
        streetAddress: text(s.postalAddress?.streetAddress),
        addressLocality: text(s.postalAddress?.addressLocality),
        addressRegion: text(s.postalAddress?.addressRegion),
        postalCode: text(s.postalAddress?.postalCode),
        addressCountry: "AU",
      },
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stegaClean(address)).replace(/%20/g, "+")}`,
      geo: GEO,
      areaServed: AREA_SERVED,
      hours: hoursLines.join(", "),
      hoursLines,
      abn: text(s.abn),
      established: typeof s.established === "number" ? s.established : 1920,
      memberOf: { label: text(s.memberOf?.label), href: stegaClean(text(s.memberOf?.href)) },
      liabilityStatement: text(s.liabilityStatement),
      socials,
      externalListings: [],
      url: SITE_URL,
    },
    cta: {
      heading: text(s.ctaHeading, "Ready to resolve your matter?"),
      subline: text(s.ctaSubline),
      image: toSiteImage(s.ctaImage),
    },
    home: {
      hero: {
        heading: text(h.hero?.heading),
        intro: text(h.hero?.intro),
        image: requiredImage(h.hero?.image),
      },
      services: section(h.services),
      team: section(h.team),
      why: {
        ...section(h.why),
        cards: (h.why?.cards ?? []).map((c: Any) => ({
          title: text(c?.title),
          caption: text(c?.caption),
          href: c?.href || undefined,
        })),
      },
      areas: {
        ...section(h.areas),
        list: (h.areas?.list ?? []).map((i: Any) => ({ heading: text(i?.heading), text: text(i?.text) })),
      },
      community: section(h.community),
      history: {
        ...section(h.history),
        points: list(h.history?.points),
        image: requiredImage(h.history?.image),
      },
      insights: section(h.insights),
      faqs: {
        ...section(h.faqs),
        moreHeading: text(h.faqs?.moreHeading),
        moreText: text(h.faqs?.moreText),
      },
    },
    about: {
      hero: section(ab.hero),
      firm: { ...section(ab.firm), points: list(ab.firm?.points), image: requiredImage(ab.firm?.image) },
      history: {
        eyebrow: text(ab.history?.eyebrow),
        heading: text(ab.history?.heading),
        body: paragraphs(ab.history?.body),
        photos: (ab.history?.photos ?? [])
          .map((ph: Any) => toSiteImage(ph))
          .filter((ph: SiteImage | undefined): ph is SiteImage => Boolean(ph)),
      },
      adelaide: {
        ...section(ab.adelaide),
        officeName: text(ab.adelaide?.officeName),
        officeAddress: text(ab.adelaide?.officeAddress),
        officePhone: text(ab.adelaide?.officePhone),
        officePhoneHref: telHref(text(ab.adelaide?.officePhone)),
        linkLabel: text(ab.adelaide?.linkLabel),
      },
    },
    visits: {
      eyebrow: text(v.eyebrow),
      title: text(v.title),
      intro: text(v.intro),
      coverLabel: text(v.coverLabel),
      cover: list(v.cover),
      ctaHeading: text(v.ctaHeading),
      ctaSubline: text(v.ctaSubline),
    },
    pages: {
      team: section(p.team),
      practiceAreas: section(p.practiceAreas),
      insights: section(p.insights),
      contact: section(p.contact),
    },
    practiceAreas,
    team: (r.team ?? []).map((m: Any) => ({
      id: m.id,
      name: text(m.name),
      role: text(m.role),
      blurb: text(m.blurb),
      bio: paragraphs(m.bio),
      practiceAreas: list(m.practiceAreas),
      photo: toSiteImage(m.photo),
      socials: [],
    })),
    articles,
    faqs: (r.faqs ?? []).map((f: Any) => ({ question: text(f.question), answer: paragraphs(f.answer) })),
    community: (r.community ?? [])
      .map((o: Any) => ({
        name: text(o.name),
        logo: toSiteImage(o.logo),
        tilePadding: stegaClean(text(o.tilePadding, "p-5")),
      }))
      .filter((o: { logo?: SiteImage }) => Boolean(o.logo)),
    legal: (r.legal ?? []).map((l: Any) => ({
      slug: l.slug,
      title: text(l.title),
      intro: text(l.intro),
      metaDescription: text(l.metaDescription),
      body: Array.isArray(l.body) ? l.body : [],
    })),
  };
}
