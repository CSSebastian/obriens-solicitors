import type { ReactNode } from "react";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";

/**
 * Simple stub layout for the footer legal pages.
 * TODO: replace placeholder copy with the client's approved wording.
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
        <div className="flex max-w-3xl flex-col gap-8">{children}</div>
      </Section>
    </>
  );
}

export function LegalBlock({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="type-h3">{heading}</h2>
      <p className="type-body mt-4 text-text-muted-on-dark">{children}</p>
    </div>
  );
}
