import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import type { ImageKey } from "@/content/images";
import { site } from "@/content/site";

/** Closing call-to-action band, shared across pages. */
export function CtaBand({
  heading = "Ready to resolve your matter?",
  subline = "Get in touch with our team today for straightforward legal advice.",
  withImage = true,
  image = "gavel-consultation",
}: {
  heading?: string;
  subline?: string;
  withImage?: boolean;
  image?: ImageKey;
}) {
  return (
    <section className="bg-navy-deep text-text-on-dark">
      <Container>
        <div className="flex flex-col items-center py-16 text-center md:py-28">
          <h2 className="type-h2 max-w-3xl">{heading}</h2>
          <p className="type-body mt-5 max-w-2xl">{subline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ContactTrigger variant="primary-inverse">Contact</ContactTrigger>
            <Button href={site.phoneHref} variant="outline-inverse">
              Call
            </Button>
          </div>
        </div>

        {withImage ? (
          <div className="pb-16 md:pb-28">
            {/* Atmospheric closing band — decorative, the copy above carries the
                message, so it's hidden from screen readers. */}
            <Photo
              name={image}
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
