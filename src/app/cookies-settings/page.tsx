import type { Metadata } from "next";

import { LegalBlock, LegalPage } from "@/components/site/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Cookies settings",
  description: `How ${site.name} uses cookies on this website.`,
  alternates: { canonical: "/cookies-settings" },
};

// TODO: replace with real cookie controls if analytics or marketing cookies are added.
export default function CookiesSettingsPage() {
  return (
    <LegalPage
      title="Cookies settings"
      intro={`How ${site.name} uses cookies on this website.`}
    >
      <LegalBlock heading="What we use">
        This site currently sets no analytics or marketing cookies. Only the
        cookies strictly required to serve the site are used.
      </LegalBlock>
      <LegalBlock heading="Your choices">
        Because no optional cookies are set, there is nothing to configure. If
        that changes, controls will appear on this page.
      </LegalBlock>
    </LegalPage>
  );
}
