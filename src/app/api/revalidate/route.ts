import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { CONTENT_TAG } from "@/sanity/content";

/**
 * Sanity calls this when content is published, so changes go live straight
 * away instead of within the 60-second refresh. The request is signed with
 * SANITY_REVALIDATE_SECRET (set the same secret on the webhook in Sanity).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new Response("Revalidation is not configured", { status: 500 });
  }

  try {
    // `true` waits briefly so Sanity's CDN has the new content first.
    const { isValidSignature } = await parseBody(request, secret, true);
    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    revalidateTag(CONTENT_TAG, "max");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
