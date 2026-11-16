import Image, { StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import SectionBadge from "@/components/common/typography/SectionBadge";
import AnimatedHeading from "@/components/common/typography/AnimatedHeading";
import { cn } from "@/utils/helpers/cn";
import heroImage from "@/assets/images/1744071310341.png";
import HeroSmoothScroll from "./HeroSmoothScroll";

/* ---------------------------------------------------------------------------
   Hero copy. Every visible string lives here so a Bangla / English toggle can
   be added later by picking `heroContent[locale]`.
--------------------------------------------------------------------------- */
type HeroCopy = {
  eyebrow: string;
  /** One entry per heading line; each line wipes in from left to right. */
  titleLines: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  scrollCue: string;
  imageAlt: string;
};

export const heroContent: { en: HeroCopy; bn: HeroCopy } = {
  en: {
    eyebrow: "Bangladesh Army Corps of Engineers · IED Museum",
    titleLines: ["Making Every", "Threat Safe,", "Protecting Every Life"],
    description:
      "The Corps' EOD teams detect, neutralise and dispose of improvised explosive devices, protecting lives across Bangladesh and in UN peacekeeping missions worldwide.",
    primaryCta: { label: "Explore IED History", href: "#evolution" },
    secondaryCta: { label: "View Disposal Statistics", href: "#statistics" },
    scrollCue: "Touch to explore",
    imageAlt:
      "Bangladesh Army EOD team in protective gear conducting an IED disposal operation",
  },
  // TODO(bn): add the Bangla translation. Keep the same keys; English is used
  // as a placeholder until then.
  bn: {
    eyebrow: "TODO",
    titleLines: ["TODO"],
    description: "TODO",
    primaryCta: { label: "TODO", href: "#evolution" },
    secondaryCta: { label: "TODO", href: "#statistics" },
    scrollCue: "TODO",
    imageAlt: "TODO",
  },
};

type HeroBannerProps = {
  locale?: keyof typeof heroContent;
  image?: StaticImageData | string;
  className?: string;
};

/* Hero-only keyframes. Kept here (not globals.css) so this section stays
   self-contained. Both animations are off under prefers-reduced-motion. */
const HERO_CSS = `
@keyframes heroKenBurns {
  from { transform: scale(1); }
  to   { transform: scale(1.1); }
}
@keyframes heroCueBounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(8px); }
}
/* Always exactly one screen tall (svh, with a vh fallback). The content
   below scales with both viewport width and height, so it fits inside. */
.hero-section  { height: 100vh; height: 100svh; }
/* Very short screens (small phones, landscape phones): growing is better
   than cutting off the buttons, so let the hero extend past one screen. */
@media (max-height: 620px), (max-width: 767px) and (max-height: 700px) {
  .hero-section { height: auto; min-height: 100vh; min-height: 100svh; }
}
.hero-kenburns { animation: heroKenBurns 20s ease-in-out infinite alternate; }
.hero-cue      { animation: heroCueBounce 2.2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .hero-kenburns, .hero-cue { animation: none; }
}
`;

/* Shared CTA sizing: >= 56px tall touch target, generous padding, clear
   keyboard focus ring in the hazard accent colour. */
const CTA_BASE =
  "h-14 min-h-14 px-8 text-base lg:h-16 lg:px-10 lg:text-lg normal-case focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep";

const HeroBanner = ({
  locale = "en",
  image = heroImage,
  className,
}: HeroBannerProps) => {
  const t = heroContent[locale];
  const fade = (delay: number) =>
    ({ "--fade-delay": `${delay}s` }) as CSSProperties;
  const afterTitle = 0.25 + t.titleLines.length * 0.16 + 0.35;

  return (
    <section
      className={cn(
        // Height is reserved up-front (svh with vh fallback, see HERO_CSS)
        // so the image loading in never shifts layout.
        "hero-section relative isolate flex items-center overflow-hidden bg-surface-deep text-white",
        className,
      )}
    >
      <style>{HERO_CSS}</style>
      {/* Smooth-scrolls the CTAs and the scroll cue (client-only helper). */}
      <HeroSmoothScroll />

      {/* ---------- Background photo (slow Ken Burns zoom) ---------- */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={image}
          alt={t.imageAlt}
          fill
          preload
          sizes="100vw"
          placeholder={typeof image === "string" ? "empty" : "blur"}
          className="hero-kenburns object-cover object-[65%_center] select-none"
          draggable={false}
        />
      </div>

      {/* ---------- Overlays: keep white text above WCAG AA ---------- */}
      {/* Mobile / portrait: even darkening, heavier toward the bottom. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-surface-deep/95 via-surface-deep/75 to-surface-deep/60 lg:hidden"
      />
      {/* Desktop: left-to-right, darkest on the text side. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-surface-deep/90 via-surface-dark/70 to-surface-dark/15 lg:block"
      />
      {/* Bottom fade so the scroll cue and next section blend in. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-surface-deep/80 to-transparent"
      />

      {/* Top padding clears the fixed header; bottom leaves room for the
          scroll cue. Both follow the screen height. */}
      <ContentContainer
        size="narrow"
        className="relative flex w-full items-center pt-[max(96px,12vh)] pb-[max(84px,11vh)] lg:pt-[max(108px,13vh)]"
      >
        <div className="mx-auto flex max-w-[820px] flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <SectionBadge
            tone="dark"
            className="hero-fade border-accent/50 bg-surface-deep/50 text-accent"
            style={fade(0.1)}
          >
            {t.eyebrow}
          </SectionBadge>

          <AnimatedHeading
            tag="h1"
            trigger="load"
            lines={t.titleLines}
            /* Size follows the smaller of width and height so three lines
               always fit, for wide display fonts too. Line height stays on
               leading-display, which each font preset sets for its own
               metrics (src/config/fonts.ts), so switching fonts never
               overlaps or clips lines. */
            className="mt-[clamp(0.75rem,2vh,1.25rem)] text-[clamp(1.75rem,min(3.6vw,6.2vh),3.25rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
          />

          <p
            className="hero-fade mt-[clamp(0.75rem,2.2vh,1.5rem)] max-w-[600px] font-dmSans text-[clamp(15px,min(1.1vw,2.1vh),20px)] leading-text text-white/90"
            style={fade(afterTitle)}
          >
            {t.description}
          </p>

          <div
            className="hero-fade mt-[clamp(1.25rem,4vh,2.75rem)] flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
            style={fade(afterTitle + 0.15)}
          >
            {/* Primary: hazard-amber accent */}
            <PrimaryButton
              href={t.primaryCta.href}
              arrow
              className="w-full sm:w-auto"
              innerClassName={cn(
                CTA_BASE,
                "bg-accent text-surface-deep hover:shadow-[0_14px_40px_-12px_rgb(var(--accent-rgb)/0.7)]",
              )}
            >
              {t.primaryCta.label}
            </PrimaryButton>

            {/* Secondary: outlined, readable on the dark overlay */}
            <PrimaryButton
              href={t.secondaryCta.href}
              variant="outline"
              className="w-full sm:w-auto"
              innerClassName={cn(
                CTA_BASE,
                "border-2 border-white/70 bg-surface-deep/40 backdrop-blur-sm hover:shadow-none",
              )}
            >
              {t.secondaryCta.label}
            </PrimaryButton>
          </div>
        </div>
      </ContentContainer>

      {/* ---------- Scroll cue: tap to smoothly go to the next section ---------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <button
          type="button"
          data-scroll-next
          data-cursor="hide"
          className="pointer-events-auto flex min-h-14 min-w-14 touch-manipulation flex-col items-center justify-center rounded-full px-5 py-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep"
        >
          <span className="hero-cue flex flex-col items-center gap-1 font-dmSans text-sm tracking-[0.2em] text-white/80 uppercase">
            {t.scrollCue}
            <span aria-hidden="true" className="text-xl leading-none text-accent">
              ↓
            </span>
          </span>
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
