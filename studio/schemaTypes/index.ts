import { collections } from "./collections";
import { homePage } from "./homePage";
import { aboutPage, pageIntros, visitsPage } from "./pages";
import { siteSettings } from "./siteSettings";

export const SINGLETONS = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "visitsPage",
  "pageIntros",
] as const;

export const schemaTypes = [
  siteSettings,
  homePage,
  aboutPage,
  visitsPage,
  pageIntros,
  ...collections,
];
