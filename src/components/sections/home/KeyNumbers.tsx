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
import {
  keyNumberStats,
  keyNumbersContent,
  keyNumbersDataAsOf,
  type KeyNumberIcon,
} from "@/lib/home/keyNumbers";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Hover effects only for a real mouse/trackpad with motion allowed. */
const HOVER_OK = `(hover: hover) and (pointer: fine) and ${MOTION_OK}`;

/* ---------------------------------------------------------------------------
   Icons: same line style as assets/icons (48px box, 1.8 stroke, currentColor
   outline + accent). The battalion icon reuses EngineerIcons' ShieldIcon.
--------------------------------------------------------------------------- */
const line = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const accent = { ...line, stroke: "var(--accent)" };

const DisposalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <g {...line}>
      <circle cx="21" cy="28" r="13" />
      <path d="M30 19l4-4M32 13l4 4" />
    </g>
    <g {...accent}>
      <path d="M36 12c1-3 4-4 6-3M40 5v2M44 9h-2M43 5.5l-1.5 1.5" />
      <path d="M15 28l4 4 8-8" />
    </g>
  </svg>
);

const BattalionIcon = ({ className }: { className?: string }) => (
  <ShieldIcon className={cn("[&_g:last-child]:stroke-accent", className)} />
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <g {...line}>
      <path d="M24 44S10 30.5 10 19a14 14 0 0 1 28 0c0 11.5-14 25-14 25Z" />
    </g>
    <g {...accent}>
      <circle cx="24" cy="19" r="5" />
    </g>
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <g {...line}>
      <circle cx="24" cy="24" r="19" />
      <path d="M5 24h38" />
      <path d="M24 5c-5.5 5.2-8 11.5-8 19s2.5 13.8 8 19c5.5-5.2 8-11.5 8-19S29.5 10.2 24 5Z" />
    </g>
    <g {...accent}>
      <path d="M8.5 14h31M8.5 34h31" />
    </g>
  </svg>
);

const ICONS: Record<KeyNumberIcon, (p: { className?: string }) => ReactNode> = {
  disposal: DisposalIcon,
  battalion: BattalionIcon,
  cht: MapPinIcon,
  un: GlobeIcon,
};

type KeyNumbersProps = {
  locale?: keyof typeof keyNumbersContent;
  className?: string;
};

