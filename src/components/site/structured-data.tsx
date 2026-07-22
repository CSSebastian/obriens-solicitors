import { faqs, site } from "@/content/site";

/**
 * Home-page structured data. Law firms earn real search visibility from both a
 * LegalService/LocalBusiness entity and FAQ rich results, so we emit both.
 * Everything is sourced from src/content so it never drifts from the site.
 */
export function HomeStructuredData() {
  const telephone = site.phoneHref.replace("tel:", "");

  const legalService = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone,
    email: site.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "11 Riverview Drive",
      addressLocality: "Berri",
      addressRegion: "SA",
      postalCode: "5343",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -34.2833,
      longitude: 140.6,
    },
    areaServed: [
      "Berri",
      "Riverland",
      "Mallee",
      "Pinnaroo",
      "South Australia",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.join(" "),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
