import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import HeroBanner from "@/components/sections/home/HeroBanner";
import MarqueeSection from "@/components/sections/home/MarqueeSection";
import AboutMuseum from "@/components/sections/home/AboutMuseum";
import FeaturedCollections from "@/components/sections/home/FeaturedCollections";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import CurrentExhibitions from "@/components/sections/home/CurrentExhibitions";
import OurEvents from "@/components/sections/home/OurEvents";
import MeetOurExperts from "@/components/sections/home/MeetOurExperts";
import WhoWeAre from "@/components/sections/home/WhoWeAre";
import Testimonials from "@/components/sections/home/Testimonials";
import LatestNews from "@/components/sections/home/LatestNews";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getHomeJsonLd } from "@/lib/metadata/jsonLdSchemas/homeLd";
import { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog/posts";


export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.home,
    siteUrl: routes.home,
  });
}

export default async function Home() {
  const posts = await getBlogPosts();
  return (
    <SchemaWrapper jsonLd={getHomeJsonLd()}>
      <HeroBanner />
      <MarqueeSection />
      <AboutMuseum />
      <FeaturedCollections />
      <WhyChooseUs />
      <CurrentExhibitions />
      <OurEvents />
      <MeetOurExperts />
      <WhoWeAre />
      <Testimonials />
      <LatestNews posts={posts} limit={3} />
    </SchemaWrapper>
  );
}
