import Image from "next/image";
import Link from "next/link";

import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Firm logo — the designer's real vector wordmark (2026 refresh). Two colourways
 * cut from the same artwork: navy (#14213d) for light surfaces, off-white
 * (#f8f9fa) for navy surfaces. See /public/logo-dark.svg and /public/logo-light.svg
 * (intrinsic 500×200, a 2.5∶1 ratio).
 *
 * Served as SVG through next/image (`unoptimized` — SVG needs no rasterising and
 * stays razor-sharp at any size, including the header's scroll-collapse scale).
 * The width/height carry the true aspect ratio so the box never shifts layout.
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
        src={tone === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
        alt={site.name}
        width={500}
        height={200}
        priority={priority}
        unoptimized
        className="h-10 w-auto"
      />
    </Link>
  );
}
