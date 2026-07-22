import Link from "next/link";

import { SocialIcon } from "@/components/icons";
import { Logo } from "@/components/site/logo";
import { Container } from "@/components/ui/container";
import {
  footerLegalNav,
  footerNavPrimary,
  footerNavSecondary,
  site,
} from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-text-on-dark">
      <Container>
        <div className="pt-16 pb-10 md:pt-20 md:pb-14">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
            {/* Identity + contact details — all from src/content/site.ts */}
            <div className="flex flex-col gap-8">
              <Logo tone="light" />

              <div className="flex flex-col gap-1">
                <p className="type-small font-bold">Address</p>
                <address className="type-small not-italic text-text-muted-on-dark">
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-opacity hover:opacity-70"
                  >
                    {site.address}
                  </a>
                </address>
              </div>

              <div className="flex flex-col gap-1">
                <p className="type-small font-bold">Contact</p>
                <a
                  href={site.phoneHref}
                  className="inline-flex min-h-11 items-center type-small text-text-muted-on-dark underline underline-offset-4 transition-opacity hover:opacity-70 md:min-h-0"
                >
                  {site.phone}
                </a>
                <a
                  href={site.emailHref}
                  className="inline-flex min-h-11 items-center break-all type-small text-text-muted-on-dark underline underline-offset-4 transition-opacity hover:opacity-70 md:min-h-0"
                >
                  {site.email}
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <p className="type-small font-bold">Business hours</p>
                {site.hoursLines.map((line) => (
                  <p key={line} className="type-small text-text-muted-on-dark">
                    {line}
                  </p>
                ))}
              </div>

              {/* Config-driven: renders nothing while site.socials is empty. */}
              {site.socials.length > 0 ? (
                <ul className="flex items-center gap-5">
                  {site.socials.map((social) => (
                    <li key={social.platform}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={social.label}
                        className="inline-flex transition-opacity hover:opacity-70"
                      >
                        <SocialIcon
                          platform={social.platform}
                          className="size-5"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-24">
              <FooterLinkColumn links={footerNavPrimary} label="Practice areas" />
              <FooterLinkColumn links={footerNavSecondary} label="The firm" />
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="border-t border-line-on-dark py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2 text-text-muted-on-dark">
              {/* Required of every Australian legal practice. */}
              <p className="type-xs">{site.liabilityStatement}</p>
              <p className="type-xs">ABN: {site.abn}</p>
              <p className="type-xs">
                &copy; {year} {site.name}. All rights reserved.
              </p>
              <p className="type-xs">
                <a
                  href={site.memberOf.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {site.memberOf.label}
                </a>
              </p>
            </div>

            <ul className="flex flex-col sm:flex-row sm:gap-8">
              {footerLegalNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center type-xs text-text-muted-on-dark underline underline-offset-4 transition-opacity hover:opacity-70 sm:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterLinkColumn({
  links,
  label,
}: {
  links: { label: string; href: string }[];
  label: string;
}) {
  return (
    <nav aria-label={label}>
      {/* 44px tap rows on mobile (self-spacing); compact design on desktop. */}
      <ul className="flex flex-col gap-1 md:gap-4">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center type-small font-bold transition-opacity hover:opacity-70 md:min-h-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
