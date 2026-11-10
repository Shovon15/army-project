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
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";
import { getFaqPageJsonLd } from "@/lib/metadata/jsonLdSchemas/faqPageLd";

import collectionBanner from "@/assets/images/collection-item-image-1.jpg";
import FeaturedEvents from "@/components/sections/home/FeaturedEvents";
import { MuseumEvent } from "@/components/sections/home/OurEvents";

import eventImage1 from "@/assets/images/event-item-image-1.jpg";
import eventImage2 from "@/assets/images/event-item-image-2.jpg";
import eventImage3 from "@/assets/images/event-item-image-3.jpg";

const PATH = routes.collection;
const PAGE_NAME = "Events";
const PAGE_DESCRIPTION =
  "Browse Museon's collections: classical art, sculpture, photography, contemporary works, cultural heritage and historical artifacts.";

export async function generateMetadata(): Promise<Metadata> {
  // No CMS page entry for the collection yet, so GetMetaData falls back to
  // the site defaults. Add `api.page.collection` once the backend has it.
  return await GetMetaData({ siteUrl: PATH });
}

export default function EventPage() {
  const DEFAULT_EVENTS: MuseumEvent[] = [
    {
      title: "Art Through The Ages Exhibition",
      description:
        "Explore five centuries of artistic excellence, from the Renaissance to the modern era. Discover iconic masterpieces and the stories behind them.",
      date: "2026-11-18",
      time: "5:00 PM",
      venue: "Grand Heritage Gallery",
      href: "/events/art-through-the-ages",
      image: eventImage1,
    },
    {
      title: "Modern Artist Showcase",
      description:
        "Meet emerging and established artists, explore their latest creations, and discover the inspiration behind their remarkable artworks.",
      date: "2026-11-21",
      time: "7:00 PM",
      venue: "Contemporary Art Wing",
      href: "/events/modern-artist-showcase",
      image: eventImage2,
    },
    {
      title: "Museum Guided Heritage Tour",
      description:
        "Join our expert guides on an unforgettable journey through historic galleries, hidden treasures, and fascinating stories from the past.",
      date: "2026-11-25",
      time: "10:30 AM",
      venue: "Heritage Exhibition Hall",
      href: "/events/guided-heritage-tour",
      image: eventImage3,
    },
    {
      title: "Photography & Visual Arts Exhibition",
      description:
        "Experience the world through the lens of talented photographers. Explore captivating photographs, creative perspectives, and powerful visual storytelling.",
      date: "2026-12-02",
      time: "4:00 PM",
      venue: "Modern Arts Gallery",
      href: "/events/photography-visual-arts",
      image: eventImage1,
    },
    {
      title: "Art & Culture Workshop",
      description:
        "Take part in an interactive creative workshop exploring traditional art techniques, cultural heritage, and hands-on artistic expression.",
      date: "2026-12-08",
      time: "11:00 AM",
      venue: "Creative Learning Studio",
      href: "/events/art-culture-workshop",
      image: eventImage3,
    },
    {
      title: "Annual Museum Celebration",
      description:
        "Celebrate art, history, and culture with a special day of exhibitions, live demonstrations, artist interactions, and exclusive museum experiences.",
      date: "2026-12-15",
      time: "6:00 PM",
      venue: "Grand Heritage Gallery",
      href: "/events/annual-museum-celebration",
      image: eventImage2,
    },
  ];
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
        events={DEFAULT_EVENTS}
      />
      {/* <CurrentExhibitions />
      <WhyChooseUs />
      <Testimonials />
      <CommonQuestions /> */}
    </SchemaWrapper>
  );
}
