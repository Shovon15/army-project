import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import ImageGallery from "@/components/sections/gallery/ImageGallery";
import routes from "@/config/routes";
import { GALLERY_IMAGES } from "@/lib/gallery/gallery";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";

import galleryBanner from "@/assets/images/who-we-are-image-5.jpg";

const PAGE_NAME = "Image Gallery";

export async function generateMetadata(): Promise<Metadata> {
  // No CMS page entry yet, so this falls back to the site defaults.
  return await GetMetaData({ siteUrl: routes.gallery });
}

export default function ImageGalleryPage() {
  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: routes.gallery,
          name: PAGE_NAME,
          description:
            "A photo tour of Museon's galleries, halls and collections, from the rotunda to the sculpture gallery.",
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
      <ImageGallery theme={"light"} images={GALLERY_IMAGES} />
    </SchemaWrapper>
  );
}
