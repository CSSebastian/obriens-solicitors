import type { Metadata } from "next";

import { LegalBlock, LegalP, LegalPage } from "@/components/site/legal-page";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms of service",
  description: `The terms that apply when you use the ${site.name} website.`,
  path: "/terms-of-service",
});

// TODO APPROVAL: O'Briens to review and approve before launch. Do not publish
// to the live domain until the final wording is approved. If O'Briens supplies
// its own terms, use those instead.
export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of service"
      intro={`The terms that apply when you use the ${site.name} website.`}
    >
      <LegalBlock heading="Acceptance of these terms">
        <LegalP>
          By using this website you agree to these terms. If you don&rsquo;t
          agree, please don&rsquo;t use the site. The website is operated by{" "}
          {site.name} (ABN {site.abn}), {site.address}.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="General information, not legal advice">
        <LegalP>
          The content on this website is general information only. It is not
          legal advice and shouldn&rsquo;t be relied on as a substitute for
          advice about your own circumstances. Please contact us for advice on
          your matter.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="No solicitor–client relationship">
        <LegalP>
          Using this website, sending us a message through the contact form,
          using the chat assistant, or receiving an automatic reply does not
          create a solicitor–client relationship. That relationship exists
          only once we have confirmed in writing that we act for you. The chat
          assistant is an automated tool: it does not give legal advice and
          its answers are not advice from a solicitor.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Accuracy and currency">
        <LegalP>
          We try to keep the website accurate and up to date, but the law
          changes and we give no warranty that content is complete or current.
          Check with us before acting on anything you read here.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Intellectual property">
        <LegalP>
          The text, design, logos and images on this website belong to{" "}
          {site.name} or are used with permission. You may view and print pages
          for your own personal, non-commercial use. You must not copy,
          reproduce or republish the content without our written permission.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Links to other sites">
        <LegalP>
          This website links to or embeds third-party services, including the
          JL Lawyers Group (www.jllaw.com.au) and Google Maps. We
          don&rsquo;t control those sites or services and aren&rsquo;t
          responsible for their content, availability or privacy practices.
          Their own terms apply when you use them.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Limitation of liability">
        <LegalP>
          To the extent the law allows, we are not liable for loss arising
          from your use of, or reliance on, this website. {site.liabilityStatement}
        </LegalP>
        <LegalP>
          Nothing in these terms excludes rights you have under the Australian
          Consumer Law that cannot be excluded.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Governing law">
        <LegalP>
          These terms are governed by the law of South Australia. You agree to
          the non-exclusive jurisdiction of the courts of South Australia.
        </LegalP>
      </LegalBlock>

      <LegalBlock heading="Changes to these terms">
        <LegalP>
          We may change these terms at any time by updating this page. Your
          continued use of the website means you accept the updated terms.
        </LegalP>
        <LegalP>
          Questions? Call {site.phone} or email {site.email}.
        </LegalP>
      </LegalBlock>
    </LegalPage>
  );
}
