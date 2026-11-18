import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

const home = { title: "Home page", href: "/" };

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/", filter: `_type == "homePage"` },
    { route: "/about", filter: `_type == "aboutPage"` },
    { route: "/home-hospital-visits", filter: `_type == "visitsPage"` },
    { route: "/insights/:slug", filter: `_type == "article" && slug.current == $slug` },
    { route: "/:slug", filter: `_type in ["practiceArea", "legalPage"] && slug.current == $slug` },
  ]),
  locations: {
    siteSettings: defineLocations({ message: "Used on every page", locations: [home] }),
    homePage: defineLocations({ locations: [home] }),
    aboutPage: defineLocations({ locations: [{ title: "About us", href: "/about" }] }),
    visitsPage: defineLocations({
      locations: [{ title: "Home & hospital visits", href: "/home-hospital-visits" }],
    }),
    pageIntros: defineLocations({
      locations: [
        { title: "Our team", href: "/team" },
        { title: "Practice areas", href: "/practice-areas" },
        { title: "Insights", href: "/insights" },
        { title: "Contact", href: "/contact" },
      ],
    }),
    practiceArea: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? "Practice area", href: `/${doc?.slug}` },
          home,
        ],
      }),
    }),
    teamMember: defineLocations({
      locations: [
        { title: "Our team", href: "/team" },
        home,
      ],
    }),
    article: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? "Article", href: `/insights/${doc?.slug}` },
          { title: "Insights", href: "/insights" },
        ],
      }),
    }),
    faq: defineLocations({ locations: [home] }),
    communityOrg: defineLocations({
      locations: [home, { title: "About us", href: "/about" }],
    }),
    legalPage: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title ?? "Legal page", href: `/${doc?.slug}` }],
      }),
    }),
  },
};
