#!/usr/bin/env node
/**
 * Manual IndexNow submission — run AFTER a production deploy to nudge Bing (and
 * the AI search products it feeds) to re-crawl the site immediately.
 *
 *   npm run indexnow
 *
 * It fetches the live sitemap, extracts every <loc>, and submits the list to
 * IndexNow. It exits 0 even on failure — this is a best-effort convenience, not
 * something that should ever block a pipeline.
 *
 * Config (all optional):
 *   SITE_URL       override the site origin (default https://www.obriens-solicitors.com)
 *   INDEXNOW_KEY   override the key (default matches /public/<key>.txt)
 */

const SITE_URL = (
  process.env.SITE_URL ?? "https://www.obriens-solicitors.com"
).replace(/\/$/, "");
const KEY = process.env.INDEXNOW_KEY ?? "1b2b97a033a052d61b24b82aaecd5b59";
const HOST = new URL(SITE_URL).host;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  console.log(`[indexnow] fetching ${sitemapUrl}`);

  let xml;
  try {
    const res = await fetch(sitemapUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (error) {
    console.warn(`[indexnow] could not fetch sitemap: ${error.message}`);
    console.warn("[indexnow] nothing submitted. Is the site deployed?");
    return; // exit 0 — best effort
  }

  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) =>
    m[1].trim(),
  );

  if (urls.length === 0) {
    console.warn("[indexnow] no <loc> URLs found in sitemap; nothing to do.");
    return;
  }

  console.log(`[indexnow] submitting ${urls.length} URL(s) for ${HOST}`);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList: urls,
      }),
    });
    if (res.ok) {
      console.log(`[indexnow] done — HTTP ${res.status} (accepted).`);
    } else {
      console.warn(
        `[indexnow] endpoint returned HTTP ${res.status}. See https://www.bing.com/indexnow for status meanings.`,
      );
    }
  } catch (error) {
    console.warn(`[indexnow] submission failed: ${error.message}`);
  }
}

main();
