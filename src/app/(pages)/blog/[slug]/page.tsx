import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import SchemaWrapper from "@/components/layout/schemaWrapper/SchemaWrapper";
import PageHero from "@/components/sections/shared/PageHero";
import BlogArticle from "@/components/sections/blog/BlogArticle";
import LatestNews from "@/components/sections/home/LatestNews";
import { CalendarIcon } from "@/assets/icons/MetaIcons";
import routes from "@/config/routes";
import { getBlogPost, getSampleSlugs, imageUrl } from "@/lib/blog/posts";
import { metaDataGenerator } from "@/lib/metadata/generateMetadata";
import { absoluteUrl } from "@/lib/metadata/jsonLdSchemas/common";
import { getBlogDetailJsonLd } from "@/lib/metadata/jsonLdSchemas/blogDetailLd";

type Props = { params: Promise<{ slug: string }> };

// generateMetadata and the page both need the post: fetch it once per request.
const loadPost = cache((slug: string) => getBlogPost(decodeURIComponent(slug)));

// Prerender the sample posts; CMS posts still render on demand.
export function generateStaticParams() {
  return getSampleSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadPost(slug);
  if (!result) return metaDataGenerator({});
  const { post } = result;
  const image = absoluteUrl(imageUrl(post.image));

  return metaDataGenerator({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    canonicalURL: routes.blogDetails(post.slug),
    keywords: post.metaKeyword?.split(",").map((k) => k.trim()),
    openGraphImages: [{ url: image, width: 1200, height: 630, alt: post.title }],
    twitterImages: [image],
  });
}

const formatDate = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadPost(slug);
  if (!result) notFound();
  const { post, related } = result;

  const url = absoluteUrl(routes.blogDetails(post.slug));
  const image = absoluteUrl(imageUrl(post.image));

  return (
    <SchemaWrapper
      jsonLd={getBlogDetailJsonLd({
        title: post.title,
        subtitle: null,
        slug: post.slug,
        excerpt: post.excerpt,
        thumb: image,
        thumbSd: image,
        published: post.published,
        tags: post.tags,
        read_time: post.readTime,
        content: post.content,
        is_featured: false,
        category: post.category
          ? { title: post.category, slug: "", description: null, thumb: null }
          : null,
        meta_title: post.metaTitle ?? post.title,
        meta_keyword: post.metaKeyword ?? post.tags.join(", "),
        meta_description: post.metaDescription ?? post.excerpt,
      })}
    >
      <PageHero
        titleLines={[post.title]}
        breadcrumbs={[{ label: "Blog", href: routes.blog }, { label: post.title }]}
        image={post.image}
        titleClassName="mx-auto max-w-[1000px] text-[clamp(1.7rem,3.4vw,3.3rem)]"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-dmSans text-[15px] text-white/85">
          <li className="flex items-center gap-2">
            <CalendarIcon className="h-[18px] w-[18px] text-accent" />
            <time dateTime={post.published}>{formatDate(post.published)}</time>
          </li>
          {post.category && (
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
              {post.category}
            </li>
          )}
          {post.readTime && (
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
              {post.readTime}
            </li>
          )}
        </ul>
      </PageHero>

      <BlogArticle post={post} shareUrl={url} />

      {related.length > 0 && (
        <LatestNews
          badge="More Stories"
          titleLines={["Continue Reading", "Our Latest Articles"]}
          posts={related}
          limit={3}
        />
      )}
    </SchemaWrapper>
  );
}
