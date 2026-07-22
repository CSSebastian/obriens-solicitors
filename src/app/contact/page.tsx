import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { ArrowLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact us",
  description: `Send a message to ${site.name} in Berri, South Australia, or call ${site.phone}.`,
  path: "/contact",
  ogTitle: `Contact ${site.name} — Berri, South Australia`,
});

export default function ContactPage() {
  return (
    <section className="bg-navy text-text-on-dark">
      <Container>
        <div className="pt-16 pb-20 md:pt-28 md:pb-32">
          <Eyebrow>Write</Eyebrow>
          <h1 className="type-h2 mt-4">Send your message</h1>
          <p className="type-body mt-5">Send us more information.</p>

          {/* Mobile stacks form → info cards, matching Contact us • Mobile.png */}
          <div className="mt-12 grid grid-cols-1 gap-14 lg:mt-16 lg:grid-cols-2 lg:gap-20">
            <div className="max-w-[38rem]">
              <ContactForm />
            </div>

            <div className="grid grid-cols-1 gap-12 self-start sm:grid-cols-2 lg:gap-14">
              <InfoCard icon={<MailIcon className="size-6" />} title="Email">
                <a
                  href={site.emailHref}
                  className="type-small break-words underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {site.email}
                </a>
              </InfoCard>

              <InfoCard icon={<PhoneIcon className="size-6" />} title="Phone">
                <a
                  href={site.phoneHref}
                  className="type-small underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {site.phone}
                </a>
              </InfoCard>

              <InfoCard icon={<PinIcon className="size-6" />} title="Office">
                <address className="type-small not-italic">
                  {site.address}
                </address>
                <p className="type-small text-text-muted-on-dark">
                  {site.hours}
                </p>
                <ArrowLink href={site.mapsUrl} className="mt-2">
                  View location
                </ArrowLink>
              </InfoCard>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {icon}
      <div className="flex flex-col gap-1">
        <h2 className="type-h4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
