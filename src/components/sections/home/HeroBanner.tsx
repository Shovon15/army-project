import Image, { StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import SectionBadge from "@/components/common/typography/SectionBadge";
import GlowBackground from "@/components/common/background/GlowBackground";
import AnimatedHeading from "@/components/common/typography/AnimatedHeading";
import { cn } from "@/utils/helpers/cn";
import bannerImage from "@/assets/images/banner-image.png";

type HeroBannerProps = {
  badge?: string;
  /** One entry per heading line; each line wipes in from left to right. */
  titleLines?: string[];
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: StaticImageData | string;
  imageAlt?: string;
  className?: string;
};

const HeroBanner = ({
  badge = "Timeless Artistic Journeys",
  titleLines = ["Discover Timeless", "Art Beyond Every", "Generation"],
  description = "Step into a world where creativity, history, and culture come together. Explore extraordinary collections for every visitor.",
  ctaLabel = "Explore The Gallery",
  ctaHref = "/",
  image = bannerImage,
  imageAlt = "Classical marble sculpture of a draped woman",
  className,
}: HeroBannerProps) => {
  const fade = (delay: number) =>
    ({ "--fade-delay": `${delay}s` }) as CSSProperties;
  const afterTitle = 0.25 + titleLines.length * 0.16 + 0.35;

  return (
    <section
      className={cn(
        "relative isolate flex min-h-[100svh] overflow-hidden bg-surface-dark text-white",
        className,
      )}
    >
      {/* ---------- Background: red glows, haze, grain ---------- */}
      <GlowBackground topLine />

      <ContentContainer
        size="narrow"
        className="relative grid w-full grid-cols-1 items-center gap-10 pt-32 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pt-0 min-h-[100dvh]"
      >
        {/* ---------- Copy (vertically centred; equal top/bottom space clears the header) ---------- */}
        <div className="relative z-10 max-w-[720px] pb-4 lg:self-center lg:py-[112px]">
          <SectionBadge tone="dark" className="hero-fade" style={fade(0.1)}>
            {badge}
          </SectionBadge>

          <AnimatedHeading
            tag="h1"
            trigger="load"
            lines={titleLines}
            className="mt-5 text-[clamp(1.85rem,2.7vw,3.4rem)]"
          />

          <p
            className="hero-fade mt-6 max-w-[580px] font-dmSans text-[clamp(15px,1vw,18px)] leading-text text-white/85"
            style={fade(afterTitle)}
          >
            {description}
          </p>

          <div
            className="hero-fade mt-8 lg:mt-10"
            style={fade(afterTitle + 0.15)}
          >
            <PrimaryButton href={ctaHref} arrow>
              {ctaLabel}
            </PrimaryButton>
          </div>
        </div>

        {/* ---------- Figure ---------- */}
        {/* Desktop: sits flush on the section's bottom edge (no float), and is
            capped so it never grows up under the header. */}
        <div className="relative flex justify-center self-end lg:h-full lg:items-end lg:justify-end">
          <div className="hero-figure relative w-full max-w-[460px] md:max-w-[540px] lg:max-w-[min(600px,34vw,calc((100svh_-_120px)/1.13))]">
            <div className="hero-float -mb-8 lg:mb-0">
              <Image
                src={image}
                alt={imageAlt}
                priority
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="block h-auto w-full select-none drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </ContentContainer>
    </section>
  );
};

export default HeroBanner;
