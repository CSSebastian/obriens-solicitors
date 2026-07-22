import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The design frame is 1440px wide with 80px gutters (20px on mobile),
 * giving a 1280px content column.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-(--container-frame) page-gutter",
        className,
      )}
    >
      {children}
    </div>
  );
}
