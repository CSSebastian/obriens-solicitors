import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { ArrowLink, Button } from "@/components/ui/button";
import { getContent } from "@/sanity/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Branded 404, shown for any address that doesn't match a page. */
export default async function NotFound() {
  const { site } = await getContent();
  return (
    <PageHero
      eyebrow="Page not found"
      title="Sorry, we can’t find that page"
      intro={`The page may have moved, or the address may have a typo. You can head back to the home page, browse our practice areas or call us on ${site.phone}.`}
    >
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button href="/" variant="primary-inverse">
          Back to home
        </Button>
        <ArrowLink href="/practice-areas">Practice areas</ArrowLink>
        <ArrowLink href="/contact">Contact us</ArrowLink>
      </div>
    </PageHero>
  );
}
