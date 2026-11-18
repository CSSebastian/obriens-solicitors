import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";

import { paragraphsField, photoField, sectionFields, stringListField } from "./fields";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About us page",
  type: "document",
  icon: InfoOutlineIcon,
  groups: [
    { name: "hero", title: "Top banner", default: true },
    { name: "firm", title: "The firm" },
    { name: "history", title: "Our history" },
    { name: "adelaide", title: "Adelaide" },
  ],
  fields: [
    defineField({ name: "hero", title: "Top banner", type: "object", group: "hero", fields: sectionFields() }),
    defineField({
      name: "firm",
      title: "The firm",
      type: "object",
      group: "firm",
      fields: [
        ...sectionFields(),
        stringListField("points", "Bullet points"),
        photoField("image", "Photo"),
      ],
    }),
    defineField({
      name: "history",
      title: "Our history",
      type: "object",
      group: "history",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above heading", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        paragraphsField("body", "Story", { rows: 16 }),
        defineField({
          name: "photos",
          title: "Photos",
          type: "array",
          of: [
            defineArrayMember({
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Description (alt text)", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "adelaide",
      title: "Adelaide partner",
      type: "object",
      group: "adelaide",
      fields: [
        ...sectionFields(),
        defineField({ name: "officeName", title: "Office name", type: "string" }),
        defineField({ name: "officeAddress", title: "Office address", type: "string" }),
        defineField({ name: "officePhone", title: "Office phone", type: "string" }),
        defineField({ name: "linkLabel", title: "Website link text", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "About us page" }) },
});

export const visitsPage = defineType({
  name: "visitsPage",
  title: "Home & hospital visits page",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Small label above heading", type: "string" }),
    defineField({ name: "title", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro text", type: "text", rows: 5 }),
    defineField({ name: "coverLabel", title: "List label", type: "string" }),
    stringListField("cover", "What we cover"),
    defineField({ name: "ctaHeading", title: "Closing banner heading", type: "string" }),
    defineField({ name: "ctaSubline", title: "Closing banner text", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Home & hospital visits page" }) },
});

const pageIntro = (name: string, title: string) =>
  defineField({ name, title, type: "object", fields: sectionFields() });

export const pageIntros = defineType({
  name: "pageIntros",
  title: "Other page headings",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    pageIntro("team", "Our team page"),
    pageIntro("practiceAreas", "Practice areas page"),
    pageIntro("insights", "Insights page"),
    pageIntro("contact", "Contact page"),
  ],
  preview: { prepare: () => ({ title: "Other page headings" }) },
});
