import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow, Section } from "@/components/ui/section";
import type { PracticeArea } from "@/content/site";

/**
 * Shared template for the practice-area pages.
 * TODO: expand the placeholder copy with the client's own wording.
 */
export function PracticeAreaPage({ area }: { area: PracticeArea }) {
  return (
    <>
      <PageHero eyebrow="Practice area" title={area.heading} intro={area.intro} />

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
            {area.body.map((block) => (
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
        heading={`Talk to us about ${area.title.toLowerCase()}`}
        subline="Get in touch with our team today for straightforward legal advice."
        withImage={false}
      />
    </>
  );
}
