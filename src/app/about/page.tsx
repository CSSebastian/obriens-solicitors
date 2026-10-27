import type { Metadata } from "next";
import Image from "next/image";

import { Community } from "@/components/home/community";
import { ServiceAreaMap } from "@/components/home/service-area-map";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Headshot } from "@/components/ui/headshot";
import { Photo } from "@/components/ui/photo";
import { Eyebrow, Section } from "@/components/ui/section";
import { timHistory, timPhotos } from "@/content/history";
import { jlLawyers } from "@/content/service-area";
import { site, teamMemberById } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createMetadata({
  title: "About us",
  description: `${site.name} has served Berri and the Riverland since ${site.established}.`,
  path: "/about",
  ogTitle: `About ${site.name} — Berri & the Riverland since ${site.established}`,
});

export default function AboutPage() {
  const nathaniel = teamMemberById("nathaniel-nguyen");

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
              From our home in Berri, we provide dedicated legal support across
              the Riverland, the Mallee, Pinnaroo and Adelaide. We handle the
              matters that shape your life and livelihood with the care they
              deserve.
            </p>
            <p className="type-body mt-4 text-text-muted-on-dark">
              <a
                href={site.memberOf.href}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {site.memberOf.label}
              </a>
              .
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {[
                `In practice since ${site.established}`,
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

      {/* History — Tim O'Brien's story (full text supplied by the firm). */}
      <Section tone="surface" id="history">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Our history</Eyebrow>
            <h2 className="type-h2 mt-4">Tim O&rsquo;Brien and the Riverland</h2>
            <div className="mt-6 flex flex-col gap-4">
              {timHistory.map((paragraph) => (
                <p
                  key={paragraph}
                  className="type-body text-text-muted-on-light"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-40 lg:self-start">
            {timPhotos.map((photo) => (
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Adelaide — JL Lawyers Group partner. */}
      <Section tone="navy" id="adelaide">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Adelaide</Eyebrow>
            <h2 className="type-h2 mt-4">
              Our Adelaide Partner, JL Lawyers Group
            </h2>
            <p className="type-body mt-6">
              Heading to Adelaide? Our Company Director, Nathaniel, meets with
              clients at our Adelaide office, so you can see us in the city too.
              It&rsquo;s the same personal, family-focused service you know
              from home, available wherever it suits you best.
            </p>

            <address className="type-body mt-6 not-italic">
              <strong>{jlLawyers.name}</strong>
              <br />
              {jlLawyers.address}
              <br />
              <a
                href={jlLawyers.phoneHref}
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {jlLawyers.phone}
              </a>
            </address>
            <p className="type-body mt-4">
              <a
                href={site.memberOf.href}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Visit the JL Lawyers Group website
              </a>
            </p>

            {nathaniel ? (
              <div className="mt-8 flex items-center gap-5">
                <Headshot
                  id={nathaniel.id}
                  name={nathaniel.name}
                  role={nathaniel.role}
                  sizes="96px"
                  tone="surface"
                  size="badge"
                  className="size-24 shrink-0 border border-line-on-dark"
                />
                <p className="type-small">
                  <strong>{nathaniel.name}</strong>
                  <br />
                  {nathaniel.role}
                </p>
              </div>
            ) : null}
          </div>

          <ServiceAreaMap variant="adelaide" />
        </div>
      </Section>

      <Community />

      <CtaBand withImage={false} />
    </>
  );
}
