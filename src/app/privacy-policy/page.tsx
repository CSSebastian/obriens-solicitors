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
  title: "Privacy policy",
  description: `How ${site.name} collects, uses, discloses and protects your personal information under the Privacy Act 1988 (Cth).`,
  path: "/privacy-policy",
});

// TODO APPROVAL: O'Briens to review and approve before launch. Do not publish
// to the live domain until the final wording is approved. If O'Briens supplies
// its own privacy policy, use that instead.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`How ${site.name} collects, uses, discloses and protects your personal information.`}
    >
      <LegalBlock heading="Who we are">
        <LegalP>
          {site.name} (ABN {site.abn}) is a law firm at {site.address}. We are
          bound by the Privacy Act 1988 (Cth) and the Australian Privacy
          Principles (APPs). This policy explains how we handle personal
          information collected through this website. It is separate from the
          confidentiality and privacy obligations that apply to the legal
          services we provide to our clients.
        </LegalP>
        <LegalP>
          Contact us about privacy on {site.phone} or at {site.email}.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="What personal information we collect">
        <LegalP>Through this website we may collect:</LegalP>
        <LegalList
          items={[
            "your first and last name, email address and (optionally) phone number, when you use the contact form",
            "the area of law your enquiry relates to, and the message you write",
            "messages you type into our website chat assistant",
            "technical information needed to deliver the site and keep it secure, such as your IP address and browser details",
            "website analytics information, if and when analytics are added to this site (this policy will be updated first)",
          ]}
        />
        <LegalP>
          Please don&rsquo;t include sensitive details (for example health
          information or details of a criminal matter) in the contact form or
          chat. Ring us instead.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="How we collect it">
        <LegalP>
          We collect personal information directly from you when you complete
          the contact form, use the chat assistant, phone or email us. We also
          receive limited technical information automatically when you visit
          the site.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Why we use it">
        <LegalList
          items={[
            "to respond to your enquiry and to arrange an appointment",
            "to assess whether we can act for you and to manage conflicts of interest",
            "to send you an automatic acknowledgement of your enquiry",
            "to keep the website secure and prevent spam and misuse (for example rate limiting)",
            "to meet our legal and professional obligations",
          ]}
        />
        <LegalP>
          We do not sell your personal information or use it for unrelated
          marketing.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Who we disclose it to">
        <LegalP>
          We use trusted service providers to run this website, and they may
          handle your information on our behalf. These include:
        </LegalP>
        <LegalList
          items={[
            "our email delivery service (so that enquiries reach us and acknowledgements reach you)",
            "our website hosting provider",
            "Google Maps, which loads when you view our map and receives technical information from your browser",
            "Cloudflare Turnstile, a spam-protection service on the contact form",
            "the AI provider that powers the website chat assistant, which processes the messages you type to produce a reply",
            "a rate-limiting service, which processes IP addresses to prevent abuse",
          ]}
        />
        <LegalP>
          We may also disclose information where required or authorised by law,
          or with your consent.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Disclosure overseas">
        <LegalP>
          Some of these providers store or process information outside
          Australia, including in the United States. We take reasonable steps
          to make sure they handle personal information in a way consistent
          with the APPs, and by submitting your information you understand it
          may be handled overseas.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Storage and security">
        <LegalP>
          We take reasonable steps to protect personal information from
          misuse, interference, loss and unauthorised access, using secure
          systems and restricted access. We keep information only for as long
          as we need it for the purposes above or as the law requires, and
          then securely destroy or de-identify it.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Access and correction">
        <LegalP>
          You can ask to see the personal information we hold about you, or
          ask us to correct it, by contacting us on {site.phone} or at{" "}
          {site.email}. We will respond within a reasonable time. In some cases
          we may be allowed or required to refuse access, and if so we will
          tell you why.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Complaints">
        <LegalP>
          If you think we have breached the APPs, contact us first and we will
          investigate and reply in writing. If you are not satisfied, you can
          complain to the Office of the Australian Information Commissioner
          (OAIC) at www.oaic.gov.au.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Updates to this policy">
        <LegalP>
          We may update this policy from time to time. The current version is
          always on this page. This policy takes effect on the date
          O&rsquo;Briens Solicitors approves and publishes it.
        </LegalP>
      </LegalBlock>
    </LegalPage>
  );
}
