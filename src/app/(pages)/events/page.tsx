import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import FeaturedCollections from "@/components/sections/home/FeaturedCollections";
import { COLLECTIONS } from "@/lib/collections/collections";
import CurrentExhibitions from "@/components/sections/home/CurrentExhibitions";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import Testimonials from "@/components/sections/home/Testimonials";
import CommonQuestions, {
  VISITOR_FAQS,
} from "@/components/sections/shared/CommonQuestions";
import routes from "@/config/routes";
import { pageTitle } from "@/config/seo";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";
import { getFaqPageJsonLd } from "@/lib/metadata/jsonLdSchemas/faqPageLd";

import collectionBanner from "@/assets/images/collection-item-image-1.jpg";
import FeaturedEvents from "@/components/sections/home/FeaturedEvents";
import { EVENTS } from "@/lib/events/events";

const PATH = routes.events;
const PAGE_NAME = "Events";
const PAGE_DESCRIPTION =
  "Upcoming events, ceremonies, exhibitions and activities of the Bangladesh Army Corps of Engineers.";

export async function generateMetadata(): Promise<Metadata> {
  // No CMS page entry yet. Add `api.page.events` once the backend has it.
  return await GetMetaData({
    siteUrl: PATH,
    fallback: { title: pageTitle(PAGE_NAME), description: PAGE_DESCRIPTION },
  });
}

export default function EventPage() {
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
      {/* <FeaturedCollections
        tone="light"
        showHeading={false}
        collections={COLLECTIONS}
        cta={null}
      /> */}
      <FeaturedEvents
        badge="What's Happening"
        titleLines={["Explore Our Upcoming", " Events"]}
        events={EVENTS}
        pageSize={6}
        cta={null}
      />
      {/* <CurrentExhibitions />
      <WhyChooseUs />
      <Testimonials />
      <CommonQuestions /> */}
    </SchemaWrapper>
  );
}
