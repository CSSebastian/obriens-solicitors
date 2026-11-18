import type { Metadata } from "next";
import Image from "next/image";

import { Community } from "@/components/home/community";
import { ServiceAreaMap } from "@/components/home/service-area-map";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Headshot } from "@/components/ui/headshot";
import { Photo } from "@/components/ui/photo";
import { Eyebrow, Section } from "@/components/ui/section";
import { teamMemberById } from "@/content/lookups";
import { createMetadata } from "@/lib/page-metadata";
import { getCleanContent, getContent } from "@/sanity/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getCleanContent();
  return createMetadata({
    title: "About us",
    description: `${site.name} has served Berri and the Riverland since ${site.established}.`,
    path: "/about",
    ogTitle: `About ${site.name} — Berri & the Riverland since ${site.established}`,
    siteName: site.name,
  });
}

export default async function AboutPage() {
  const { site, about, team } = await getContent();
  const { hero, firm, history, adelaide } = about;
  const nathaniel = teamMemberById(team, "nathaniel-nguyen");

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.heading}
        intro={hero.intro}
      />

      <Section tone="navy-deep">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>{firm.eyebrow}</Eyebrow>
            <h2 className="type-h2 mt-4">{firm.heading}</h2>
            <p className="type-body mt-6 text-text-muted-on-dark">
              {firm.intro}
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
              {firm.points.map((point) => (
                <li key={point} className="flex gap-3 type-small">
                  <span aria-hidden>&bull;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <Photo
            image={firm.image}
            ratio="3/2"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </Section>

      {/* History — Tim O'Brien's story (full text supplied by the firm). */}
      <Section tone="surface" id="history">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>{history.eyebrow}</Eyebrow>
            <h2 className="type-h2 mt-4">{history.heading}</h2>
            <div className="mt-6 flex flex-col gap-4">
              {history.body.map((paragraph) => (
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
            {history.photos.map((photo) => (
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                placeholder={photo.blurDataURL ? "blur" : "empty"}
                blurDataURL={photo.blurDataURL}
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
            <Eyebrow>{adelaide.eyebrow}</Eyebrow>
            <h2 className="type-h2 mt-4">{adelaide.heading}</h2>
            <p className="type-body mt-6">{adelaide.intro}</p>

            <address className="type-body mt-6 not-italic">
              <strong>{adelaide.officeName}</strong>
              <br />
              {adelaide.officeAddress}
              <br />
              <a
                href={adelaide.officePhoneHref}
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {adelaide.officePhone}
              </a>
            </address>
            <p className="type-body mt-4">
              <a
                href={site.memberOf.href}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {adelaide.linkLabel}
              </a>
            </p>

            {nathaniel ? (
              <div className="mt-8 flex items-center gap-5">
                <Headshot
                  photo={nathaniel.photo}
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
