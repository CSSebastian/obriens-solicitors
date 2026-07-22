import type { Metadata } from "next";

import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Photo } from "@/components/ui/photo";
import { Eyebrow, Section } from "@/components/ui/section";
import { site, yearsInPractice } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createMetadata({
  title: "About us",
  description: `${site.name} has served Berri and the Riverland since ${site.established}.`,
  path: "/about",
  ogTitle: `About ${site.name} — Berri & the Riverland since ${site.established}`,
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="History"
        title="Built on trust, rooted in Berri"
        intro={`Since ${site.established}, ${site.name} has been part of this community. We've grown with Berri, learned its rhythms, and earned the confidence of generations.`}
      />

      <Section tone="navy-deep">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>The firm</Eyebrow>
            <h2 className="type-h2 mt-4">A local practice with real reach</h2>
            <p className="type-body mt-6 text-text-muted-on-dark">
              From the heart of Adelaide to Berri, the Riverland, Mallee and
              Pinnaroo, we are proud to provide far-reaching, dedicated legal
              support to our communities. We handle the matters that shape your
              life and livelihood with the care they deserve.
            </p>
            <p className="type-body mt-4 text-text-muted-on-dark">
              {site.memberOf.label}.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {[
                `Over ${Math.floor(yearsInPractice() / 5) * 5} years of legal practice`,
                "Trusted by individuals and businesses",
                "Deep roots in South Australia",
              ].map((point) => (
                <li key={point} className="flex gap-3 type-small">
                  <span aria-hidden>&bull;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <Photo
            name="lady-justice"
            ratio="15/16"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </Section>

      <CtaBand withImage={false} />
    </>
  );
}
