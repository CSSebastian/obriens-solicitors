import { cn } from "@/lib/cn";

/** First letters of the first two words: "Jane Smith" → "JS". */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Square initials tile standing in for a headshot. The firm's current team all
 * have photos; this is the fallback {@link Headshot} renders for anyone added
 * without one (a new starter, say). Squared (like everything), brand-coloured,
 * and deliberate — it reads as a designed avatar rather than a "missing image".
 * The parent sets the box size (e.g. `aspect-square w-full` on a card,
 * `size-16` as a badge).
 */
export function Monogram({
  name,
  tone = "navy",
  size = "card",
  className,
}: {
  name: string;
  /** navy = dark tile / light initials; surface = light tile / navy initials. */
  tone?: "navy" | "surface";
  size?: "card" | "badge";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "flex items-center justify-center select-none",
        tone === "navy"
          ? "bg-navy text-text-on-dark"
          : "bg-surface text-text-on-light",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "font-sans font-medium tracking-[-0.02em]",
          size === "card" ? "text-5xl md:text-6xl" : "text-xl",
        )}
      >
        {initials(name)}
      </span>
    </div>
  );
}
