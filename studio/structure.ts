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

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Website")
    .items([
      singleton(S, "siteSettings", "Firm details", CogIcon),
      S.divider(),
      singleton(S, "homePage", "Home page", HomeIcon),
      singleton(S, "aboutPage", "About us page", InfoOutlineIcon),
      singleton(S, "visitsPage", "Home & hospital visits page", UserIcon),
      singleton(S, "pageIntros", "Other page headings", DocumentTextIcon),
      S.divider(),
      orderableDocumentListDeskItem({
        type: "practiceArea",
        title: "Practice areas",
        icon: CaseIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({ type: "teamMember", title: "Team", icon: UsersIcon, S, context }),
      S.documentTypeListItem("article").title("Insights").icon(BulbOutlineIcon),
      orderableDocumentListDeskItem({ type: "faq", title: "FAQs", icon: HelpCircleIcon, S, context }),
      orderableDocumentListDeskItem({
        type: "communityOrg",
        title: "Community organisations",
        icon: HeartIcon,
        S,
        context,
      }),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Legal pages").icon(DocumentIcon),
    ]);
