import {
  BulbOutlineIcon,
  CaseIcon,
  DocumentIcon,
  HeartIcon,
  HelpCircleIcon,
  UsersIcon,
} from "@sanity/icons";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

import { paragraphsField, photoField, stringListField } from "./fields";

/** Simple rich text: paragraphs, headings, bullet lists, bold/italic and links. */
const richText = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: "array",
    group,
    of: [
      defineArrayMember({
        type: "block",
        styles: [
          { title: "Paragraph", value: "normal" },
          { title: "Heading", value: "h2" },
          { title: "Sub-heading", value: "h3" },
        ],
        lists: [
          { title: "Bullets", value: "bullet" },
          { title: "Numbered", value: "number" },
        ],
        marks: {
          decorators: [
            { title: "Bold", value: "strong" },
            { title: "Italic", value: "em" },
          ],
          annotations: [
            defineArrayMember({
              name: "link",
              type: "object",
              title: "Link",
              fields: [
                defineField({
                  name: "href",
                  title: "Link",
                  type: "url",
                  validation: (r) =>
                    r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                }),
              ],
            }),
          ],
        },
      }),
    ],
  });

export const practiceArea = defineType({
  name: "practiceArea",
  title: "Practice area",
  type: "document",
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "card", title: "Card & home section", default: true },
    { name: "page", title: "Own page" },
    { name: "seo", title: "Google" },
  ],
  fields: [
    orderRankField({ type: "practiceArea" }),
    defineField({ name: "title", title: "Title", type: "string", group: "card", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "card",
      readOnly: true,
      description: "Fixed — the page address is set in the website code.",
    }),
    defineField({ name: "navLabel", title: "Menu label", type: "string", group: "card" }),
    defineField({ name: "eyebrow", title: "Small label above heading", type: "string", group: "card" }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "card" }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "card" }),
    defineField({ name: "blurb", title: "Card text", type: "text", rows: 2, group: "card" }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      group: "card",
      options: {
        list: ["home", "gem", "briefcase", "scales", "shield", "tractor", "document", "fence"],
      },
    }),
    photoField("image", "Photo", { group: "card" }),
    stringListField("services", "Services list", { group: "card" }),
    paragraphsField("summary", "Home page text", { group: "card", rows: 8 }),
    defineField({
      name: "full",
      title: "Page sections",
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "object",
          name: "pageSection",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({ name: "text", title: "Text", type: "text", rows: 6 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "callouts",
      title: '"See also" links',
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "object",
          name: "callout",
          fields: [
            defineField({ name: "text", title: "Text", type: "string" }),
            defineField({ name: "linkLabel", title: "Link text", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "sensitive",
      title: "Sensitive area",
      type: "boolean",
      group: "page",
      description: "Shows a confidential-consultation message (used for Family law).",
    }),
    defineField({
      name: "keepCase",
      title: "Keep capitals mid-sentence",
      type: "boolean",
      group: "page",
      description: 'e.g. "Talk to us about Rural & Agribusiness" instead of lower case.',
    }),
    defineField({ name: "metaTitle", title: "Google title", type: "string", group: "seo" }),
    defineField({ name: "metaDescription", title: "Google description", type: "text", rows: 3, group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "tagline", media: "image" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  icon: UsersIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "teamMember" }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "ID",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "blurb", title: "One-line summary", type: "string" }),
    paragraphsField("bio", "Full bio"),
    defineField({
      name: "photo",
      title: "Headshot",
      type: "image",
      description: "Square photo. Leave empty to show initials instead.",
      options: { hotspot: true },
    }),
    defineField({
      name: "practiceAreas",
      title: "Practice areas",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "practiceArea" }] })],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const article = defineType({
  name: "article",
  title: "Insight article",
  type: "document",
  icon: BulbOutlineIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Feature on the home page",
      type: "boolean",
      description: "The featured article is shown large on the home page.",
    }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["Business", "Property", "Family", "Rural", "Criminal"] },
    }),
    defineField({ name: "readTime", title: "Read time", type: "string", description: 'e.g. "5 min read"' }),
    defineField({ name: "excerpt", title: "Summary", type: "text", rows: 3 }),
    photoField("image", "Photo"),
    richText("body", "Article text"),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "faq" }),
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    paragraphsField("answer", "Answer"),
  ],
  preview: { select: { title: "question" } },
});

export const communityOrg = defineType({
  name: "communityOrg",
  title: "Community organisation",
  type: "document",
  icon: HeartIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "communityOrg" }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logo", type: "image", validation: (r) => r.required() }),
    defineField({
      name: "tilePadding",
      title: "Logo size in tile",
      type: "string",
      initialValue: "p-5",
      options: {
        list: [
          { title: "Standard", value: "p-5" },
          { title: "Larger", value: "p-3" },
          { title: "Large", value: "p-2.5" },
          { title: "Extra large", value: "p-2" },
          { title: "Fill tile", value: "p-1.5" },
        ],
      },
    }),
    defineField({ name: "hidden", title: "Hide from website", type: "boolean" }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      readOnly: true,
      description: "Fixed — the page address is set in the website code.",
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
    defineField({ name: "metaDescription", title: "Google description", type: "text", rows: 3 }),
    richText("body", "Content"),
  ],
  preview: { select: { title: "title" } },
});

export const collections = [practiceArea, teamMember, article, faq, communityOrg, legalPage];
