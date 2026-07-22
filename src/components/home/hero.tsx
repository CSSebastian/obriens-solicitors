import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="bg-navy text-text-on-dark">
      <Container>
        <div className="animate-fade-up flex flex-col items-center pt-16 pb-14 text-center md:pt-32 md:pb-24">
          {/* Design wraps the H1 onto two lines — 680px measured from the PNGs. */}
          <h1 className="type-display max-w-[43rem]">
            Legal counsel built to last
          </h1>
          <p className="type-body mt-6 max-w-3xl">
            {site.name} has been a trusted partner for individuals and
            businesses across South Australia since {site.established}. From the
            heart of Adelaide to Berri, the Riverland, Mallee and Pinnaroo, we
            are proud to provide far-reaching, dedicated legal support to our
            communities. We handle the matters that shape your life and
            livelihood with the care they deserve.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ContactTrigger variant="primary-inverse">Message</ContactTrigger>
            <Button href={site.phoneHref} variant="outline-inverse">
              Call
            </Button>
          </div>
        </div>

        <div className="pb-16 md:pb-28">
          <div data-parallax className="overflow-hidden">
            {/* LCP image — the only slot that sets `priority`. */}
            <Photo
              name="gavel-consultation"
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