const KeyNumbers = ({ locale = "en", className }: KeyNumbersProps) => {
  const t = keyNumbersContent[locale];
  const sectionRef = useRef<HTMLElement>(null);

  const format = (n: number) => new Intl.NumberFormat(t.numberLocale).format(n);

  const { contextSafe } = useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      // Reduced motion never matches: the server-rendered final numbers stay
      // as they are, with no count-up and no movement.
      mm.add(MOTION_OK, () => {
        const fmt = new Intl.NumberFormat(t.numberLocale);
        const numbers = gsap.utils.toArray<HTMLElement>("[data-kn-number]");

        /** Counts every number 0 → value by tweening a plain object and
         *  writing the text directly (no React re-render per frame). */
        const countUp = () => {
          numbers.forEach((el) => {
            const to = Number(el.dataset.value) || 0;
            const suffix = el.dataset.suffix ?? "";
            const counter = { val: 0 };
            el.textContent = fmt.format(0) + suffix;
            gsap.to(counter, {
              val: to,
              duration: 2,
              ease: "power2.out",
              overwrite: true,
              onUpdate: () => {
                el.textContent = fmt.format(Math.round(counter.val)) + suffix;
              },
            });
          });
        };

        // Show 0 until the strip is reached, so the count never jumps back.
        numbers.forEach((el) => {
          el.textContent = fmt.format(0) + (el.dataset.suffix ?? "");
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.7 },
            scrollTrigger: { trigger: section, start: "top 80%", once: true },
          })
          .from("[data-kn-heading] > *", { y: 30, autoAlpha: 0, stagger: 0.1 })
          .from(
            "[data-kn-item]",
            { y: 40, autoAlpha: 0, stagger: 0.12 },
            "-=0.35",
          )
          .add(countUp, "<");

        /* Kiosk idle reset: once the page has been scrolled back to the very
           top (e.g. by the next visitor or an idle timer), count up again the
           next time the strip comes into view. */
        let replayArmed = false;
        ScrollTrigger.create({
          start: 1,
          end: 2,
          onLeaveBack: () => {
            replayArmed = true;
          },
        });
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () => {
            if (!replayArmed) return;
            replayArmed = false;
            countUp();
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [t.numberLocale] },
  );

  /* ---------- Tap feedback (touch + mouse) ---------- */
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
  const hover = contextSafe((el: HTMLElement, on: boolean) => {
    if (!window.matchMedia(HOVER_OK).matches) return;
    gsap.to(el.querySelector("[data-kn-lift]"), {
      y: on ? -6 : 0,
      duration: 0.35,
      ease: "power3.out",
    });
    gsap.to(el.querySelector("[data-kn-arrow]"), {
      x: on ? 6 : 0,
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

  const asOfText = keyNumbersDataAsOf
    ? new Intl.DateTimeFormat(t.numberLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(keyNumbersDataAsOf))
    : null;

  return (
    <section
      ref={sectionRef}
      id="key-numbers"
      aria-labelledby="key-numbers-heading"
      className={cn(
        "relative isolate overflow-hidden border-y border-accent/25 bg-surface-dark py-16 text-white md:py-20 xl:py-24",
        className,
      )}
    >
      {/* Diagonal hazard-stripe texture, very low opacity. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.05] bg-[repeating-linear-gradient(135deg,var(--accent)_0_22px,transparent_22px_44px)]"
      />
      {/* Soft vignette so the texture fades toward the edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--surface-deep)_100%)]"
      />

      <ContentContainer size="narrow">
        <div data-kn-heading className="flex flex-col items-center text-center">
          <SectionBadge
            tone="dark"
            className="border-accent/50 bg-surface-deep/60 text-accent"
          >
            {t.eyebrow}
          </SectionBadge>
          <h2
            id="key-numbers-heading"
            className="mt-4 max-w-[900px] font-boldCond text-[clamp(1.85rem,3vw,3rem)] leading-display uppercase"
          >
            {t.title}
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-5 xl:mt-14 xl:grid-cols-4 xl:gap-0">
          {keyNumberStats.map((stat) => {
            const Icon = ICONS[stat.icon];
            const label = t.labels[stat.id];
            const finalText = format(stat.value) + stat.suffix;
            return (
              <li
                key={stat.id}
                data-kn-item
                className="flex xl:border-l xl:border-white/15 xl:first:border-l-0"
              >
                <a
                  href={stat.href}
                  aria-label={`${finalText} ${label}. ${t.viewDetails}`}
                  onClick={(e) => goTo(e, stat.href)}
                  onPointerDown={(e) => press(e.currentTarget)}
                  onPointerUp={(e) => release(e.currentTarget)}
                  onPointerCancel={(e) => release(e.currentTarget)}
                  onPointerEnter={(e) => hover(e.currentTarget, true)}
                  onPointerLeave={(e) => {
                    release(e.currentTarget);
                    hover(e.currentTarget, false);
                  }}
                  data-cursor="hide"
                  className={cn(
                    "flex min-h-14 w-full flex-col items-center rounded-2xl px-3 py-6 text-center md:px-6 md:py-8",
                    "border border-white/10 bg-surface-deep/50 xl:rounded-none xl:border-0 xl:bg-transparent",
                    "touch-manipulation select-none will-change-transform",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface-dark xl:focus-visible:rounded-2xl",
                  )}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-surface-deep/70 text-white md:h-14 md:w-14">
                    <Icon className="h-7 w-7 md:h-8 md:w-8" />
                  </span>

                  <span data-kn-lift className="mt-4 block">
                    <span
                      data-kn-number
                      data-value={stat.value}
                      data-suffix={stat.suffix}
                      aria-hidden="true"
                      className="block font-boldCond leading-none text-accent tabular-nums text-[clamp(2rem,9vw,2.5rem)] md:text-[clamp(2.5rem,5vw,4.5rem)]"
                    >
                      {finalText}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="mt-3 block font-dmSans text-sm leading-snug font-semibold text-white/90 md:text-base"
                  >
                    {label}
                  </span>

                  <span
                    aria-hidden="true"
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 font-dmSans text-xs font-semibold tracking-[0.12em] text-accent uppercase md:text-sm"
                  >
                    {t.viewDetails}
                    <span data-kn-arrow className="inline-block">
                      →
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {asOfText && (
          <p className="mt-8 text-center font-dmSans text-sm text-white/70">
            {t.dataAsOf} {asOfText}
          </p>
        )}
      </ContentContainer>
    </section>
  );
};

export default KeyNumbers;
