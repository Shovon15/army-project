import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import ConnectWithUs from "@/components/sections/shared/ConnectWithUs";
import ContactFormSection from "@/components/sections/contact/ContactFormSection";
import CommonQuestions, { VISITOR_FAQS } from "@/components/sections/shared/CommonQuestions";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";
import { getFaqPageJsonLd } from "@/lib/metadata/jsonLdSchemas/faqPageLd";

import contactBanner from "@/assets/images/museum-image-1.jpg";

const PAGE_NAME = "Contact Us";
const PAGE_DESCRIPTION =
  "Get in touch with Museon to plan your visit, book a guided tour, or ask about exhibitions, events and memberships.";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({ url: api.page.contact, siteUrl: routes.contact });
}

export default function ContactPage() {
  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: routes.contact,
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
        }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: PAGE_NAME, path: routes.contact },
        ]),
        getFaqPageJsonLd({ path: routes.contact, faqs: VISITOR_FAQS }),
      ]}
    >
      <PageHero
        titleLines={[PAGE_NAME]}
        breadcrumbs={[{ label: PAGE_NAME }]}
        image={contactBanner}
      />
      <ConnectWithUs
        badge="Get In Touch"
        titleLines={["Contact Our", "Museum"]}
        description="Whether you are planning a visit, booking a guided tour, or have questions about our exhibitions, events, or memberships, we are here to help."
        cta={null}
      />
      <ContactFormSection />
      <CommonQuestions
        titleLines={["Plan Your Visit To Our", "Inspiring Art Gallery"]}
      />
    </SchemaWrapper>
  );
}
