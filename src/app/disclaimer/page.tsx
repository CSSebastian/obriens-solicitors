import type { Metadata } from "next";

import { LegalBlock, LegalP, LegalPage } from "@/components/site/legal-page";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createMetadata({
  title: "Website disclaimer",
  description: `Important information about the content on the ${site.name} website, and a warning about trust-money scams.`,
  path: "/disclaimer",
});

// TODO APPROVAL: O'Briens to review and approve before launch. Do not publish
// to the live domain until the final wording is approved. The scam warning
// wording is already used in O'Briens' email signature.
export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Website disclaimer"
      intro={`Important information about the content on the ${site.name} website.`}
    >
      <LegalBlock heading="General information only">
        <LegalP>
          The information on this website is general in nature. It is not legal
          advice, and it doesn&rsquo;t take your personal circumstances into
          account.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Seek specific advice">
        <LegalP>
          The law depends on the facts of each matter. Please speak to a
          solicitor before acting on anything you read on this site. You can
          reach us on {site.phone} or at {site.email}.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="No liability for reliance">
        <LegalP>
          To the extent the law allows, {site.name} accepts no liability for
          any loss or damage arising from reliance on the content of this
          website.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Professional standards scheme">
        <LegalP>{site.liabilityStatement}</LegalP>
      </LegalBlock>

      <LegalBlock heading="Scam warning">
        <LegalP>
          If you receive a request to deposit trust money into an O&rsquo;Briens
          Solicitors account, call us on {site.phone} to confirm the details.
        </LegalP>
      </LegalBlock>
    </LegalPage>
  );
}
