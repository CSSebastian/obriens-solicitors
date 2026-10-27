import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { whyCards, whyIntro } from "@/content/site";

export function Why() {
  return (
    <section id="why" className="scroll-mt-38">
      <div className="bg-navy text-text-on-dark section-y">
        <Container>
          <Reveal className="flex flex-col items-center text-center">
            <Eyebrow>Why</Eyebrow>
            <h2 className="type-h2 mt-4">What sets us apart</h2>
            <p className="type-body mt-5 max-w-2xl">{whyIntro}</p>
          </Reveal>

          <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card, index) => (
              <Reveal as="li" key={card.title} delay={(index % 3) * 80}>
                <Card tone="dark" className="h-full">
                  <CardBody className="gap-3">
                    <h3 className="type-h3">{card.title}</h3>
                    <p className="type-small text-text-muted-on-dark">
                      {card.caption}
                    </p>
                    {card.href ? (
                      <Link
                        href={card.href}
                        className="mt-auto inline-flex pt-2 type-small font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
                      >
                        See who we support
                      </Link>
                    ) : null}
                  </CardBody>
                </Card>
              </Reveal>
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
