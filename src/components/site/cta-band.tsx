import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { site } from "@/content/site";

/** Closing call-to-action band, shared across pages. */
export function CtaBand({
  heading = "Ready to resolve your matter?",
  subline = "Get in touch with our team today for straightforward legal advice.",
  withImage = true,
}: {
  heading?: string;
  subline?: string;
  withImage?: boolean;
}) {
  return (
    <section className="bg-navy-deep text-text-on-dark">
      <Container>
        <div className="flex flex-col items-center py-16 text-center md:py-28">
          <h2 className="type-h2 max-w-3xl">{heading}</h2>
          <p className="type-body mt-5 max-w-2xl">{subline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" variant="solid-light">
              Contact
            </Button>
            <Button href={site.phoneHref} variant="outline-light">
              Call
            </Button>
          </div>
        </div>

        {withImage ? (
          <div className="pb-16 md:pb-28">
            <PlaceholderImage ratio="16/9" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
