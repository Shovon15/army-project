import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionHeading from "@/components/common/typography/SectionHeading";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import NavLink from "@/components/common/link/NavLink";
import CtaLine from "@/components/common/cta/CtaLine";
import ArrowUpRightIcon from "@/assets/icons/ArrowUpRightIcon";
import { cn } from "@/utils/helpers/cn";

import { COLLECTIONS } from "@/lib/collections/collections";

export type Collection = {
  title: string;
  description: string;
  href: string;
  image: StaticImageData | string;
};

type FeaturedCollectionsProps = {
  badge?: string;
  titleLines?: string[];
  /** false hides the badge + title (e.g. on /collection under the page banner). */
  showHeading?: boolean;
  collections?: Collection[];
  /** null hides the closing CTA line. */
  cta?: { text: string; linkLabel: string; href: string } | null;
  /** "dark" = navy section with glows (home), "light" = ivory section. */
  tone?: "dark" | "light";
};

// Home shows the first three collections (data: src/lib/collections).
const DEFAULT_COLLECTIONS: Collection[] = COLLECTIONS.slice(0, 3);

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

const CollectionCard = ({
  item,
  index,
}: {
  item: Collection;
  index: number;
}) => (
  <NavLink
    href={item.href}
    hover={false}
    ariaLabel={item.title}
    className="group block"
  >
    {/* Wipes up on scroll; the photo settles from a zoom at the same time. */}
    <div
      className="reveal-clip relative aspect-[407/415] overflow-hidden rounded-[20px]"
      style={
        { ...delay(0.15 + index * 0.15), "--clip-r": "20px" } as CSSProperties
      }
    >
      <ImageShine className="absolute inset-0">
        <div
          className="reveal-zoom absolute inset-0"
          style={delay(0.15 + index * 0.15)}
        >
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
          />
        </div>
      </ImageShine>

      {/* Readability gradient, deepens on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 from-10% via-black/65 via-45% to-transparent to-80% opacity-95 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_110%,rgb(var(--primary-rgb)/0.45),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      {/* Corner arrow pops in on hover */}
      <span className="pointer-events-none absolute top-5 right-5 z-[3] flex h-12 w-12 scale-0 -rotate-45 items-center justify-center rounded-full bg-primary text-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-hover:rotate-0">
        <ArrowUpRightIcon className="h-5 w-5" />
      </span>

      {/* Caption lifts slightly on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] px-6 pb-8 text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">
        <h3 className="font-heading text-[clamp(1rem,1.15vw,1.2rem)] leading-title text-white uppercase">
          {item.title}
        </h3>
        <span
          aria-hidden
          className="mx-auto mt-3 block h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-16"
        />
        <p className="mx-auto mt-3 max-w-[300px] font-dmSans text-[15px] leading-text text-white/85">
          {item.description}
        </p>
      </div>
    </div>
  </NavLink>
);

const FeaturedCollections = ({
  badge = "Featured Collections",
  titleLines = ["Explore Our Exceptional", "Art Collections"],
  showHeading = true,
  collections = DEFAULT_COLLECTIONS,
  cta = {
    text: "Reach out and begin your artistic journey today –",
    linkLabel: "View Our Collection.",
    href: "/collection",
  },
  tone = "dark",
}: FeaturedCollectionsProps) => {
  const dark = tone === "dark";
  // On the 2-column (tablet) grid an odd last card is centred at half width.
  const oddLast = collections.length % 2 === 1;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-20 md:py-28",
        dark ? "bg-surface-dark text-white" : "bg-surface-light text-ink",
      )}
    >
      {dark && <GlowBackground />}

      <ContentContainer size="narrow" className="h-auto">
        {showHeading && (
          <SectionHeading badge={badge} lines={titleLines} tone={tone} />
        )}

        <Reveal
          once
          className={cn(
            "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]",
            showHeading && "mt-14 md:mt-16",
          )}
        >
          {collections.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                oddLast &&
                  i === collections.length - 1 &&
                  "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full",
              )}
            >
              {/* Stagger restarts every row so later rows don't lag behind. */}
              <CollectionCard item={item} index={i % 3} />
            </div>
          ))}
        </Reveal>

        {cta && <CtaLine {...cta} tone={tone} className="mt-12" />}
      </ContentContainer>
    </section>
  );
};

export default FeaturedCollections;
