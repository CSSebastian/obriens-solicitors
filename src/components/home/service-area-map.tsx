"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { MapVariant } from "@/components/home/service-map";
import { cn } from "@/lib/cn";

// Client-only, and only fetched once the section is near the viewport.
const ServiceMap = dynamic(() => import("@/components/home/service-map"), {
  ssr: false,
});

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

/**
 * Interactive map with a static fallback. When the key/Map ID is missing, or
 * Google rejects the key, or the script fails to load, the static image of the
 * region is shown instead of an empty box. The text list of locations is always
 * rendered by the parent section, so nothing depends on the map.
 */
export function ServiceAreaMap({
  variant = "region",
  className,
}: {
  variant?: MapVariant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);
  const canLoad = Boolean(apiKey && mapId) && !failed;

  useEffect(() => {
    const el = ref.current;
    if (!el || !canLoad) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [canLoad]);

  const fallback =
    variant === "adelaide"
      ? { src: "/images/adelaide-static.png", alt: "Map showing JL Lawyers Group, Level 1, 14 Ebenezer Place, Adelaide" }
      : { src: "/images/service-area-static.png", alt: "Map of the Riverland and Mallee region O'Briens Solicitors services, with Berri, Loxton, Barmera, Renmark, Waikerie, Pinnaroo and Adelaide marked" };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Map of areas serviced by O'Briens Solicitors"
      className={cn(
        "relative h-80 w-full overflow-hidden border border-line-on-dark/20 bg-placeholder md:h-[26.25rem]",
        className,
      )}
    >
      {canLoad && visible ? (
        <ServiceMap
          apiKey={apiKey as string}
          mapId={mapId as string}
          variant={variant}
          onFail={onFail}
        />
      ) : !canLoad ? (
        // TODO CONFIRM: Google Maps key + Map ID not set (or rejected) — static
        // fallback shown until billing/API key are configured in Vercel.
        <Image
          src={fallback.src}
          alt={fallback.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}
