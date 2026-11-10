import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionHeading from "@/components/common/typography/SectionHeading";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import NavLink from "@/components/common/link/NavLink";
import ArrowUpRightIcon from "@/assets/icons/ArrowUpRightIcon";
import routes from "@/config/routes";

import post1 from "@/assets/images/post-1.jpg";
import post2 from "@/assets/images/post-2.jpg";
import post3 from "@/assets/images/post-3.jpg";

export type NewsPost = {
  title: string;
  slug: string;
  image: StaticImageData | string;
};

type LatestNewsProps = {
  badge?: string;
  titleLines?: string[];
  posts?: NewsPost[];
  linkLabel?: string;
  /** false hides the badge + title (e.g. /blog under the page banner). */
  showHeading?: boolean;
  /** Max cards to show; omit to show every post. */
  limit?: number;
};

const DEFAULT_POSTS: NewsPost[] = [
  { title: "The Evolution of Classical Art Through Centuries", slug: "evolution-of-classical-art", image: post1 },
  { title: "Behind the Canvas: Stories of Famous Artists", slug: "behind-the-canvas", image: post2 },
  { title: "Understanding Modern Art and Its Creative Impact", slug: "understanding-modern-art", image: post3 },
];

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

const NewsCard = ({
  post,
  index,
  linkLabel,
}: {
  post: NewsPost;
  index: number;
  linkLabel: string;
}) => {
  const d = 0.15 + index * 0.15;
  return (
    <NavLink
      href={routes.blogDetails(post.slug)}
      hover={false}
      ariaLabel={post.title}
      className="group block"
    >
      <article
        className="reveal-clip relative aspect-[407/488] overflow-hidden rounded-[20px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
        style={{ ...delay(d), "--clip-r": "20px" } as CSSProperties}
      >
        <ImageShine className="absolute inset-0">
          <div className="reveal-zoom absolute inset-0" style={delay(d)}>
            <Image
              src={post.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
            />
          </div>
        </ImageShine>

        {/* Readability fade deepens on hover */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-[opacity] duration-700 md:opacity-85 md:group-hover:opacity-100" />

        {/* Caption: lifts on hover, red line draws across */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] px-6 pb-7 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 md:px-7">
          <h3 className="font-heading text-[clamp(0.95rem,1.15vw,1.25rem)] leading-title text-white uppercase">
            {post.title}
          </h3>
          <span aria-hidden className="relative mt-5 block h-px w-full overflow-hidden bg-white/20">
            <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(.77,0,.175,1)] group-hover:scale-x-100" />
          </span>
          <span className="mt-5 flex items-center gap-3 font-dmSans text-[15px] font-semibold text-white">
            {linkLabel}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary transition-[rotate] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-45">
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </span>
          </span>
        </div>
      </article>
    </NavLink>
  );
};

const LatestNews = ({
  badge = "Latest News",
  titleLines = ["Discover The Stories", "Behind Every Masterpiece"],
  posts = DEFAULT_POSTS,
  linkLabel = "Explore More",
  showHeading = true,
  limit,
}: LatestNewsProps) => {
  const shown = limit ? posts.slice(0, limit) : posts;
  // On the 2-column (tablet) grid an odd last card is centred at half width.
  const oddLast = shown.length % 2 === 1;

  return (
    <section className="relative overflow-hidden bg-surface-light py-20 text-ink md:py-28">
      <ContentContainer size="narrow" className="h-auto">
        {showHeading && (
          <SectionHeading badge={badge} lines={titleLines} tone="light" />
        )}

        <Reveal
          once
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px] ${showHeading ? "mt-14 md:mt-16" : ""}`}
        >
          {shown.map((post, i) => (
            <div
              key={post.slug}
              className={
                oddLast && i === shown.length - 1
                  ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full"
                  : undefined
              }
            >
              {/* Stagger restarts every row so later rows don't lag behind. */}
              <NewsCard post={post} index={i % 3} linkLabel={linkLabel} />
            </div>
          ))}
        </Reveal>
      </ContentContainer>
    </section>
  );
};

export default LatestNews;
