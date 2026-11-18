import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/client";

/**
 * Called by the Studio's live preview to switch on draft mode. The Studio
 * proves it's allowed to with a short-lived secret that this route checks
 * against Sanity using the read token.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
