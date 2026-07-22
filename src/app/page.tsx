import type { Metadata } from "next";

import { Faqs } from "@/components/home/faqs";
import { Hero } from "@/components/home/hero";
import { History } from "@/components/home/history";
import { Insights } from "@/components/home/insights";
import { Newsletter } from "@/components/home/newsletter";
import { Services } from "@/components/home/services";
import { TeamSection } from "@/components/home/team-section";
import { Why } from "@/components/home/why";
import { CtaBand } from "@/components/site/cta-band";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — Solicitors in Berri, South Australia`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Why />
      <Insights />
      <Newsletter />
      <History />
      <TeamSection />
      <CtaBand />
      <Faqs />
    </>
  );
}
