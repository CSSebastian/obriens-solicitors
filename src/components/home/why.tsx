import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Eyebrow, Section } from "@/components/ui/section";
import { whyCards } from "@/content/site";

export function Why() {
  return (
    <Section tone="navy" id="why" className="scroll-mt-24">
      <Reveal className="flex flex-col items-center text-center">
        <Eyebrow>Why</Eyebrow>
        <h2 className="type-h2 mt-4">What sets us apart</h2>
        <p className="type-body mt-5 max-w-2xl">
          Nearly a century in practice means we&rsquo;ve seen it all. We know
          what works, and we know how to fight for results.
        </p>
      </Reveal>

      {/* Cards are animated by the pinned ScrollTrigger on lg screens (see
          ScrollMotion). Off pin — mobile or reduced motion — they simply show. */}
      <ul className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-8">
        {whyCards.map((card) => (
          <li
            key={card.title}
            data-why-card
            className="flex flex-col gap-6 text-center"
          >
            <PlaceholderImage ratio="16/9" />
            <div className="flex flex-col gap-3">
              {/* 40px desktop / 28px mobile — measured from the design PNGs. */}
              <h3 className="font-sans text-[1.75rem] leading-[1.2] font-medium tracking-[-0.015em] md:text-[2.5rem]">
                {card.title}
              </h3>
              <p className="type-small text-text-muted-on-dark">
                {card.caption}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-6 md:mt-16">
        <Button href="/about" variant="outline-inverse">
          Discover
        </Button>
        <ArrowLink href="#services">Our services</ArrowLink>
      </Reveal>
    </Section>
  );
}
