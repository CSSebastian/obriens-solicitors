import { defineArrayMember, defineField } from "sanity";

/** Plain text that the site splits into paragraphs on blank lines. */
export const paragraphsField = (
  name: string,
  title: string,
  extra: { description?: string; rows?: number; group?: string } = {},
) =>
  defineField({
    name,
    title,
    type: "text",
    rows: extra.rows ?? 8,
    group: extra.group,
    description:
      extra.description ??
      "Leave a blank line between paragraphs to start a new paragraph.",
  });

/** An image with hotspot (focal point) and required alt text. */
export const photoField = (
  name: string,
  title: string,
  extra: { description?: string; group?: string; decorative?: boolean } = {},
) =>
  defineField({
    name,
    title,
    type: "image",
    group: extra.group,
    description:
      extra.description ??
      "Click the crop icon to set the focal point — the part of the photo that must stay in view when it's cropped.",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Description (alt text)",
        type: "string",
        description:
          "Describe what's in the photo for people using screen readers and for Google.",
        validation: (rule) =>
          extra.decorative ? rule : rule.required().warning("Add a short description"),
      }),
    ],
  });

/** A list of short strings (bullet points, services, etc.). */
export const stringListField = (
  name: string,
  title: string,
  extra: { description?: string; group?: string } = {},
) =>
  defineField({
    name,
    title,
    type: "array",
    group: extra.group,
    description: extra.description,
    of: [defineArrayMember({ type: "string" })],
  });

/** Eyebrow + heading + intro, the shape most page sections share. */
export const sectionFields = (group?: string) => [
  defineField({ name: "eyebrow", title: "Small label above heading", type: "string", group }),
  defineField({ name: "heading", title: "Heading", type: "string", group }),
  defineField({ name: "intro", title: "Intro text", type: "text", rows: 3, group }),
];
