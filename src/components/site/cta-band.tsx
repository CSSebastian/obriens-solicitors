import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import type { SiteImage } from "@/content/types";
import { getContent } from "@/sanity/content";

/**
 * Closing call-to-action band, shared across pages. The default heading, text
 * and photo are the "Closing banner" in Firm details (Sanity).
 */
export async function CtaBand({
  heading,
  subline,
  withImage = true,
  image,
}: {
  heading?: string;
  subline?: string;
  withImage?: boolean;
  image?: SiteImage;
}) {
  const { site, cta } = await getContent();
  const photo = image ?? cta.image;
  return (
    <section className="bg-navy-deep text-text-on-dark">
      <Container>
        <div className="flex flex-col items-center py-16 text-center md:py-28">
          <h2 className="type-h2 max-w-3xl">{heading ?? cta.heading}</h2>
          <p className="type-body mt-5 max-w-2xl">{subline ?? cta.subline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ContactTrigger variant="primary-inverse">Contact</ContactTrigger>
            <Button href={site.phoneHref} variant="outline-inverse">
              Call
            </Button>
          </div>
        </div>

        {withImage && photo ? (
          <div className="pb-16 md:pb-28">
            {/* Atmospheric closing band — decorative, the copy above carries the
                message, so it's hidden from screen readers. */}
            <Photo
              image={photo}
              ratio="16/9"
              alt=""
              sizes="(min-width: 1024px) 1216px, 100vw"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
