import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Eyebrow, Section } from "@/components/ui/section";
import Link from "next/link";

import { getContent } from "@/sanity/content";

export async function History() {
  const copy = (await getContent()).home.history;

  return (
    <Section tone="navy" id="history" className="scroll-mt-38">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="type-h2 mt-4">
            <Link
              href="/about"
              className="transition-opacity hover:opacity-80"
            >
              {copy.heading}
            </Link>
          </h2>
          <p className="type-body mt-6 max-w-lg">
            {copy.intro}
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {copy.points.map((point) => (
              <li key={point} className="flex gap-3 type-small">
                <span aria-hidden>&bull;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/about" variant="outline-inverse">
              Learn
            </Button>
            <ArrowLink href="#services">Our services</ArrowLink>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div data-parallax className="overflow-hidden">
            <Photo
              image={copy.image}
              ratio="3/2"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
