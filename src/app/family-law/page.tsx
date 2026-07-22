import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeAreaPage } from "@/components/site/practice-area-page";
import { practiceAreaBySlug } from "@/content/practice-areas";

const area = practiceAreaBySlug("family-law");

export const metadata: Metadata = {
  title: area?.metaTitle,
  description: area?.metaDescription,
  alternates: { canonical: "/family-law" },
  openGraph: {
    title: area?.metaTitle,
    description: area?.metaDescription,
    url: "/family-law",
  },
};

export default function Page() {
  if (!area) notFound();
  return <PracticeAreaPage area={area} />;
}
