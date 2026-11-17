"use client";

import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { scrollSectionToTop } from "@/utils/helpers/scrollSectionToTop";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionBadge from "@/components/common/typography/SectionBadge";
import { ShieldIcon } from "@/assets/icons/EngineerIcons";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/* ---------------------------------------------------------------------------
   Content. Every visible string lives here so a Bangla / English toggle can
   be added later by picking `quickAccessContent[locale]`.

   TODO: the target sections (#evolution, #world-incidents,
   #bangladesh-incidents, #statistics) don't exist on the home page yet. The
   links are kept and will start scrolling once those sections get their ids.
--------------------------------------------------------------------------- */
type TileIcon = "timeline" | "globe" | "pin" | "stats";

type QuickAccessTile = {
  id: string;
  number: string;
  title: string;
  teaser: string;
  badge: string;
  href: string;
  icon: TileIcon;
};

type QuickAccessCopy = {
  eyebrow: string;
  title: string;
  tiles: QuickAccessTile[];
};

export const quickAccessContent: { en: QuickAccessCopy; bn: QuickAccessCopy } =
  {
    en: {
      eyebrow: "Explore the Museum",
      title: "Choose a Topic",
      tiles: [
        {
          id: "evolution",
          number: "01",
          title: "Evolution of IED",
          teaser: "From c. 1000 AD to drone-borne IEDs, across 11 eras",
          badge: "11 Eras",
          href: "#evolution",
          icon: "timeline",
        },
        {
          id: "world-incidents",
          number: "02",
          title: "World IED Incidents",
          teaser: "Incidents in UN mission areas and around the world",
          badge: "UN Missions · Global",
          href: "#world-incidents",
          icon: "globe",
        },
        {
          id: "bangladesh-incidents",
          number: "03",
          title: "IED Incidents in Bangladesh",
          teaser:
            "Incidents in the Chittagong Hill Tracts and the rest of the country",
          badge: "CHT · Nationwide",
          href: "#bangladesh-incidents",
          icon: "pin",
        },
        {
          id: "statistics",
          number: "04",
          title: "IED Statistics Disposed by Engr Units",
          teaser: "Battalion-wise record of IEDs disposed by Engineer units",
          badge: "Engr Battalions",
          href: "#statistics",
          icon: "stats",
        },
      ],
    },
    // TODO(bn): add the Bangla translation. Keep the same keys and hrefs.
    bn: {
      eyebrow: "TODO",
      title: "TODO",
      tiles: [
        {
          id: "evolution",
          number: "০১",
          title: "TODO",
          teaser: "TODO",
          badge: "TODO",
          href: "#evolution",
          icon: "timeline",
        },
        {
          id: "world-incidents",
          number: "০২",
          title: "TODO",
          teaser: "TODO",
          badge: "TODO",
          href: "#world-incidents",
          icon: "globe",
        },
        {
          id: "bangladesh-incidents",
          number: "০৩",
          title: "TODO",
          teaser: "TODO",
          badge: "TODO",
          href: "#bangladesh-incidents",
          icon: "pin",
        },
        {
          id: "statistics",
          number: "০৪",
          title: "TODO",
          teaser: "TODO",
          badge: "TODO",
          href: "#statistics",
          icon: "stats",
        },
      ],
    },
  };

/* ---------------------------------------------------------------------------
   Icons: same line style as assets/icons (48px box, 1.8 stroke, currentColor
   outline + a second accent colour). The shield comes from EngineerIcons.
--------------------------------------------------------------------------- */
const iconStroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const accentStroke = { ...iconStroke, stroke: "var(--accent)" };

/* White section, dark cards. On the white section the brand gold (#d5b546)
   is only ~2:1, so gold TEXT outside the cards (the badge) uses a darker gold
   (#7a5f0e, ~6:1, WCAG AA). Inside the dark cards the brand gold is used. */
const GOLD_TEXT = "text-accent-dark";

const HourglassIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <g {...iconStroke}>
      <path d="M12 5h24M12 43h24" />
      <path d="M15 5c0 9 4 13 9 19-5 6-9 10-9 19M33 5c0 9-4 13-9 19 5 6 9 10 9 19" />
    </g>
    <g {...accentStroke}>
      <path d="M19 38c1.5-3 3-4.5 5-6 2 1.5 3.5 3 5 6Z" />
      <path d="M20 13h8" />
    </g>
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <g {...iconStroke}>
      <circle cx="24" cy="24" r="19" />
      <path d="M5 24h38" />
      <path d="M24 5c-5.5 5.2-8 11.5-8 19s2.5 13.8 8 19c5.5-5.2 8-11.5 8-19S29.5 10.2 24 5Z" />
    </g>
    <g {...accentStroke}>
      <path d="M8.5 14h31M8.5 34h31" />
    </g>
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <g {...iconStroke}>
      <path d="M24 44S10 30.5 10 19a14 14 0 0 1 28 0c0 11.5-14 25-14 25Z" />
    </g>
    <g {...accentStroke}>
      <circle cx="24" cy="19" r="5" />
    </g>
  </svg>
);

const StatsShieldIcon = ({ className }: { className?: string }) => (
  <span className={cn("relative inline-block", className)} aria-hidden="true">
    <ShieldIcon className="h-full w-full [&_g:last-child]:stroke-accent" />
  </span>
);

const ICONS: Record<TileIcon, (p: { className?: string }) => ReactNode> = {
  timeline: HourglassIcon,
  globe: GlobeIcon,
  pin: MapPinIcon,
  stats: StatsShieldIcon,
};

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Hover lift only for a real mouse/trackpad with motion allowed. */
const HOVER_OK = `(hover: hover) and (pointer: fine) and ${MOTION_OK}`;

