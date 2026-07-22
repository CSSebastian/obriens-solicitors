import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeAreaPage } from "@/components/site/practice-area-page";
import { practiceAreaBySlug } from "@/content/practice-areas";
import { createMetadata } from "@/lib/page-metadata";

const area = practiceAreaBySlug("estate-planning");

export const metadata: Metadata = area
  ? createMetadata({
      title: area.metaTitle,
      description: area.metaDescription,
      path: `/${area.slug}`,
    })
  : {};

export default function Page() {
  if (!area) notFound();
  return <PracticeAreaPage area={area} />;
}
