/**
 * Fixed facts about the firm that are not editable copy — the site's address
 * on the web and the data search engines read from JSON-LD.
 */

export const SITE_URL = "https://www.obriens-solicitors.com";

/** Towns and the region the firm serves (JSON-LD `areaServed`). */
export const AREA_SERVED = [
  "Berri",
  "Renmark",
  "Loxton",
  "Barmera",
  "Waikerie",
  "Pinnaroo",
  "Riverland",
  "Mallee",
  "South Australia",
];

/** 11 Riverview Drive, Berri SA — used only for the JSON-LD `geo` block. */
export const GEO = { latitude: -34.2876, longitude: 140.6016 };
