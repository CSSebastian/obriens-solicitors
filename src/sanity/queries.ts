import { defineQuery } from "next-sanity";

/** Every image is projected to the same shape (see `toSiteImage`). */
const IMAGE = /* groq */ `{
  alt,
  hotspot,
  crop,
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } }
}`;

const SECTION = /* groq */ `{ eyebrow, heading, intro }`;

/**
 * The whole site's content in one request — it is small, and one cached
 * fetch keeps every page consistent with every other.
 */
export const CONTENT_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    ...,
    ctaImage${IMAGE}
  },
  "home": *[_id == "homePage"][0]{
    hero{ heading, intro, image${IMAGE} },
    services${SECTION},
    team${SECTION},
    why{ eyebrow, heading, intro, cards[]{ title, caption, href } },
    areas{ eyebrow, heading, intro, list[]{ heading, text } },
    community${SECTION},
    history{ eyebrow, heading, intro, points, image${IMAGE} },
    insights${SECTION},
    faqs{ eyebrow, heading, intro, moreHeading, moreText }
  },
  "about": *[_id == "aboutPage"][0]{
    hero${SECTION},
    firm{ eyebrow, heading, intro, points, image${IMAGE} },
    history{ eyebrow, heading, body, photos[]${IMAGE} },
    adelaide{ eyebrow, heading, intro, officeName, officeAddress, officePhone, linkLabel }
  },
  "visits": *[_id == "visitsPage"][0]{
    eyebrow, title, intro, coverLabel, cover, ctaHeading, ctaSubline
  },
  "pages": *[_id == "pageIntros"][0]{
    team${SECTION},
    practiceAreas${SECTION},
    insights${SECTION},
    contact${SECTION}
  },
  "practiceAreas": *[_type == "practiceArea" && defined(slug.current)] | order(orderRank){
    "slug": slug.current,
    navLabel, title, eyebrow, heading, tagline, blurb, icon,
    image${IMAGE},
    services, summary,
    full[]{ heading, text },
    callouts[]{ text, href, linkLabel },
    sensitive, keepCase, metaTitle, metaDescription
  },
  "team": *[_type == "teamMember" && defined(slug.current)] | order(orderRank){
    "id": slug.current,
    name, role, blurb, bio,
    photo${IMAGE},
    "practiceAreas": practiceAreas[]->slug.current
  },
  "articles": *[_type == "article" && defined(slug.current)] | order(featured desc, date desc){
    "slug": slug.current,
    title, category, readTime, excerpt, featured, date,
    image${IMAGE},
    body
  },
  "faqs": *[_type == "faq"] | order(orderRank){ question, answer },
  "community": *[_type == "communityOrg" && hidden != true] | order(orderRank){
    name, tilePadding, logo${IMAGE}
  },
  "legal": *[_type == "legalPage" && defined(slug.current)]{
    "slug": slug.current, title, intro, metaDescription, body
  }
}`);
