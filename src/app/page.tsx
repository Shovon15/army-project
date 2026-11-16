import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import HeroBanner from "@/components/sections/home/HeroBanner";
import QuickAccess from "@/components/sections/home/QuickAccess";
import AboutMuseum from "@/components/sections/home/AboutMuseum";
import FeaturedCollections from "@/components/sections/home/FeaturedCollections";
// Replaced by <KeyNumbers /> — kept for reference, do not delete
// import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import KeyNumbers from "@/components/sections/home/KeyNumbers";
import EvolutionOfIED from "@/components/sections/home/evolution/EvolutionOfIED";
import WorldIncidents from "@/components/sections/home/worldIncidents/WorldIncidents";
import BangladeshIncidents from "@/components/sections/home/bangladeshIncidents/BangladeshIncidents";
import EngrDisposalStats from "@/components/sections/home/engrDisposal/EngrDisposalStats";
import CurrentExhibitions from "@/components/sections/home/CurrentExhibitions";
import OurEvents from "@/components/sections/home/OurEvents";
import MeetOurExperts from "@/components/sections/home/MeetOurExperts";
import WhoWeAre from "@/components/sections/home/WhoWeAre";
import Testimonials from "@/components/sections/home/Testimonials";
import LatestNews from "@/components/sections/home/LatestNews";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { SITE_INFORMATION } from "@/config/seo";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getHomeJsonLd } from "@/lib/metadata/jsonLdSchemas/homeLd";
import { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog/posts";
// import ImageGallery from "@/components/sections/gallery/ImageGallery";
import GallerySlider from "@/components/sections/gallery/GallerySlider";
import { GALLERY_MEDIA } from "@/lib/gallery/gallery";
import GlowBackground from "@/components/common/background/GlowBackground";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionHeading from "@/components/common/typography/SectionHeading";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.home,
    siteUrl: routes.home,
    fallback: {
      title: SITE_INFORMATION.metaTitle,
      description: SITE_INFORMATION.metaDescription,
    },
  });
}

export default async function Home() {
  const posts = await getBlogPosts();
  const titleLines = ["Discover The Beauty Of", "Art & Creativity"];
  return (
    <SchemaWrapper jsonLd={getHomeJsonLd()}>
      <HeroBanner />
      <QuickAccess />
      <KeyNumbers />
      <EvolutionOfIED />
      <WorldIncidents />
      <BangladeshIncidents />
      <EngrDisposalStats />
      <GallerySlider items={GALLERY_MEDIA} />
      {/* <AboutMuseum /> */}
      {/* <FeaturedCollections /> */}
      {/* Replaced by <KeyNumbers /> — kept for reference, do not delete
      <WhyChooseUs /> */}

      {/* <CurrentExhibitions /> */}
      {/* <OurEvents /> */}
      {/* <MeetOurExperts /> */}
      {/* <WhoWeAre /> */}
      {/* Previous gallery grid, replaced by GallerySlider:
      <section className="relative isolate overflow-hidden bg-surface-light py-20 text-white md:py-28 h-full">
        <ContentContainer className="h-auto">
          <SectionHeading
            badge={"explore gallery"}
            lines={titleLines}
            tone="light"
          />
          <ImageGallery images={GALLERY_IMAGES} theme={"light"} />
        </ContentContainer>
      </section> */}
      {/* <Testimonials /> */}
      {/* <LatestNews posts={posts} limit={3} /> */}
    </SchemaWrapper>
  );
}
