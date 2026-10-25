import type { Metadata } from "next";

import {
  LegalBlock,
  LegalList,
  LegalP,
  LegalPage,
} from "@/components/site/legal-page";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createMetadata({
  title: "Cookies",
  description: `How ${site.name} uses cookies on this website.`,
  path: "/cookies-settings",
});

// TODO APPROVAL: O'Briens to review and approve before launch. Do not publish
// to the live domain until the final wording is approved.
// Update this page if analytics or marketing cookies are ever added. As built,
// this site sets no first-party cookies of its own.
export default function CookiesSettingsPage() {
  return (
    <LegalPage
      title="Cookies"
      intro={`How ${site.name} uses cookies on this website.`}
    >
      <LegalBlock heading="What cookies are">
        <LegalP>
          Cookies are small text files a website can store on your device.
          They are used to make sites work, remember choices and measure how a
          site is used.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="The cookies this site sets">
        <LegalP>
          This website does not set analytics or marketing cookies, and does
          not set any first-party cookies of its own. Some third-party services
          it relies on may set their own cookies or similar technologies:
        </LegalP>
        <LegalList
          items={[
            "Google Maps (the interactive map in “Areas we service” and on the About page) — Google may set cookies when the map loads, as described in Google's privacy policy. The map only loads when you scroll to it.",
            "Cloudflare Turnstile (spam protection on the contact form, where enabled) — may use cookies or browser storage to tell humans from bots.",
            "Our hosting provider — may use technical, security-related cookies strictly needed to deliver the site.",
          ]}
        />
      </LegalBlock>

      <LegalBlock heading="How to manage cookies">
        <LegalP>
          You can block or delete cookies in your browser settings. Blocking
          third-party cookies may affect how the map or contact form works. If
          we add analytics or marketing cookies in the future, controls will
          appear on this page and we will update this policy first.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Contact">
        <LegalP>
          Questions about cookies? Call {site.phone} or email {site.email}.
        </LegalP>
      </LegalBlock>
    </LegalPage>
  );
}
