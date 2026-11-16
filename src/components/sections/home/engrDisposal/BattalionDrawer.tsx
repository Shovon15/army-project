"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";
import {
  DEFAULT_OUTCOME,
  DISPOSAL_REGIONS,
  ENGR_DRAWER_IDLE_MS,
  type Battalion,
  type DisposalRegion,
} from "@/lib/home/engrDisposal";
import {
  getBattalionTotals,
  sortEventsNewestFirst,
} from "@/lib/home/engrDisposalTotals";
import { cn } from "@/utils/helpers/cn";
import { motionAllowed, pressFeedback } from "../evolution/motion";
import { focusRingDark, formatIncidentDate } from "../worldIncidents/shared";
import OutcomeBadge from "../bangladeshIncidents/OutcomeBadge";
import Crest from "./Crest";

gsap.registerPlugin(useGSAP);

type RegionFilter = DisposalRegion | "all";

type DrawerCopy = {
  iedsDisposed: string;
  regions: Record<DisposalRegion, string>;
  all: string;
  filterLabel: string;
  quantitySuffix: string;
  emptyState: string;
  prevBattalion: string;
  nextBattalion: string;
  close: string;
};

type BattalionDrawerProps = {
  /** Same order as the cards, for previous/next. */
  battalions: Battalion[];
  initialIndex: number;
  copy: DrawerCopy;
  numberLocale: string;
  dateLocale: string;
  /** Called after the close animation. */
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Battalion record drawer. Filter chips per region, a newest-first timeline
 * of disposal events, and previous/next battalion. Closes on the close
 * button, backdrop tap, Esc, or after ENGR_DRAWER_IDLE_MS idle.
 */
const BattalionDrawer = ({
  battalions,
  initialIndex,
  copy,
  numberLocale,
  dateLocale,
  onClose,
}: BattalionDrawerProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [filter, setFilter] = useState<RegionFilter>("all");

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const swapTween = useRef<gsap.core.Tween | null>(null);
  /** What the last swap was, so the in-animation matches it. */
  const swapRef = useRef<{ kind: "battalion"; dir: number } | { kind: "filter" } | null>(
    null,
  );
  const shownKeyRef = useRef(`${initialIndex}|all`);
  const titleId = useId();

  const fmt = new Intl.NumberFormat(numberLocale);
  const count = battalions.length;
  const battalion = battalions[index];
  const totals = getBattalionTotals(battalion);
  const events = sortEventsNewestFirst(
    filter === "all"
      ? battalion.events
      : battalion.events.filter((e) => e.region === filter),
  );
  const filters: { id: RegionFilter; label: string; count: number }[] = [
    { id: "all", label: copy.all, count: totals.operations },
    ...DISPOSAL_REGIONS.map((r) => ({
      id: r,
      label: copy.regions[r],
      count: totals.operationsByRegion[r],
    })),
  ];

  /* ---------- Open: backdrop fades, panel slides in, events stagger ---------- */
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      gsap
        .timeline()
        .fromTo(
          backdropRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25, ease: "power1.out" },
        )
        .fromTo(
          panelRef.current,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.45, ease: "power3.out" },
          "<",
        )
        .from(
          "[data-ed-event]",
          { y: 20, autoAlpha: 0, duration: 0.4, stagger: 0.05, ease: "power3.out" },
          "-=0.15",
        );
    },
    { scope: rootRef },
  );

  /* ---------- After a swap: bring the new content in ---------- */
  const key = `${index}|${filter}`;
  useGSAP(
    () => {
      if (shownKeyRef.current === key) return; // First render / Strict Mode.
      shownKeyRef.current = key;
      const swap = swapRef.current;
      const items = gsap.utils.toArray<HTMLElement>("[data-ed-event]");

      if (swap?.kind === "battalion" && bodyRef.current) {
        bodyRef.current.scrollTop = 0;
      }
      // A nav button that just became disabled drops focus: keep it inside.
      const focused = document.activeElement as HTMLButtonElement | null;
      if (!focused || focused === document.body || focused.disabled) {
        closeRef.current?.focus();
      }

      if (!motionAllowed()) {
        gsap.set([contentRef.current, listRef.current], { autoAlpha: 1, x: 0 });
        return;
      }
      // The layer this swap didn't fade may still be hidden by an
      // interrupted earlier swap: make sure it is visible.
      gsap.set(
        swap?.kind === "battalion" ? listRef.current : contentRef.current,
        { autoAlpha: 1, x: 0 },
      );
      const tl = gsap.timeline();
      if (swap?.kind === "battalion") {
        tl.fromTo(
          contentRef.current,
          { autoAlpha: 0, x: 30 * swap.dir },
          { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out" },
        );
      } else {
        tl.fromTo(
          listRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25, ease: "power1.out" },
        );
      }
      if (items.length) {
        tl.fromTo(
          items,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" },
          "-=0.2",
        );
      }
    },
    { scope: rootRef, dependencies: [key] },
  );

  /* Tweens below are created in event handlers (outside the useGSAP
     context), so the unmount cleanup kills them explicitly. */
  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    swapTween.current?.kill();
    if (!motionAllowed()) {
      onClose();
      return;
    }
    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, { xPercent: 100, duration: 0.35, ease: "power3.in" })
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.25 }, "-=0.2");
  };

  const go = (step: number) => {
    const next = index + step;
    if (next < 0 || next >= count || closingRef.current) return;
    swapRef.current = { kind: "battalion", dir: step };
    swapTween.current?.kill();
    const apply = () => {
      setIndex(next);
      setFilter("all");
    };
    if (!motionAllowed()) {
      apply();
      return;
    }
    swapTween.current = gsap.to(contentRef.current, {
      autoAlpha: 0,
      x: -30 * step,
      duration: 0.2,
      ease: "power2.in",
      onComplete: apply,
    });
  };

  const changeFilter = (next: RegionFilter) => {
    if (next === filter || closingRef.current) return;
    swapRef.current = { kind: "filter" };
    swapTween.current?.kill();
    if (!motionAllowed()) {
      setFilter(next);
      return;
    }
    swapTween.current = gsap.to(listRef.current, {
      autoAlpha: 0,
      duration: 0.15,
      ease: "power1.in",
      onComplete: () => setFilter(next),
    });
  };

  const closeEvent = useEffectEvent(close);

  useEffect(() => {
    const els = [
      backdropRef.current,
      panelRef.current,
      contentRef.current,
      listRef.current,
    ];
    return () => gsap.killTweensOf(els);
  }, []);

  /* ---------- Lock page scroll (Lenis + native) and move focus in ---------- */
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  /* ---------- Keyboard: Esc closes, Tab stays inside the drawer ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeEvent();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (!current || !panel.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- Kiosk: auto-close after a period of no interaction ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let timer = 0;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => closeEvent(), ENGR_DRAWER_IDLE_MS);
    };
    const evs = ["pointerdown", "pointermove", "keydown", "wheel", "scroll"];
    evs.forEach((ev) =>
      root.addEventListener(ev, reset, { capture: true, passive: true }),
    );
    reset();
    return () => {
      window.clearTimeout(timer);
      evs.forEach((ev) => root.removeEventListener(ev, reset, { capture: true }));
    };
  }, []);

  const navBtn = cn(
    "inline-flex min-h-14 items-center gap-2 rounded-full border px-5 font-dmSans text-sm font-semibold tracking-[0.06em] uppercase md:px-6",
    "touch-manipulation select-none transition-colors duration-200",
    "border-accent/50 bg-accent/10 text-accent",
    "disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/50",
    focusRingDark,
  );

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop: tap to close */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 bg-surface-deep/85 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full flex-col border-l border-white/10 bg-surface-dark text-white shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.8)] md:max-w-[680px]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.55)_0_14px,transparent_14px_28px)]"
        />

        <div
          ref={bodyRef}
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div ref={contentRef} className="p-5 md:p-7">
            {/* Header: crest, name, description, total + close */}
            <div className="flex items-start gap-4">
              <Crest battalion={battalion} className="h-16 w-16 text-xl md:h-20 md:w-20 md:text-2xl" />
              <div className="min-w-0 flex-1">
                <h2
                  id={titleId}
                  className="font-boldCond text-[clamp(1.4rem,2.2vw,2rem)] leading-display uppercase"
                >
                  {battalion.name}
                </h2>
                {battalion.description && (
                  <p className="mt-2 font-dmSans text-sm leading-text text-white/80 md:text-base">
                    {battalion.description}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={copy.close}
                {...pressFeedback}
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white touch-manipulation md:h-16 md:w-16",
                  focusRingDark,
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <p className="mt-5 flex items-baseline gap-3">
              <span className="font-boldCond text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-accent tabular-nums">
                {fmt.format(totals.total)}
              </span>
              <span className="font-dmSans text-sm font-semibold text-white/80">
                {copy.iedsDisposed}
              </span>
            </p>

            {/* Region filter chips */}
            <div
              role="group"
              aria-label={copy.filterLabel}
              className="mt-6 flex flex-wrap gap-2"
            >
              {filters.map((f) => {
                const active = f.id === filter;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => changeFilter(f.id)}
                    {...pressFeedback}
                    className={cn(
                      "inline-flex min-h-12 items-center gap-2 rounded-full border px-4 font-dmSans text-sm font-semibold transition-colors duration-200",
                      "touch-manipulation select-none",
                      active
                        ? "border-accent bg-accent text-surface-deep"
                        : "border-white/15 bg-surface-deep/60 text-white/85",
                      focusRingDark,
                    )}
                  >
                    {f.label}
                    <span className="tabular-nums">· {fmt.format(f.count)}</span>
                  </button>
                );
              })}
            </div>

            {/* Events timeline, newest first */}
            <div ref={listRef} className="mt-6">
              {events.length === 0 ? (
                <p
                  data-ed-event
                  className="rounded-2xl border border-dashed border-white/15 p-8 text-center font-dmSans text-base text-white/75"
                >
                  {copy.emptyState}
                </p>
              ) : (
                <div className="relative pl-9">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-gradient-to-b from-accent/70 to-accent/10"
                  />
                  <ol className="flex flex-col gap-4">
                    {events.map((ev) => (
                      <li key={ev.id} data-ed-event className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute top-5 -left-9 h-6 w-6 rounded-full border-2 border-accent bg-surface-dark"
                        />
                        <article className="flex gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-surface-card to-surface-deep p-4 md:p-5">
                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-dmSans text-xs font-semibold">
                              <time
                                dateTime={ev.date}
                                className="text-white/80 tabular-nums"
                              >
                                {formatIncidentDate(ev.date, dateLocale)}
                              </time>
                              <span className="tracking-[0.12em] text-accent uppercase">
                                {ev.location} · {ev.district}
                              </span>
                            </p>
                            <h3 className="mt-2 font-boldCond text-lg leading-title text-white">
                              {ev.title}
                            </h3>
                            <p className="mt-1 font-dmSans text-sm leading-text text-white/80">
                              {ev.summary}
                            </p>
                            <p className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center rounded-full border border-accent/50 bg-accent/10 px-2.5 py-1 font-dmSans text-xs font-semibold text-accent tabular-nums">
                                × {fmt.format(ev.quantity)} {copy.quantitySuffix}
                              </span>
                              <OutcomeBadge
                                type="disposed"
                                text={ev.outcome ?? DEFAULT_OUTCOME}
                              />
                              <span className="font-dmSans text-xs text-white/70">
                                {copy.regions[ev.region]}
                              </span>
                            </p>
                          </div>
                          {ev.image && (
                            <span className="relative hidden h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 sm:block">
                              <Image
                                src={ev.image}
                                alt=""
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </span>
                          )}
                        </article>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar: previous / next battalion */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-5 py-3 md:px-7">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            {...pressFeedback}
            className={navBtn}
          >
            <span aria-hidden="true">←</span>
            {copy.prevBattalion}
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === count - 1}
            {...pressFeedback}
            className={navBtn}
          >
            {copy.nextBattalion}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BattalionDrawer;
