import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import FeaturedCollections from "@/components/sections/home/FeaturedCollections";
import { COLLECTIONS } from "@/lib/collections/collections";
import CurrentExhibitions from "@/components/sections/home/CurrentExhibitions";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import Testimonials from "@/components/sections/home/Testimonials";
import CommonQuestions, { VISITOR_FAQS } from "@/components/sections/shared/CommonQuestions";
import routes from "@/config/routes";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";
import { getFaqPageJsonLd } from "@/lib/metadata/jsonLdSchemas/faqPageLd";

import collectionBanner from "@/assets/images/collection-item-image-1.jpg";

const PATH = routes.collection;
const PAGE_NAME = "Collection";
const PAGE_DESCRIPTION =
  "Browse Museon's collections: classical art, sculpture, photography, contemporary works, cultural heritage and historical artifacts.";

export async function generateMetadata(): Promise<Metadata> {
  // No CMS page entry for the collection yet, so GetMetaData falls back to
  // the site defaults. Add `api.page.collection` once the backend has it.
  return await GetMetaData({ siteUrl: PATH });
}

export default function CollectionPage() {
  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: PATH,
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
        }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: PAGE_NAME, path: PATH },
        ]),
        getFaqPageJsonLd({ path: PATH, faqs: VISITOR_FAQS }),
      ]}
    >
      <PageHero
        titleLines={[PAGE_NAME]}
        breadcrumbs={[{ label: PAGE_NAME }]}
        image={collectionBanner}
      />
      <FeaturedCollections
        tone="light"
        showHeading={false}
        collections={COLLECTIONS}
        cta={null}
      />
      <CurrentExhibitions />
      <WhyChooseUs />
      <Testimonials />
      <CommonQuestions />
    </SchemaWrapper>
  );
}
