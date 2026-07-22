import Image from "next/image";
import Link from "next/link";

import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Firm logo (client-supplied wordmark). Two colourways from the same artwork:
 * navy on light surfaces, off-white on navy surfaces. Background removed and
 * recoloured to the brand tokens — see /public/logo.png and /public/logo-light.png.
 */
export function Logo({
  tone = "dark",
  className,
  priority = false,
}: {
  /** "dark" = navy logo on a light bar, "light" = off-white logo on navy. */
  tone?: "dark" | "light";
  className?: string;
  /** Set on the above-the-fold header instance. */
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-80",
        className,
      )}
    >
      <Image
        src={tone === "dark" ? "/logo.png" : "/logo-light.png"}
        alt={site.name}
        width={1164}
        height={387}
        priority={priority}
        sizes="150px"
        className="h-10 w-auto"
      />
    </Link>
  );
}
