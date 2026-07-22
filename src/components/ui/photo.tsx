import Image from "next/image";

import { images, type ImageKey } from "@/content/images";
import { cn } from "@/lib/cn";

/**
 * Photography slot backed by {@link images} and served through `next/image`.
 *
 * Renders a fixed-aspect box with the image `fill`ed and `object-cover`, so the
 * frame reserves its space up-front (no layout shift) and any crop is centred on
 * the focal point via `position`. `next/image` handles AVIF/WebP negotiation and
 * responsive `sizes`; a blur placeholder covers the load.
 *
 * Replaces the old grey `PlaceholderImage`. `alt` defaults to the image's
 * content description — pass `alt=""` where the image is decorative and the
 * surrounding copy already conveys the meaning.
 */
export function Photo({
  name,
  ratio = "16/9",
  sizes,
  priority = false,
  className,
  alt,
  position = "center",
}: {
  name: ImageKey;
  /** Tailwind-style aspect ratio, e.g. "16/9", "4/3", "1/1". */
  ratio?: string;
  /** Responsive `sizes` hint — required so the optimiser picks the right width. */
  sizes: string;
  /** Only the LCP image (the hero) should set this. */
  priority?: boolean;
  className?: string;
  /** Override the registry alt; pass "" to mark the image decorative. */
  alt?: string;
  /** `object-position` focal point, e.g. "center", "top", "50% 30%". */
  position?: string;
}) {
  const image = images[name];
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-placeholder",
        className,
      )}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
