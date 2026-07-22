type ClassValue = string | number | null | undefined | false;

/** Minimal class-name joiner — no dependency needed for this project's needs. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
