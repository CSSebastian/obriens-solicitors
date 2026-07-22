import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeAreaPage } from "@/components/site/practice-area-page";
import { practiceAreaBySlug } from "@/content/practice-areas";

const area = practiceAreaBySlug("commercial-law");

export const metadata: Metadata = {
  title: area?.metaTitle,
  description: area?.metaDescription,
  alternates: { canonical: "/commercial-law" },
  openGraph: {
    title: area?.metaTitle,
    description: area?.metaDescription,
    url: "/commercial-law",
  },
};

export default function Page() {
  if (!area) notFound();
  return <PracticeAreaPage area={area} />;
}
