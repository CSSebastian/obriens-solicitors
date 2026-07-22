import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The style guide's "Edgy Card": square corners, a thin border, and — when it
 * carries one — an image flush to the card's edge. Content sits in a padded
 * `CardBody`. Used for article, team and any image-led cards so they all read
 * as one component.
 *
 * `tone` picks the border/fill for the surface the card sits on:
 *   light — light sections (border defines the card against the same surface)
 *   dark  — navy sections (subtle light hairline + a hair-lifted navy fill)
 */
export function Card({
  as: Tag = "article",
  tone = "light",
  className,
  children,
}: {
  as?: ElementType;
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "flex flex-col overflow-hidden border",
        tone === "dark"
          ? "border-line-on-dark/20 bg-navy"
          : "border-line-on-light bg-surface",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Padded content region inside a {@link Card}. */
export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-3 p-5 md:p-6", className)}>
      {children}
    </div>
  );
}
