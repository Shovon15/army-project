import { Metadata } from "next";
import { notFound } from "next/navigation";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import CollectionDetail from "@/components/sections/collection/CollectionDetail";
import CommonQuestions, { VISITOR_FAQS } from "@/components/sections/shared/CommonQuestions";
import routes from "@/config/routes";
import { COLLECTIONS, getCollection } from "@/lib/collections/collections";
import { imageUrl } from "@/lib/blog/posts";
import { metaDataGenerator } from "@/lib/metadata/generateMetadata";
import { absoluteUrl } from "@/lib/metadata/jsonLdSchemas/common";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";
import { getFaqPageJsonLd } from "@/lib/metadata/jsonLdSchemas/faqPageLd";

type Props = { params: Promise<{ slug: string }> };

// Only the known collections exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return metaDataGenerator({});
  const image = absoluteUrl(imageUrl(c.image));

  return metaDataGenerator({
    title: c.title,
    description: c.description,
    canonicalURL: c.href,
    openGraphImages: [{ url: image, width: 1200, height: 630, alt: c.title }],
    twitterImages: [image],
  });
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({ path: c.href, name: c.title, description: c.description }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Collection", path: routes.collection },
          { name: c.title, path: c.href },
        ]),
        getFaqPageJsonLd({ path: c.href, faqs: VISITOR_FAQS }),
      ]}
    >
      <PageHero
        titleLines={[c.title]}
        breadcrumbs={[
          { label: "Collection", href: routes.collection },
          { label: c.title },
        ]}
        image={c.image}
        titleClassName="text-[clamp(2rem,4.4vw,4rem)]"
      />
      <CollectionDetail collection={c} all={COLLECTIONS} />
      <CommonQuestions
        badge="FAQs"
        titleLines={["Frequently Asked", "Questions"]}
      />
    </SchemaWrapper>
  );
}
