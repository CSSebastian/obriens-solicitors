import Link from "next/link";

import { PracticeAreaIcon } from "@/components/icons";
import { ArrowLink, Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/section";
import { serviceFeatures, site } from "@/content/site";

export function Services() {
  return (
    <Section tone="navy-deep">
      <Eyebrow>Services</Eyebrow>
      <h2 className="type-h2 mt-4 max-w-2xl">
        Legal expertise across six practice areas
      </h2>
      <p className="type-body mt-6 max-w-2xl">
        {site.name} handles the full range of legal matters that affect
        individuals and businesses in South Australia. Whatever brings you
        through our door, we have the experience and judgment to guide you
        through it.
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-8">
        {serviceFeatures.map((feature) => (
          <li key={feature.title}>
            <Link
              href={feature.href}
              className="group flex gap-5 transition-opacity hover:opacity-80"
            >
              <PracticeAreaIcon name={feature.icon} className="size-8 shrink-0" />
              <div>
                <h3 className="type-h3">{feature.title}</h3>
                <p className="type-small mt-3 text-text-muted-on-dark">
                  {feature.blurb}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-wrap items-center gap-6 md:mt-16">
        <Button href="/about" variant="outline-inverse">
          Explore
        </Button>
        <ArrowLink href="/practice-areas">Areas</ArrowLink>
      </div>
    </Section>
  );
}
