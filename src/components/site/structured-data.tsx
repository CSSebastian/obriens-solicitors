import { JsonLd } from "@/components/site/json-ld";
import {
  faqPageSchema,
  organizationSchema,
  teamPeopleSchema,
  websiteSchema,
} from "@/lib/structured-data";
import { getCleanContent } from "@/sanity/content";

/**
 * Home-page structured data. Emits the firm entity (LegalService +
 * LocalBusiness), the WebSite node, FAQ rich-result data, and Person nodes for
 * any real, named solicitors. Everything is generated from the site content, so
 * it never drifts from the site. See src/lib/structured-data.ts.
 */
export async function HomeStructuredData() {
  const content = await getCleanContent();
  return (
    <JsonLd
      schema={[
        organizationSchema(content),
        websiteSchema(content.site),
        faqPageSchema(content.faqs),
        ...teamPeopleSchema(content.team),
      ]}
    />
  );
}
