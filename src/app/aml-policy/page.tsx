import type { Metadata } from "next";
import Link from "next/link";

import {
  LegalBlock,
  LegalList,
  LegalP,
  LegalPage,
} from "@/components/site/legal-page";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createMetadata({
  title: "AML policy",
  description: `How ${site.name} meets its obligations under the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth).`,
  path: "/aml-policy",
});

// TODO APPROVAL: O'Briens to review and approve before launch. Do not publish
// to the live domain until the final wording is approved. If O'Briens supplies
// its own AML policy, use that instead.
export default function AmlPolicyPage() {
  return (
    <LegalPage
      title="AML policy"
      intro={`How ${site.name} meets its anti-money laundering and counter-terrorism financing obligations.`}
    >
      <LegalBlock heading="Our obligations">
        <LegalP>
          The Anti-Money Laundering and Counter-Terrorism Financing Act 2006
          (Cth) (the AML/CTF Act) applies to legal practices that provide
          certain &ldquo;designated services&rdquo; from 2026. These can
          include assisting with buying or selling real estate or a business,
          managing client money or assets, and creating or operating companies
          and trusts. {site.name} complies with the Act where it applies to the
          work we do for you.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Customer identification and verification">
        <LegalP>
          Before we provide a designated service we are required to identify
          you and verify your identity using reliable and independent
          documents or data. For companies, trusts and other entities, we may
          also need to identify the people who own or control them.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Why we may ask for ID and source-of-funds information">
        <LegalP>
          You may be asked to provide:
        </LegalP>
        <LegalList
          items={[
            "photo identification, such as a driver licence or passport",
            "details about the source of the funds or wealth involved in a transaction",
            "information about the purpose of the matter and who is involved",
          ]}
        />
        <LegalP>
          These requests are routine. They are legal requirements, not a
          suggestion that anything is wrong, and we can&rsquo;t proceed with a
          designated service until they are met.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Record keeping">
        <LegalP>
          We keep the records the AML/CTF Act requires — including identity
          verification records and records about the services we provide —
          for the periods set out in the Act, and store them securely.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Reporting obligations">
        <LegalP>
          The law may require us to report certain transactions or suspicious
          matters to AUSTRAC, the national regulator. In some cases we are
          prohibited from telling you that a report has been made.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Privacy of the information we collect">
        <LegalP>
          Information collected for AML/CTF purposes is handled in line with
          our <Link href="/privacy-policy" className="underline underline-offset-4">
            privacy policy
          </Link>{" "}
          and the Privacy Act 1988 (Cth). We use it only for the purposes the
          law allows or requires.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Contact">
        <LegalP>
          Questions about identification or this policy? Call {site.phone} or
          email {site.email}.
        </LegalP>
      </LegalBlock>
    </LegalPage>
  );
}
