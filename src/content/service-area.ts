/**
 * Areas we service — shared by the home-page section, the interactive map and
 * the About page's Adelaide map. Coordinates are fixed (brief A9), so no
 * Geocoding/Places API is needed.
 */

export interface ServiceLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** primary = Berri office (emphasised), secondary = JL Lawyers (Adelaide). */
  kind: "primary" | "standard" | "secondary";
}

export const serviceLocations: ServiceLocation[] = [
  // TODO CONFIRM: verify the exact office position for 11 Riverview Drive.
  { id: "berri", name: "Berri", lat: -34.2826, lng: 140.6006, kind: "primary" },
  { id: "loxton", name: "Loxton", lat: -34.4503, lng: 140.5694, kind: "standard" },
  { id: "barmera", name: "Barmera", lat: -34.2546, lng: 140.4638, kind: "standard" },
  { id: "renmark", name: "Renmark", lat: -34.1747, lng: 140.7467, kind: "standard" },
  { id: "waikerie", name: "Waikerie", lat: -34.1781, lng: 139.9811, kind: "standard" },
  { id: "pinnaroo", name: "Pinnaroo", lat: -35.262, lng: 140.9053, kind: "standard" },
  // TODO CONFIRM: approximate coordinates — check the pin against the address.
  { id: "adelaide", name: "Adelaide", lat: -34.9228, lng: 138.6077, kind: "secondary" },
];

/** JL Lawyers Group — the firm's Adelaide partner. */
export const jlLawyers = {
  name: "JL Lawyers Group",
  address: "Level 1, 14 Ebenezer Place, Adelaide SA 5000",
  phone: "08 8227 1583",
  phoneHref: "tel:+61882271583",
  directionsHref:
    "https://www.google.com/maps/dir/?api=1&destination=Level+1%2C+14+Ebenezer+Place%2C+Adelaide+SA+5000",
} as const;

export const berriDirectionsHref =
  "https://www.google.com/maps/dir/?api=1&destination=11+Riverview+Drive+Berri+SA+5343";

export const areasCopy =
  "We're proud to look after families across South Australia. We see clients in Berri, Loxton, Barmera, Renmark, Waikerie, Pinnaroo and Adelaide, and right across the Riverland and the Mallee, so help is never far from home. And if distance makes it hard to get to us, we offer phone appointments anywhere in South Australia, with advice grounded in South Australian law.";

/** Text list shown next to the map — the map never carries info alone. */
export const areaList: { heading: string; text: string }[] = [
  {
    heading: "Riverland & Mallee",
    text: "Riverland · Mallee · Berri · Loxton · Barmera · Renmark · Waikerie · Pinnaroo",
  },
  {
    heading: "Adelaide",
    text: "via our partner, the JL Lawyers Group (Level 1, 14 Ebenezer Place, Adelaide)",
  },
  { heading: "Anywhere in SA", text: "phone appointments available" },
];

/** Region polygon (also published at /data/service-area.geojson). */
export const serviceAreaPath: { lat: number; lng: number }[] = [
  [-34.0, 139.75],
  [-34.0, 141.003],
  [-35.4, 141.003],
  [-35.4, 140.45],
  [-34.75, 140.3],
  [-34.45, 139.95],
].map(([lat, lng]) => ({ lat, lng }));
