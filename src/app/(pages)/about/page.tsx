import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import AboutMuseum from "@/components/sections/home/AboutMuseum";
import OurApproach from "@/components/sections/about/OurApproach";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import CurrentExhibitions from "@/components/sections/home/CurrentExhibitions";
import CommonQuestions, { VISITOR_FAQS } from "@/components/sections/shared/CommonQuestions";
import Testimonials from "@/components/sections/home/Testimonials";
import ConnectWithUs from "@/components/sections/shared/ConnectWithUs";
import { EaselIcon, PaletteIcon, TicketIcon, VaseIcon } from "@/assets/icons/MuseumIcons";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { pageTitle } from "@/config/seo";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";
import { getFaqPageJsonLd } from "@/lib/metadata/jsonLdSchemas/faqPageLd";

const PAGE_NAME = "About Us";
const PAGE_DESCRIPTION =
  "Learn about the Bangladesh Army Corps of Engineers: our history, mission and role in combat engineering, infrastructure development, disaster relief and UN peacekeeping.";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.about,
    siteUrl: routes.about,
    fallback: { title: pageTitle(PAGE_NAME), description: PAGE_DESCRIPTION },
  });
}

// "Who We Are" reuses the home page's stats section with About-page numbers.
// TODO: sample figures. Replace with the museum's real numbers.
const WHO_WE_ARE_STATS: Parameters<typeof WhyChooseUs>[0]["stats"] = [
  {
    icon: TicketIcon,
    value: 25,
    suffix: "k+",
    title: "Annual Visitors",
    text: "Art lovers, families and students walk through our doors every year.",
  },
  {
    icon: VaseIcon,
    value: 10,
    suffix: "k+",
    title: "Artworks Preserved",
    text: "Paintings, sculptures and artefacts cared for by our conservators.",
  },
  {
    icon: EaselIcon,
    value: 120,
    suffix: "+",
    title: "Curated Exhibitions",
    text: "Thoughtfully designed showcases, from classical to contemporary.",
  },
  {
    icon: PaletteIcon,
    value: 50,
    suffix: "+",
    title: "Years of Heritage",
    text: "Half a century of preserving stories that connect past and present.",
  },
];

export default function AboutPage() {
  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: routes.about,
          name: PAGE_NAME,
          description: PAGE_DESCRIPTION,
        }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: PAGE_NAME, path: routes.about },
        ]),
        getFaqPageJsonLd({ path: routes.about, faqs: VISITOR_FAQS }),
      ]}
    >
      <PageHero titleLines={[PAGE_NAME]} breadcrumbs={[{ label: PAGE_NAME }]} />
      <AboutMuseum ctaLabel="Explore Our Events" ctaHref={routes.events} />
      <OurApproach />
      <WhyChooseUs
        badge="Who We Are"
        titleLines={["A Place Where Art History", "And Culture Come Together"]}
        description="We are dedicated to preserving cultural heritage and inspiring meaningful connections through curated exhibitions, educational programs and experiences that bring art to life for every visitor."
        stats={WHO_WE_ARE_STATS}
      />
      {/* <CurrentExhibitions /> */}
      <CommonQuestions />
      <Testimonials />
      <ConnectWithUs />
    </SchemaWrapper>
  );
}
