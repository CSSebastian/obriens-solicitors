"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Navigation } from "@/content/lookups";
import type { PracticeArea, Site, TeamMember } from "@/content/types";

/**
 * The slice of the Sanity content that client components need (header, menus,
 * modals, chat). Provided once by the root layout so the full content isn't
 * shipped to the browser on every page.
 */
export interface ClientContent {
  site: Site;
  nav: Navigation;
  team: TeamMember[];
  /** Practice-area labels and links for the team profile modal. */
  areas: Pick<PracticeArea, "slug" | "navLabel" | "hasPage">[];
}

const ContentContext = createContext<ClientContent | null>(null);

export function ContentProvider({
  value,
  children,
}: {
  value: ClientContent;
  children: ReactNode;
}) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ClientContent {
  const value = useContext(ContentContext);
  if (!value) throw new Error("useContent must be used inside <ContentProvider>");
  return value;
}
