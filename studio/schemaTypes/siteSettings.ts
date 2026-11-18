import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { photoField, stringListField } from "./fields";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Firm details",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "firm", title: "Firm", default: true },
    { name: "contact", title: "Contact & hours" },
    { name: "footer", title: "Footer & legal" },
    { name: "cta", title: "Closing banner" },
  ],
  fields: [
    defineField({ name: "name", title: "Firm name", type: "string", group: "firm", validation: (r) => r.required() }),
    defineField({ name: "shortName", title: "Short name", type: "string", group: "firm" }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "firm" }),
    defineField({
      name: "description",
      title: "Site description",
      type: "text",
      rows: 3,
      group: "firm",
      description: "Shown in Google results and when the site is shared.",
    }),
    defineField({
      name: "established",
      title: "Year established",
      type: "number",
      group: "firm",
      validation: (r) => r.required().integer().min(1800).max(2100),
    }),
    defineField({ name: "abn", title: "ABN", type: "string", group: "firm" }),

    defineField({ name: "phone", title: "Phone", type: "string", group: "contact", validation: (r) => r.required() }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact", validation: (r) => r.required().email() }),
    stringListField("addressLines", "Address (one line per row)", { group: "contact" }),
    defineField({
      name: "postalAddress",
      title: "Address for Google (structured)",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "streetAddress", title: "Street", type: "string" }),
        defineField({ name: "addressLocality", title: "Town", type: "string" }),
        defineField({ name: "addressRegion", title: "State", type: "string" }),
        defineField({ name: "postalCode", title: "Postcode", type: "string" }),
      ],
    }),
    stringListField("hoursLines", "Business hours (one line per row)", { group: "contact" }),

    defineField({
      name: "memberOf",
      title: "Group membership",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "Link", type: "url" }),
      ],
    }),
    defineField({ name: "liabilityStatement", title: "Liability statement", type: "text", rows: 2, group: "footer" }),
    defineField({ name: "facebookLabel", title: "Facebook page name", type: "string", group: "footer" }),
    defineField({ name: "facebookUrl", title: "Facebook link", type: "url", group: "footer" }),

    defineField({
      name: "ctaHeading",
      title: "Heading",
      type: "string",
      group: "cta",
      description: "The banner shown above the footer on most pages.",
    }),
    defineField({ name: "ctaSubline", title: "Text", type: "string", group: "cta" }),
    photoField("ctaImage", "Photo", { group: "cta" }),
  ],
  preview: { prepare: () => ({ title: "Firm details" }) },
});
