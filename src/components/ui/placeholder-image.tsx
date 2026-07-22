import { ImagePlaceholderIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Neutral grey block standing in for photography, matching the grey image
 * placeholders used throughout the design PNGs.
 *
 * TODO: replace with real photography from the client (swap for next/image).
 */
export function PlaceholderImage({
  ratio = "16/9",
  className,
  label,
}: {
  /** Tailwind aspect-ratio value, e.g. "16/9", "1/1", "3/2". */
  ratio?: string;
  className?: string;
  /** Accessible description, when the image carries meaning. */
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center bg-placeholder",
        className,
      )}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
      role={label ? "img" : "presentation"}
      aria-label={label}
    >
      <ImagePlaceholderIcon className="size-10 text-placeholder-glyph md:size-12" />
    </div>
  );
}
