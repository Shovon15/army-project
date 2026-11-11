import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
// import ImageGallery from "@/components/sections/gallery/ImageGallery";
import GallerySlider from "@/components/sections/gallery/GallerySlider";
import routes from "@/config/routes";
import { pageTitle } from "@/config/seo";
import { GALLERY_MEDIA } from "@/lib/gallery/gallery";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";

import galleryBanner from "@/assets/images/who-we-are-image-5.jpg";

const PAGE_NAME = "Gallery";
const PAGE_DESCRIPTION =
  "Photos of the Bangladesh Army Corps of Engineers at work: bridging, construction, training, disaster relief and ceremonies.";

export async function generateMetadata(): Promise<Metadata> {
  // No CMS page entry yet, so this uses the fallback below.
  return await GetMetaData({
    siteUrl: routes.gallery,
    fallback: { title: pageTitle(PAGE_NAME), description: PAGE_DESCRIPTION },
  });
}

export default function ImageGalleryPage() {
  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: routes.gallery,
          name: PAGE_NAME,
          description:
            PAGE_DESCRIPTION,
        }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: PAGE_NAME, path: routes.gallery },
        ]),
      ]}
    >
      <PageHero
        titleLines={[PAGE_NAME]}
        breadcrumbs={[{ label: PAGE_NAME }]}
        image={galleryBanner}
      />
      {/* Previous grid gallery, replaced by the slider below:
      <ImageGallery theme={"light"} images={GALLERY_IMAGES} /> */}
      <GallerySlider items={GALLERY_MEDIA} />
    </SchemaWrapper>
  );
}