type QuickAccessProps = {
  locale?: keyof typeof quickAccessContent;
  className?: string;
};

const QuickAccess = ({ locale = "en", className }: QuickAccessProps) => {
  const t = quickAccessContent[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion never matches, so the tiles simply stay visible.
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.7 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
        tl.from("[data-qa-heading] > *", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
        }).from(
          "[data-qa-tile]",
          { y: 40, autoAlpha: 0, stagger: 0.12 },
          "-=0.35",
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  /* ---------- Press feedback (touch + mouse) ---------- */
  const press = contextSafe((el: HTMLElement) => {
    gsap.to(el, {
      scale: 0.97,
      duration: 0.15,
      ease: "power2.out",
      overwrite: "auto",
    });
  });
  const release = contextSafe((el: HTMLElement) => {
    gsap.to(el, {
      scale: 1,
      duration: 0.15,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  /* ---------- Hover (desktop extra) ---------- */
  const hoverIn = contextSafe((el: HTMLElement) => {
    if (!window.matchMedia(HOVER_OK).matches) return;
    gsap.to(el, { y: -6, duration: 0.35, ease: "power3.out" });
    gsap.to(el.querySelector("[data-qa-bar]"), { opacity: 1, duration: 0.35 });
    gsap.to(el.querySelector("[data-qa-arrow]"), {
      x: 6,
      duration: 0.35,
      ease: "power3.out",
    });
  });
  const hoverOut = contextSafe((el: HTMLElement) => {
    if (!window.matchMedia(HOVER_OK).matches) return;
    gsap.to(el, { y: 0, scale: 1, duration: 0.35, ease: "power3.out" });
    gsap.to(el.querySelector("[data-qa-bar]"), {
      opacity: 0.6,
      duration: 0.35,
    });
    gsap.to(el.querySelector("[data-qa-arrow]"), {
      x: 0,
      duration: 0.35,
      ease: "power3.out",
    });
  });

  /* ---------- Navigation ----------
     Stop Lenis's document-level "#" handler (fixed offset) and smooth-scroll
     so the section's top lands at the top of the screen (0). */
  const goTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return; // TODO: section not built yet.

    scrollSectionToTop(target);
    history.replaceState(null, "", href);
  };

  return (
    <section
      ref={sectionRef}
      id="quick-access"
      aria-labelledby="quick-access-heading"
      className={cn(
        "relative isolate overflow-hidden bg-white py-16 text-ink md:py-20 xl:py-24",
        className,
      )}
    >
      {/* Faint hazard-stripe line at the top, ties in with the hero accent. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.8)_0_14px,transparent_14px_28px)]"
      />

      <ContentContainer size="narrow">
        <div
          data-qa-heading
          className="flex flex-col items-center text-center xl:items-start xl:text-left"
        >
          <SectionBadge
            tone="light"
            className={cn("border-accent/50 bg-accent/10", GOLD_TEXT)}
          >
            {t.eyebrow}
          </SectionBadge>
          <h2
            id="quick-access-heading"
            className="mt-4 font-boldCond text-[clamp(1.85rem,3vw,3rem)] leading-display text-ink uppercase"
          >
            {t.title}
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:mt-12 xl:grid-cols-4">
          {t.tiles.map((tile) => {
            const Icon = ICONS[tile.icon];
            return (
              <li key={tile.id} data-qa-tile className="flex">
                <a
                  href={tile.href}
                  onClick={(e) => goTo(e, tile.href)}
                  onPointerDown={(e) => press(e.currentTarget)}
                  onPointerUp={(e) => release(e.currentTarget)}
                  onPointerCancel={(e) => release(e.currentTarget)}
                  onPointerEnter={(e) => hoverIn(e.currentTarget)}
                  onPointerLeave={(e) => {
                    release(e.currentTarget);
                    hoverOut(e.currentTarget);
                  }}
                  data-cursor="hide"
                  className={cn(
                    "group relative flex min-h-[260px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 text-white",
                    "bg-gradient-to-br from-surface-card to-surface-dark p-6 shadow-[0_28px_50px_-24px_rgba(7,3,37,0.55)] md:p-7 xl:min-h-[340px] 2xl:p-8",
                    "touch-manipulation select-none will-change-transform",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-white",
                  )}
                >
                  {/* Accent top border (brightens on hover) */}
                  <span
                    data-qa-bar
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-accent opacity-60"
                  />

                  {/* Watermark number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-3 right-4 font-boldCond text-[clamp(5rem,7vw,7.5rem)] leading-none text-accent/10"
                  >
                    {tile.number}
                  </span>

                  <div className="relative flex items-center gap-4">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-surface-deep/70 text-white">
                      <Icon className="h-9 w-9" />
                    </span>
                    <span className="font-boldCond text-2xl leading-none text-accent">
                      {tile.number}
                    </span>
                  </div>

                  <h3 className="relative mt-6 font-boldCond text-[clamp(1.25rem,1.5vw,1.6rem)] leading-title text-white uppercase">
                    {tile.title}
                  </h3>
                  <p className="relative mt-3 font-dmSans text-base leading-text text-white/80">
                    {tile.teaser}
                  </p>

                  <div className="relative mt-auto flex items-end justify-between gap-3 pt-6">
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-dmSans text-xs font-semibold tracking-[0.12em] text-accent uppercase">
                      {tile.badge}
                    </span>
                    <span
                      data-qa-arrow
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-2xl leading-none text-surface-deep pb-1"
                    >
                      →
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </ContentContainer>
    </section>
  );
};

export default QuickAccess;
