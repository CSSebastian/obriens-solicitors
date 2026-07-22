import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Eyebrow } from "@/components/ui/section";
import { whyCards } from "@/content/site";

export function Why() {
  return (
    // The bare <section id="why"> is the node React owns and unmounts on a route
    // change. GSAP pins the inner [data-why-pin] band (see ScrollMotion), so the
    // pin-spacer GSAP injects lands *inside* this section rather than wrapping
    // it. React therefore never sees #why re-parented, and unmount can't throw
    // `removeChild` on a node GSAP has moved. Never move the tone/padding back
    // onto the <section> or pin the section directly — that reintroduces the
    // crash.
    <section id="why" className="scroll-mt-24">
      <div data-why-pin className="bg-navy text-text-on-dark section-y">
        <Container>
          <Reveal className="flex flex-col items-center text-center">
            <Eyebrow>Why</Eyebrow>
            <h2 className="type-h2 mt-4">What sets us apart</h2>
            <p className="type-body mt-5 max-w-2xl">
              Nearly a century in practice means we&rsquo;ve seen it all. We know
              what works, and we know how to fight for results.
            </p>
          </Reveal>

          {/* Cards are animated by the pinned ScrollTrigger on lg screens (see
              ScrollMotion). Off pin — mobile or reduced motion — they simply
              show. */}
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
        </Container>
      </div>
    </section>
  );
}
