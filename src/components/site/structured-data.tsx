import { JsonLd } from "@/components/site/json-ld";
import {
  faqPageSchema,
  organizationSchema,
  teamPeopleSchema,
  websiteSchema,
} from "@/lib/structured-data";

/**
 * Home-page structured data. Emits the firm entity (LegalService +
 * LocalBusiness), the WebSite node, FAQ rich-result data, and Person nodes for
 * any real, named solicitors. Everything is generated from src/content, so it
 * never drifts from the site. See src/lib/structured-data.ts.
 */
export function HomeStructuredData() {
  return (
    <JsonLd
      schema={[
        organizationSchema(),
        websiteSchema(),
        faqPageSchema(),
        ...teamPeopleSchema(),
      ]}
    />
  );
}
