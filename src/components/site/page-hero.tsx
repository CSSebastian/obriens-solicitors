import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";

/** Navy hero used by every page other than the home page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-navy text-text-on-dark">
      <Container>
        <div className="pt-16 pb-16 md:pt-28 md:pb-24">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="type-display mt-4 max-w-4xl">{title}</h1>
          {intro ? (
            <p className="type-body mt-6 max-w-2xl">{intro}</p>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
