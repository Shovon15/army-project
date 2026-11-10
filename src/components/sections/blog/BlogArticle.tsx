import Image from "next/image";
import type { ComponentType } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import { FacebookIcon, LinkedinIcon, WhatsAppIcon, XIcon } from "@/assets/icons";
import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";
import type { BlogPostDetail } from "@/lib/blog/posts";

type BlogArticleProps = {
  post: BlogPostDetail;
  /** Absolute URL of this post, used by the share links. */
  shareUrl: string;
};

const share = (url: string, title: string) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: XIcon },
    { name: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, Icon: WhatsAppIcon },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedinIcon },
  ] as { name: string; href: string; Icon: ComponentType }[];
};

/*
 * Typography for the post body (CMS HTML). Kept as descendant utilities so the
 * same rules style both CMS posts and the local samples.
 */
const BODY = [
  "font-dmSans text-[clamp(15px,1.05vw,17px)] leading-[1.8] text-ink-muted",
  "[&>*:first-child]:mt-0 [&_p]:mt-6",
  "[&_h2]:mt-12 [&_h2]:font-heading [&_h2]:text-[clamp(1.3rem,1.9vw,1.9rem)] [&_h2]:leading-title [&_h2]:text-ink [&_h2]:uppercase",
  "[&_h3]:mt-10 [&_h3]:font-heading [&_h3]:text-[clamp(1.1rem,1.4vw,1.4rem)] [&_h3]:leading-title [&_h3]:text-ink [&_h3]:uppercase",
  "[&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-ink",
  "[&_strong]:text-ink-soft",
  "[&_ul]:mt-6 [&_ul]:space-y-3 [&_ul>li]:relative [&_ul>li]:pl-8",
  "[&_ul>li]:before:absolute [&_ul>li]:before:top-[0.65em] [&_ul>li]:before:left-1 [&_ul>li]:before:h-2.5 [&_ul>li]:before:w-2.5 [&_ul>li]:before:rotate-45 [&_ul>li]:before:bg-primary [&_ul>li]:before:content-['']",
  "[&_ol]:mt-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6 [&_ol>li]:marker:font-semibold [&_ol>li]:marker:text-primary",
  "[&_blockquote]:relative [&_blockquote]:mt-10 [&_blockquote]:overflow-hidden [&_blockquote]:rounded-[20px] [&_blockquote]:bg-surface-dark [&_blockquote]:px-7 [&_blockquote]:py-8 [&_blockquote]:pl-20 [&_blockquote]:font-heading [&_blockquote]:text-[clamp(1rem,1.3vw,1.25rem)] [&_blockquote]:leading-[1.5] [&_blockquote]:text-white md:[&_blockquote]:px-10 md:[&_blockquote]:pl-24",
  "[&_blockquote]:before:absolute [&_blockquote]:before:top-5 [&_blockquote]:before:left-6 [&_blockquote]:before:font-serif [&_blockquote]:before:text-[5rem] [&_blockquote]:before:leading-none [&_blockquote]:before:text-accent [&_blockquote]:before:content-['“'] md:[&_blockquote]:before:left-8",
  "[&_img]:mt-8 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-[20px]",
].join(" ");

/** Blog post body: featured image, CMS HTML, tags and share links. */
const BlogArticle = ({ post, shareUrl }: BlogArticleProps) => (
  <section className="relative overflow-hidden bg-white py-16 text-ink md:py-24">
    <ContentContainer size="narrow" className="h-auto">
      <article className="mx-auto max-w-[900px]">
        <Reveal once>
          <div {...revealItem("down", 40, 0, 1.1)}>
            <ImageShine className="aspect-[16/9] rounded-[20px]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover"
              />
            </ImageShine>
          </div>
        </Reveal>

        {post.excerpt && (
          <p className="mt-10 font-dmSans text-[clamp(17px,1.25vw,20px)] leading-text font-medium text-ink-soft md:mt-14">
            {post.excerpt}
          </p>
        )}

        {/* Content is trusted: written by our CMS editors or the local samples. */}
        <div
          className={`mt-8 ${BODY}`}
          dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(post.content) }}
        />

        <div className="mt-14 flex flex-col gap-6 border-t border-black/10 pt-8 md:flex-row md:items-center md:justify-between">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="mr-1 font-heading text-[15px] uppercase">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-surface-light px-4 py-1.5 font-dmSans text-[13px] font-medium text-ink-soft"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="font-heading text-[15px] uppercase">Share:</span>
            <ul className="flex gap-2">
              {share(shareUrl, post.title).map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-dark transition-[background-color,translate] duration-300 hover:-translate-y-1 hover:bg-primary [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </ContentContainer>
  </section>
);

export default BlogArticle;
