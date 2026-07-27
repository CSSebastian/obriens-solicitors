import Image from "next/image";

import { Monogram } from "@/components/ui/monogram";
import { teamPhoto } from "@/content/team-photos";
import { cn } from "@/lib/cn";

/**
 * A team member's headshot, falling back to the initials {@link Monogram} for
 * anyone the firm hasn't supplied a photo for.
 *
 * The source files are square and the box is square, so nothing is ever cropped
 * away — `object-cover` is belt-and-braces for a non-square box. The box sets
 * its own aspect ratio and `next/image` fills it, so the space is reserved
 * before the image loads and there's no layout shift; a blur placeholder covers
 * the load.
 */
export function Headshot({
  id,
  name,
  role,
  sizes,
  tone = "navy",
  size = "card",
  className,
}: {
  /** Team member id — the key into the headshot registry. */
  id: string;
  name: string;
  /** Included in the alt text alongside the name. */
  role: string;
  /** Responsive `sizes` hint, so the optimiser picks the right width. */
  sizes: string;
  /** Monogram fallback tone. */
  tone?: "navy" | "surface";
  /** Monogram fallback size. */
  size?: "card" | "badge";
  className?: string;
}) {
  const photo = teamPhoto(id);

  // Both branches carry the same box classes, so a member without a photo
  // occupies exactly the same space as one with — swapping a headshot in or out
  // can never change the card's layout.
  const box = cn("aspect-square", className);

  if (!photo) {
    return <Monogram name={name} tone={tone} size={size} className={box} />;
  }

  return (
    <div className={cn("relative overflow-hidden bg-placeholder", box)}>
      <Image
        src={photo.src}
        alt={`${name}, ${role}`}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        className="object-cover"
      />
    </div>
  );
}
