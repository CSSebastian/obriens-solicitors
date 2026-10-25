import type { ReactNode } from "react";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";

/**
 * Layout for the footer legal pages (privacy, terms, disclaimer, cookies, AML).
 * TODO APPROVAL: the wording on every page that uses this layout is a draft —
 * O'Briens must review and approve it before launch.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} intro={intro} />
      <Section tone="navy-deep">
        <div className="flex max-w-3xl flex-col gap-10">{children}</div>
      </Section>
    </>
  );
}

/** A headed section of a legal page. Use <LegalP> and <LegalList> inside. */
export function LegalBlock({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="type-h3">{heading}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="type-body text-text-muted-on-dark">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 type-body text-text-muted-on-dark"
        >
          <span aria-hidden>&bull;</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
