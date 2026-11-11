import { Metadata } from "next";
import { notFound } from "next/navigation";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import EventDetail, { EventMetaChips } from "@/components/sections/events/EventDetail";
import routes from "@/config/routes";
import { pageTitle } from "@/config/seo";
import { EVENTS, getEvent } from "@/lib/events/events";
import { imageUrl } from "@/lib/blog/posts";
import { metaDataGenerator } from "@/lib/metadata/generateMetadata";
import { absoluteUrl } from "@/lib/metadata/jsonLdSchemas/common";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";

type Props = { params: Promise<{ event: string }> };

// Only the known events exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return EVENTS.map((e) => ({ event: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event } = await params;
  const e = getEvent(event);
  if (!e) return metaDataGenerator({});
  const image = absoluteUrl(imageUrl(e.image));

  return metaDataGenerator({
    title: pageTitle(e.title),
    description: e.description,
    canonicalURL: e.href,
    openGraphImages: [{ url: image, width: 1200, height: 630, alt: e.title }],
    twitterImages: [image],
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { event } = await params;
  const e = getEvent(event);
  if (!e) notFound();

  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({ path: e.href, name: e.title, description: e.description }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Events", path: routes.events },
          { name: e.title, path: e.href },
        ]),
      ]}
    >
      <PageHero
        titleLines={[e.title]}
        breadcrumbs={[{ label: "Events", href: routes.events }, { label: e.title }]}
        image={e.image}
        titleClassName="text-[clamp(2rem,4.4vw,4rem)]"
      >
        <EventMetaChips event={e} />
      </PageHero>
      <EventDetail event={e} all={EVENTS} />
    </SchemaWrapper>
  );
}
