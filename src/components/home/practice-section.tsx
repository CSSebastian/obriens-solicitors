import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Eyebrow, Section, type SectionTone } from "@/components/ui/section";
import type { PracticeArea } from "@/content/practice-areas";
import { cn } from "@/lib/cn";

/**
 * A single practice-area block: eyebrow, heading, tagline, a 2–3 paragraph
 * summary, the services list, an image, a "Read more" deep-page link and a
 * contact CTA. The `id` on the root is the nav anchor target.
 *
 * Rendered inside a coloured band by {@link PracticeSection}, or two-to-a-band
 * for the combined Criminal + Rural section.
 */
export function PracticeAreaBlock({
  area,
  onDark,
  imageSide = "right",
}: {
  area: PracticeArea;
  onDark: boolean;
  imageSide?: "left" | "right";
}) {
  const muted = onDark ? "text-text-muted-on-dark" : "text-text-muted-on-light";

  return (
    <div id={area.slug} className="scroll-mt-24">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Text column */}
        <Reveal className={imageSide === "left" ? "lg:order-2" : undefined}>
          <Eyebrow className={muted}>{area.eyebrow}</Eyebrow>
          <h2 className="type-h2 mt-3">{area.heading}</h2>
          <p className={cn("type-body mt-3 italic", muted)}>{area.tagline}</p>

          <div className="mt-6 flex max-w-xl flex-col gap-4">
            {area.summary.map((paragraph) => (
              <p key={paragraph} className="type-body">
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {area.services.map((service) => (
              <li key={service} className="flex gap-3 type-small">
                <span aria-hidden className={muted}>
                  &bull;
                </span>
                <span>{service}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ContactTrigger
              variant={onDark ? "primary-inverse" : "primary"}
              size="small"
            >
              {area.sensitive ? "Book a confidential consultation" : "Get in touch"}
            </ContactTrigger>
            {area.hasPage ? (
              <ArrowLink href={`/${area.slug}`} size="small">
                Read more about {area.navLabel.toLowerCase()}
              </ArrowLink>
            ) : null}
          </div>
        </Reveal>

        {/* Image column */}
        <Reveal
          delay={120}
          className={imageSide === "left" ? "lg:order-1" : undefined}
        >
          <div data-parallax className="overflow-hidden">
            <Photo
              name={area.image}
              ratio="4/3"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/** A practice-area block in its own coloured band (the common case). */
export function PracticeSection({
  area,
  tone,
  imageSide = "right",
}: {
  area: PracticeArea;
  tone: SectionTone;
  imageSide?: "left" | "right";
}) {
  const onDark = tone === "navy" || tone === "navy-deep";
  return (
    <Section tone={tone}>
      <PracticeAreaBlock area={area} onDark={onDark} imageSide={imageSide} />
    </Section>
  );
}
