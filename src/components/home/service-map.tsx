"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import {
  berriDirectionsHref,
  jlLawyers,
  serviceAreaPath,
  serviceLocations,
  type ServiceLocation,
} from "@/content/service-area";
import { site } from "@/content/site";

/**
 * The interactive Google map itself. Loaded client-side only, and only once the
 * section scrolls into view (see service-area-map.tsx). Needs
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID (a vector
 * Map ID — required for AdvancedMarkerElement).
 */

// Palette tokens mirrored from globals.css (Google's Polygon API needs literals).
const SITE_BLUE = "#2a4373";
const SITE_GREEN = "#3f7d5c";

export type MapVariant = "region" | "adelaide";

function ServiceAreaPolygon() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const polygon = new google.maps.Polygon({
      paths: serviceAreaPath,
      fillColor: SITE_GREEN,
      fillOpacity: 0.2,
      strokeColor: SITE_BLUE,
      strokeWeight: 2,
      clickable: false,
    });
    polygon.setMap(map);
    return () => polygon.setMap(null);
  }, [map]);
  return null;
}

function FitBounds({ variant }: { variant: MapVariant }) {
  const map = useMap();
  useEffect(() => {
    if (!map || variant !== "region") return;
    const bounds = new google.maps.LatLngBounds();
    for (const point of serviceAreaPath) bounds.extend(point);
    const adelaide = serviceLocations.find((l) => l.id === "adelaide");
    if (adelaide) bounds.extend({ lat: adelaide.lat, lng: adelaide.lng });
    map.fitBounds(bounds, 40);
  }, [map, variant]);
  return null;
}

function Pin({ location }: { location: ServiceLocation }) {
  const size =
    location.kind === "primary" ? 26 : location.kind === "secondary" ? 18 : 14;
  const colour = location.kind === "secondary" ? SITE_GREEN : SITE_BLUE;
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        background: colour,
        border: "3px solid #ffffff",
        borderRadius: "50%",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}
    />
  );
}

function InfoBody({ location }: { location: ServiceLocation }) {
  const text = { color: "#14213d", fontSize: 14, lineHeight: 1.4 } as const;
  if (location.id === "berri") {
    return (
      <div style={text}>
        <strong>{site.name}</strong>
        <br />
        {site.address}
        <br />
        <a href={site.phoneHref}>{site.phone}</a>
        <br />
        <a href={berriDirectionsHref} target="_blank" rel="noreferrer noopener">
          Get directions
        </a>
      </div>
    );
  }
  if (location.id === "adelaide") {
    return (
      <div style={text}>
        <strong>{jlLawyers.name}</strong>
        <br />
        {jlLawyers.address}
        <br />
        <a href={jlLawyers.phoneHref}>{jlLawyers.phone}</a>
        <br />
        <a
          href={jlLawyers.directionsHref}
          target="_blank"
          rel="noreferrer noopener"
        >
          Get directions
        </a>
      </div>
    );
  }
  return (
    <div style={text}>
      <strong>{location.name}</strong>
    </div>
  );
}

export default function ServiceMap({
  apiKey,
  mapId,
  variant,
  onFail,
}: {
  apiKey: string;
  mapId: string;
  variant: MapVariant;
  onFail: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  // Google calls this global when the key is rejected (bad referrer, billing…).
  useEffect(() => {
    const w = window as unknown as { gm_authFailure?: () => void };
    w.gm_authFailure = onFail;
    return () => {
      delete w.gm_authFailure;
    };
  }, [onFail]);

  const locations =
    variant === "adelaide"
      ? serviceLocations.filter((l) => l.id === "adelaide")
      : serviceLocations;
  const open = locations.find((l) => l.id === openId);
  const berri = serviceLocations[0];

  return (
    <APIProvider apiKey={apiKey} onError={onFail}>
      <Map
        mapId={mapId}
        defaultCenter={
          variant === "adelaide"
            ? { lat: -34.9228, lng: 138.6077 }
            : { lat: berri.lat, lng: berri.lng }
        }
        defaultZoom={variant === "adelaide" ? 15 : 8}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        zoomControl
        style={{ width: "100%", height: "100%" }}
      >
        {variant === "region" ? <ServiceAreaPolygon /> : null}
        <FitBounds variant={variant} />
        {locations.map((location) => (
          <AdvancedMarker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            zIndex={location.kind === "primary" ? 3 : 1}
            onClick={() => setOpenId(location.id)}
          >
            <Pin location={location} />
          </AdvancedMarker>
        ))}
        {variant === "region" ? (
          <AdvancedMarker position={{ lat: -34.78, lng: 140.78 }} clickable={false}>
            <span
              style={{
                color: SITE_BLUE,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.04em",
                textShadow: "0 0 3px #fff, 0 0 3px #fff",
              }}
            >
              Riverland &amp; Mallee
            </span>
          </AdvancedMarker>
        ) : null}
        {open ? (
          <InfoWindow
            position={{ lat: open.lat, lng: open.lng }}
            pixelOffset={[0, -18]}
            onCloseClick={() => setOpenId(null)}
          >
            <InfoBody location={open} />
          </InfoWindow>
        ) : null}
      </Map>
    </APIProvider>
  );
}
