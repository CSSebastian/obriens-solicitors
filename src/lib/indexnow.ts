/**
 * IndexNow — instant index submission.
 *
 * Pinging IndexNow tells Bing (and, through it, Copilot, DuckDuckGo and several
 * AI search products) that URLs have changed, so they re-crawl in minutes rather
 * than days. It is fire-and-forget: every failure is swallowed and logged, never
 * thrown, so this can never break a build, a request, or a deploy step.
 *
 * The key is NOT a secret — it is published at /<key>.txt so IndexNow can verify
 * ownership. It may be overridden with the INDEXNOW_KEY env var.
 */

/** Public IndexNow key. Also served as /public/<key>.txt (do not delete that file). */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? "1b2b97a033a052d61b24b82aaecd5b59";

const ENDPOINT = "https://api.indexnow.org/indexnow";

export interface SubmitResult {
  ok: boolean;
  status?: number;
  submitted: number;
  error?: string;
}

/**
 * Submit one or more URLs to IndexNow. All URLs must belong to the same host.
 * Resolves to a result object; it never rejects.
 */
export async function submitUrls(
  urls: string[],
  options: { host: string; key?: string },
): Promise<SubmitResult> {
  const key = options.key ?? INDEXNOW_KEY;
  const { host } = options;
  const urlList = [...new Set(urls)].filter(Boolean);

  if (urlList.length === 0) {
    return { ok: true, submitted: 0 };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList,
      }),
    });

    // IndexNow returns 200 (accepted) or 202 (accepted, pending validation).
    const ok = res.ok;
    if (!ok) {
      console.warn(
        `[indexnow] submission returned HTTP ${res.status} for ${urlList.length} URL(s)`,
      );
    }
    return { ok, status: res.status, submitted: urlList.length };
  } catch (error) {
    // Network error, DNS, offline — never let this surface.
    console.warn("[indexnow] submission failed:", error);
    return {
      ok: false,
      submitted: urlList.length,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
