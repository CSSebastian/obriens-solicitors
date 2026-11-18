import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

import { photoField, sectionFields, stringListField } from "./fields";

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[] = []) =>
  defineField({
    name,
    title,
    type: "object",
    group: name,
    fields: [...sectionFields(), ...fields],
  });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Top banner", default: true },
    { name: "services", title: "Services" },
    { name: "team", title: "Team" },
    { name: "why", title: "Why us" },
    { name: "areas", title: "Areas" },
    { name: "community", title: "Community" },
    { name: "history", title: "History" },
    { name: "insights", title: "Insights" },
    { name: "faqs", title: "FAQs" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Top banner",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "intro", title: "Intro text", type: "text", rows: 4 }),
        photoField("image", "Photo"),
      ],
    }),
    section("services", "Services overview"),
    section("team", "Meet the team"),
    section("why", "Why us", [
      defineField({
        name: "cards",
        title: "Cards",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "whyCard",
            fields: [
              defineField({ name: "title", title: "Title", type: "string" }),
              defineField({ name: "caption", title: "Text", type: "text", rows: 3 }),
              defineField({
                name: "href",
                title: "Link (optional)",
                type: "string",
                description: 'e.g. "#community" to scroll to the Community section.',
              }),
            ],
          }),
        ],
      }),
    ]),
    section("areas", "Areas we service", [
      defineField({
        name: "list",
        title: "Area list",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            name: "areaItem",
            fields: [
              defineField({ name: "heading", title: "Heading", type: "string" }),
              defineField({ name: "text", title: "Text", type: "string" }),
            ],
          }),
        ],
      }),
    ]),
    section("community", "Community support"),
    section("history", "History", [
      stringListField("points", "Bullet points"),
      photoField("image", "Photo"),
    ]),
    section("insights", "Insights"),
    section("faqs", "FAQs", [
      defineField({ name: "moreHeading", title: '"Still have questions?" heading', type: "string" }),
      defineField({ name: "moreText", title: '"Still have questions?" text', type: "text", rows: 3 }),
    ]),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
