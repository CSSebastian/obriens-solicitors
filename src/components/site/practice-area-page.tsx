import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/ui/section";
import type { PracticeArea } from "@/content/practice-areas";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

/**
 * Shared template for the practice-area deep pages. These stay as real routes
 * for SEO and deep links; the home page carries a shorter `summary` of each.
 */
export function PracticeAreaPage({ area }: { area: PracticeArea }) {
  return (
    <>
      <JsonLd
        schema={[
          serviceSchema(area),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Practice areas", path: "/practice-areas" },
            { name: area.title, path: `/${area.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={area.eyebrow}
        title={area.heading}
        intro={area.tagline}
      >
        <div className="mt-6 flex max-w-2xl flex-col gap-4">
          {area.summary.map((paragraph) => (
            <p key={paragraph} className="type-body">
              {paragraph}
            </p>
          ))}
        </div>
      </PageHero>

      <Section tone="navy-deep">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <Eyebrow>What we handle</Eyebrow>
            <ul className="mt-6 flex flex-col gap-3">
              {area.services.map((service) => (
                <li key={service} className="flex gap-3 type-small">
                  <span aria-hidden>&bull;</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-10">
            {area.full.map((block) => (
              <div key={block.heading}>
                <h2 className="type-h3">{block.heading}</h2>
                <p className="type-body mt-4 max-w-2xl text-text-muted-on-dark">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand
        heading={
          area.sensitive
            ? "Talk to us, in confidence"
            : `Talk to us about ${area.title.toLowerCase()}`
        }
        subline={
          area.sensitive
            ? "Book a confidential consultation with our family lawyers — no pressure, and no obligation."
            : "Get in touch with our team today for straightforward legal advice."
        }
        withImage={false}
      />
    </>
  );
}
