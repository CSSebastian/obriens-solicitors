import type { Metadata } from "next";

import { LegalBlock, LegalPage } from "@/components/site/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: `Terms governing your use of the ${site.name} website.`,
  alternates: { canonical: "/terms-of-service" },
};

// TODO: replace with the firm's approved terms of service.
export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of service"
      intro={`Terms governing your use of the ${site.name} website.`}
    >
      <LegalBlock heading="No legal advice">
        Information on this website, including answers from the website
        assistant, is general in nature and is not legal advice. No
        solicitor–client relationship is created by using this site.
      </LegalBlock>
      <LegalBlock heading="Accuracy">
        We take care to keep this site accurate and current, but we make no
        warranty that it is complete or error-free.
      </LegalBlock>
      <LegalBlock heading="Liability">{site.liabilityStatement}</LegalBlock>
    </LegalPage>
  );
}
