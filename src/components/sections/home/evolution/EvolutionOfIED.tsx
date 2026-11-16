"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionBadge from "@/components/common/typography/SectionBadge";
import { evolutionContent } from "@/lib/home/evolution";
import { cn } from "@/utils/helpers/cn";
import TimelineRail from "./TimelineRail";
import EraDetailOverlay from "./EraDetailOverlay";
import {
  MOTION_OK,
  focusRingLight,
  goldTextOnLight,
  motionAllowed,
  pressFeedback,
} from "./motion";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

type EvolutionOfIEDProps = {
  locale?: keyof typeof evolutionContent;
  className?: string;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const ArrowGlyph = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {dir === "left" ? (
      <path d="M19 12H5M11 6l-6 6 6 6" />
    ) : (
      <path d="M5 12h14M13 6l6 6-6 6" />
    )}
  </svg>
);

const EvolutionOfIED = ({ locale = "en", className }: EvolutionOfIEDProps) => {
  const t = evolutionContent[locale];
  const eras = t.eras;
  const count = eras.length;

  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  /** Era a running prev/next scroll is heading to (so rapid taps add up). */
  const targetRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const formatIndex = useMemo(() => {
    const fmt = new Intl.NumberFormat(t.numberLocale, {
      minimumIntegerDigits: 2,
    });
    return (i: number) => fmt.format(i + 1);
  }, [t.numberLocale]);

  /* ---------- Scrolling the rail ---------- */
  const scrollToIndex = useCallback(
    (index: number, instant = false) => {
      const rail = railRef.current;
      const item = rail?.querySelectorAll<HTMLElement>("[data-ev-item]")[index];
      if (!rail || !item) return;
      const max = rail.scrollWidth - rail.clientWidth;
      const x = clamp(
        item.offsetLeft + item.offsetWidth / 2 - rail.clientWidth / 2,
        0,
        max,
      );
      gsap.killTweensOf(rail);
      targetRef.current = index;
      // Mandatory snap fights a tweened scrollLeft, so pause it; the target
      // is itself a snap point, so restoring it causes no jump.
      rail.style.scrollSnapType = "none";
      const done = () => {
        rail.style.scrollSnapType = "";
        targetRef.current = null;
      };
      gsap.to(rail, {
        scrollTo: { x, autoKill: false },
        duration: instant || !motionAllowed() ? 0 : 0.6,
        ease: "power3.out",
        onComplete: done,
        onInterrupt: done,
      });
    },
    [],
  );

  const nearestIndex = () => {
    const rail = railRef.current;
    if (!rail) return 0;
    const centre = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    rail.querySelectorAll<HTMLElement>("[data-ev-item]").forEach((li, i) => {
      const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - centre);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const step = (dir: 1 | -1) => {
    const from = targetRef.current ?? activeIndex;
    const to = clamp(from + dir, 0, count - 1);
    if (to !== from) scrollToIndex(to);
  };

  const focusCard = (index: number) => {
    railRef.current
      ?.querySelector<HTMLButtonElement>(`[data-ev-card="${index}"]`)
      ?.focus({ preventScroll: true });
  };

  const onRailKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const card = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-ev-card]",
    );
    const from = card
      ? Number(card.dataset.evCard)
      : (targetRef.current ?? activeIndex);
    const to = clamp(from + dir, 0, count - 1);
    scrollToIndex(to);
    if (card) focusCard(to);
  };

  const closeOverlay = (lastIndex: number) => {
    setOpenIndex(null);
    // Return focus to the card of the era that was last shown.
    requestAnimationFrame(() => {
      scrollToIndex(lastIndex, true);
      focusCard(lastIndex);
    });
  };

  /* ---------- Active era: the card crossing the rail's centre line ---------- */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(i)) setActiveIndex(i);
        });
      },
      { root: rail, rootMargin: "0px -49.5% 0px -49.5%", threshold: 0 },
    );
    rail
      .querySelectorAll("[data-ev-item]")
      .forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, [count]);

  /* ---------- Entrance, progress bar, kiosk reset ---------- */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const rail = railRef.current;
      const bar = barRef.current;
      if (!section || !rail || !bar) return;

      /* Progress bar: written on scroll with quickTo, no React state per
         frame. Starts at 1/count so it matches the "01 / 11" counter. */
      gsap.set(bar, { scaleX: 1 / count, transformOrigin: "left center" });
      const barTo = gsap.quickTo(bar, "scaleX", {
        duration: motionAllowed() ? 0.3 : 0,
        ease: "power3.out",
      });
      const onScroll = () => {
        const max = rail.scrollWidth - rail.clientWidth;
        const p = max > 0 ? rail.scrollLeft / max : 0;
        barTo((1 + p * (count - 1)) / count);
      };
      rail.addEventListener("scroll", onScroll, { passive: true });

      const mm = gsap.matchMedia();
      // Reduced motion never matches: everything is simply shown as is.
      mm.add(MOTION_OK, () => {
        const railBox = rail.getBoundingClientRect();
        const visibleCards = gsap.utils
          .toArray<HTMLElement>("[data-ev-item]")
          .filter((li) => {
            const r = li.getBoundingClientRect();
            return r.right > railBox.left && r.left < railBox.right;
          })
          .map((li) => li.querySelector("[data-ev-enter]"));
        const segs = gsap.utils.toArray<HTMLElement>("[data-ev-seg]");
        const segTime = 1 / Math.max(segs.length, 1);

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.7 },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          })
          .from("[data-ev-heading] > *", { y: 30, autoAlpha: 0, stagger: 0.1 })
          .from("[data-ev-tabs]", { y: 20, autoAlpha: 0 }, "-=0.4")
          // The line draws left → right (~1s), one segment after another.
          .from(
            segs,
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: segTime,
              stagger: segTime,
              ease: "none",
            },
            "-=0.3",
          )
          .from(
            "[data-ev-node]",
            { scale: 0, duration: 0.4, stagger: 0.05, ease: "back.out(2)" },
            "-=0.7",
          )
          .from(visibleCards, { y: 40, autoAlpha: 0, stagger: 0.08 }, "-=0.3")
          .from("[data-ev-footer]", { autoAlpha: 0, duration: 0.5 }, "-=0.4");
      });

      /* Kiosk: once the page has been scrolled back to the very top, start
         the rail at era 1 again the next time the section comes into view. */
      let resetArmed = false;
      ScrollTrigger.create({
        start: 1,
        end: 2,
        onLeaveBack: () => {
          resetArmed = true;
        },
      });
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        onEnter: () => {
          if (!resetArmed) return;
          resetArmed = false;
          gsap.killTweensOf(rail);
          rail.style.scrollSnapType = "none";
          rail.scrollLeft = 0;
          rail.style.scrollSnapType = "";
          targetRef.current = null;
        },
      });

      return () => {
        rail.removeEventListener("scroll", onScroll);
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [count] },
  );

  /* ---------- Active card: full size, others slightly smaller and dimmer ---------- */
  useGSAP(
    () => {
      const motion = motionAllowed();
      gsap.utils.toArray<HTMLElement>("[data-ev-focus]").forEach((el, i) => {
        const on = i === activeIndex;
        const vars = {
          opacity: on ? 1 : 0.7,
          scale: motion && !on ? 0.92 : 1,
        };
        if (motion) {
          gsap.to(el, { ...vars, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        } else {
          gsap.set(el, vars);
        }
      });
    },
    { scope: sectionRef, dependencies: [activeIndex] },
  );

  const navButton = (dir: "left" | "right") => {
    const disabled = dir === "left" ? activeIndex === 0 : activeIndex === count - 1;
    return (
      <button
        type="button"
        onClick={() => step(dir === "left" ? -1 : 1)}
        disabled={disabled}
        aria-label={dir === "left" ? t.prev : t.next}
        {...pressFeedback}
        data-cursor="hide"
        className={cn(
          // 56px: slightly smaller than before (was 64px from md) but still the
          // kiosk minimum touch target.
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
          "touch-manipulation select-none",
          "border-accent/50 bg-accent text-surface-deep",
          "disabled:cursor-not-allowed disabled:border-ink/15 disabled:bg-ink/5 disabled:text-ink/35",
          focusRingLight,
        )}
      >
        <ArrowGlyph dir={dir} />
      </button>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="evolution"
      aria-labelledby="evolution-heading"
      className={cn(
        "relative isolate overflow-hidden bg-surface-light py-16 text-ink md:py-20 xl:py-24",
        className,
      )}
    >
      {/* Faint hazard-stripe line at the top, as in Quick Access. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.8)_0_14px,transparent_14px_28px)]"
      />

      <ContentContainer size="narrow">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div
            data-ev-heading
            className="flex max-w-[760px] flex-col items-center lg:items-start"
          >
            <SectionBadge
              tone="light"
              className={cn("border-accent/50 bg-accent/10", goldTextOnLight)}
            >
              {t.eyebrow}
            </SectionBadge>
            <h2
              id="evolution-heading"
              className="mt-4 font-boldCond text-[clamp(1.85rem,3vw,3rem)] leading-display text-ink uppercase"
            >
              {t.title}
            </h2>
            <p className="mt-4 font-dmSans text-base leading-text text-ink-muted md:text-lg">
              {t.intro}
            </p>
          </div>

          {/* Desktop: prev/next on the right of the header */}
          <div data-ev-heading className="hidden gap-3 lg:flex">
            {navButton("left")}
            {navButton("right")}
          </div>
        </div>

        {/* Era tabs (desktop only): jump to an era, active one highlighted */}
        <div
          data-ev-tabs
          role="group"
          aria-label={t.jumpToEra}
          className="mt-10 hidden grid-cols-11 gap-1.5 xl:grid"
        >
          {eras.map((era, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-current={active ? "true" : undefined}
                aria-label={`${era.period}, ${era.title}`}
                {...pressFeedback}
                data-cursor="hide"
                className={cn(
                  "min-h-14 rounded-lg border px-1.5 py-2 font-dmSans text-[13px] leading-tight font-semibold tabular-nums transition-colors duration-300",
                  "touch-manipulation select-none",
                  active
                    ? "border-accent bg-accent text-surface-deep"
                    : "border-ink/10 bg-white text-ink-soft hover:border-accent/60",
                  focusRingLight,
                )}
              >
                {era.period}
              </button>
            );
          })}
        </div>
      </ContentContainer>

      {/* Full-bleed rail so the neighbouring cards peek in on both sides */}
      <div className="mt-8 xl:mt-6">
        <TimelineRail
          eras={eras}
          railRef={railRef}
          label={t.railLabel}
          readMore={t.readMore}
          activeIndex={activeIndex}
          formatIndex={formatIndex}
          onOpen={setOpenIndex}
          onKeyDown={onRailKeyDown}
          onDragEnd={() => scrollToIndex(nearestIndex())}
        />
      </div>

      <ContentContainer size="narrow">
        <div data-ev-footer className="flex items-center gap-4 md:gap-6">
          <span className="lg:hidden">{navButton("left")}</span>
          <p className="shrink-0 font-dmSans text-sm font-semibold tracking-[0.14em] text-ink-muted tabular-nums md:text-base">
            <span className={goldTextOnLight}>{formatIndex(activeIndex)}</span> /{" "}
            {formatIndex(count - 1)}
          </p>
          <span
            aria-hidden="true"
            className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink/10"
          >
            <span
              ref={barRef}
              style={{
                transform: `scaleX(${1 / count})`,
                transformOrigin: "left center",
              }}
              className="absolute inset-0 rounded-full bg-accent will-change-transform"
            />
          </span>
          <span className="lg:hidden">{navButton("right")}</span>
        </div>
      </ContentContainer>

      {openIndex !== null && (
        <EraDetailOverlay
          eras={eras}
          initialIndex={openIndex}
          copy={t}
          formatIndex={formatIndex}
          onClose={closeOverlay}
        />
      )}
    </section>
  );
};

export default EvolutionOfIED;
