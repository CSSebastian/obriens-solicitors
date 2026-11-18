import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HeartIcon } from "@sanity/icons/Heart";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { HomeIcon } from "@sanity/icons/Home";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { UserIcon } from "@sanity/icons/User";
import { UsersIcon } from "@sanity/icons/Users";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type { ComponentType } from "react";
import type { StructureBuilder, StructureResolver } from "sanity/structure";

import { canEditLocked, isFixedList, isLocked } from "./lock";

const singleton = (
  S: StructureBuilder,
  type: string,
  title: string,
  icon: ComponentType,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S, context) => {
  // Drag-to-reorder only for people who can edit that section.
  const ordered = (type: string, title: string, icon: ComponentType) =>
    (isLocked(type) || isFixedList(type)) && !canEditLocked(context.currentUser)
      ? S.documentTypeListItem(type).title(title).icon(icon)
      : orderableDocumentListDeskItem({ type, title, icon, S, context });

  return S.list()
    .title("Website")
    .items([
      singleton(S, "siteSettings", "Firm details", CogIcon),
      S.divider(),
      singleton(S, "homePage", "Home page", HomeIcon),
      singleton(S, "aboutPage", "About us page", InfoOutlineIcon),
      singleton(S, "visitsPage", "Home & hospital visits page", UserIcon),
      singleton(S, "pageIntros", "Other page headings", DocumentTextIcon),
      S.divider(),
      ordered("practiceArea", "Practice areas", CaseIcon),
      ordered("teamMember", "Team", UsersIcon),
      S.documentTypeListItem("article").title("Insights").icon(BulbOutlineIcon),
      ordered("faq", "FAQs", HelpCircleIcon),
      ordered("communityOrg", "Community organisations", HeartIcon),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Legal pages").icon(DocumentIcon),
    ]);
};
