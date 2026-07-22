import Link from "next/link";

import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Text stand-in for the firm's logo.
 * TODO: replace with the supplied logo SVG when it arrives from the client.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  /** "dark" = dark ink on a light bar, "light" = white ink on navy. */
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "inline-flex flex-col leading-none transition-opacity hover:opacity-80",
        tone === "dark" ? "text-text-on-light" : "text-text-on-dark",
        className,
      )}
    >
      <span className="font-sans text-lg font-medium tracking-[0.14em] uppercase">
        O&rsquo;Briens
      </span>
      <span className="type-xs tracking-[0.28em] uppercase opacity-70">
        Solicitors
      </span>
    </Link>
  );
}
