import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { getContent } from "@/sanity/content";

export async function Hero() {
  const { site, home } = await getContent();
  const { hero } = home;
  return (
    <section className="bg-navy text-text-on-dark">
      <Container>
        <div className="animate-fade-up flex flex-col items-center pt-16 pb-14 text-center md:pt-32 md:pb-24">
          {/* Design wraps the H1 onto two lines — 680px measured from the PNGs. */}
          <h1 className="type-display max-w-[43rem]">{hero.heading}</h1>
          <p className="type-body mt-6 max-w-3xl">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ContactTrigger variant="primary-inverse">Message</ContactTrigger>
            <Button href={site.phoneHref} variant="outline-inverse">
              Call
            </Button>
          </div>
        </div>

        <div className="pb-16 md:pb-28">
          <div
            data-parallax
            data-parallax-scale="1.04"
            className="overflow-hidden"
          >
            {/* LCP image — the only slot that sets `priority`. */}
            <Photo
              image={hero.image}
              ratio="16/9"
              priority
              sizes="(min-width: 1024px) 1216px, 100vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
