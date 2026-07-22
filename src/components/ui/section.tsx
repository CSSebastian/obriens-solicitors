import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export type SectionTone = "navy" | "navy-deep" | "surface" | "paper";

const toneClasses: Record<SectionTone, string> = {
  navy: "bg-navy text-text-on-dark",
  "navy-deep": "bg-navy-deep text-text-on-dark",
  surface: "bg-surface text-text-on-light",
  paper: "bg-paper text-text-on-light",
};

/** A full-bleed colour band with the standard vertical rhythm. */
export function Section({
  tone,
  id,
  children,
  className,
  contained = true,
}: {
  tone: SectionTone;
  id?: string;
  children: ReactNode;
  className?: string;
  /** Set false to lay out the inner container yourself. */
  contained?: boolean;
}) {
  return (
    <section id={id} className={cn(toneClasses[tone], "section-y", className)}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

/** Small bold serif label sitting above a section heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("type-eyebrow", className)}>{children}</p>;
}
