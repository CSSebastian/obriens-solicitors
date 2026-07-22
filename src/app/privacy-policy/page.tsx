import type { Metadata } from "next";

import { LegalBlock, LegalPage } from "@/components/site/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy-policy" },
};

// TODO: replace with the firm's approved privacy policy.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`How ${site.name} collects, uses and protects your personal information.`}
    >
      <LegalBlock heading="Information we collect">
        We collect the information you provide through this website&rsquo;s
        contact form — your name, email address and the message you send — so
        that we can respond to your enquiry.
      </LegalBlock>
      <LegalBlock heading="How we use it">
        We use your information only to reply to you and to provide legal
        services you request. We do not sell or trade your personal information.
      </LegalBlock>
      <LegalBlock heading="Contact">
        For questions about this policy, email {site.email} or call {site.phone}.
      </LegalBlock>
    </LegalPage>
  );
}
