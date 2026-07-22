import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PracticeAreaPage } from "@/components/site/practice-area-page";
import { practiceAreaBySlug } from "@/content/site";

const area = practiceAreaBySlug("estate-planning");

export const metadata: Metadata = {
  title: area?.heading,
  description: area?.intro,
  alternates: { canonical: "/estate-planning" },
};

export default function Page() {
  if (!area) notFound();
  return <PracticeAreaPage area={area} />;
}
