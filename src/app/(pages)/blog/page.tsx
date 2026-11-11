import { Metadata } from "next";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import LatestNews from "@/components/sections/home/LatestNews";
import api from "@/config/api/apiList";
import routes from "@/config/routes";
import { pageTitle } from "@/config/seo";
import { getBlogPosts } from "@/lib/blog/posts";
import { GetMetaData } from "@/lib/metadata/getMetaData";
import { getWebPageJsonLd } from "@/lib/metadata/jsonLdSchemas/webPageLd";
import { getBreadcrumbJsonLd } from "@/lib/metadata/jsonLdSchemas/breadcrumbLd";

import blogBanner from "@/assets/images/post-2.jpg";

const PAGE_NAME = "Our Blog";
const PAGE_DESCRIPTION =
  "News, stories and updates from the Bangladesh Army Corps of Engineers: projects, training, ceremonies and service to the nation.";

export async function generateMetadata(): Promise<Metadata> {
  return await GetMetaData({
    url: api.page.blog,
    siteUrl: routes.blog,
    fallback: { title: pageTitle("Blog"), description: PAGE_DESCRIPTION },
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <SchemaWrapper
      jsonLd={[
        getWebPageJsonLd({
          path: routes.blog,
          name: PAGE_NAME,
          description:
            PAGE_DESCRIPTION,
        }),
        getBreadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Blog", path: routes.blog },
        ]),
      ]}
    >
      <PageHero
        titleLines={[PAGE_NAME]}
        breadcrumbs={[{ label: "Blog" }]}
        image={blogBanner}
      />
      <LatestNews posts={posts} showHeading={false} />
    </SchemaWrapper>
  );
}
