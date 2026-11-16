"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";
import { EVOLUTION_OVERLAY_IDLE_MS, type Era } from "@/lib/home/evolution";
import { cn } from "@/utils/helpers/cn";
import { focusRing, motionAllowed, pressFeedback } from "./motion";

gsap.registerPlugin(useGSAP);

type OverlayCopy = {
  prevEra: string;
  nextEra: string;
  close: string;
  keyFacts: string;
  source: string;
  imagePending: string;
};

type EraDetailOverlayProps = {
  eras: Era[];
  initialIndex: number;
  copy: OverlayCopy;
  formatIndex: (index: number) => string;
  /** Called after the close animation, with the era that was last shown. */
  onClose: (lastIndex: number) => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Full-screen era detail (kiosk-friendly). Visitors can page through every
 * era without closing it. Closes on the close button, backdrop tap, Esc, or
 * after EVOLUTION_OVERLAY_IDLE_MS without interaction.
 */
const EraDetailOverlay = ({
  eras,
  initialIndex,
  copy,
  formatIndex,
  onClose,
}: EraDetailOverlayProps) => {
  const [index, setIndex] = useState(initialIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const closingRef = useRef(false);
  const dirRef = useRef(0);
  const swapTween = useRef<gsap.core.Tween | null>(null);

  const era = eras[index];
  const count = eras.length;

  /* ---------- Open: backdrop fades in, then the panel slides/scales in ---------- */
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
          { autoAlpha: 0, y: 32, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
          "-=0.1",
        );
    },
    { scope: rootRef },
  );

  /* ---------- Era switch: cross-fade in the direction of travel ---------- */
  useGSAP(
    () => {
      const dir = dirRef.current;
      if (dir === 0) return; // First render: handled by the open animation.
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      // A nav button that just became disabled drops focus: keep it inside.
      const focused = document.activeElement as HTMLButtonElement | null;
      if (!focused || focused === document.body || focused.disabled) {
        closeRef.current?.focus();
      }
      if (!motionAllowed()) {
        gsap.set(contentRef.current, { autoAlpha: 1, x: 0 });
        return;
      }
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, x: 30 * dir },
        { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out" },
      );
    },
    { scope: rootRef, dependencies: [index] },
  );

  /* Event handlers create tweens outside the useGSAP context, so the unmount
     cleanup below kills them explicitly. */
  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    swapTween.current?.kill();
    if (!motionAllowed()) {
      onClose(index);
      return;
    }
    gsap
      .timeline({ onComplete: () => onClose(index) })
      .to(panelRef.current, {
        autoAlpha: 0,
        y: 20,
        scale: 0.98,
        duration: 0.25,
        ease: "power2.in",
      })
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
  };

  const go = (step: number) => {
    const next = index + step;
    if (next < 0 || next >= count || closingRef.current) return;
    dirRef.current = step;
    swapTween.current?.kill();
    if (!motionAllowed()) {
      setIndex(next);
      return;
    }
    swapTween.current = gsap.to(contentRef.current, {
      autoAlpha: 0,
      x: -30 * step,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setIndex(next),
    });
  };

  // Stable wrappers for the document/root listeners below.
  const closeEvent = useEffectEvent(close);
  const goEvent = useEffectEvent(go);

  useEffect(() => {
    const els = [backdropRef.current, panelRef.current, contentRef.current];
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

  /* ---------- Keyboard: Esc, ←/→ between eras, Tab focus trap ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeEvent();
      } else if (e.key === "ArrowRight") {
        goEvent(1);
      } else if (e.key === "ArrowLeft") {
        goEvent(-1);
      } else if (e.key === "Tab") {
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
      timer = window.setTimeout(
        () => closeEvent(),
        EVOLUTION_OVERLAY_IDLE_MS,
      );
    };
    const events = ["pointerdown", "pointermove", "keydown", "wheel", "scroll"];
    events.forEach((ev) =>
      root.addEventListener(ev, reset, { capture: true, passive: true }),
    );
    reset();
    return () => {
      window.clearTimeout(timer);
      events.forEach((ev) =>
        root.removeEventListener(ev, reset, { capture: true }),
      );
    };
  }, []);

  const navBtn = cn(
    "inline-flex min-h-14 items-center gap-2 rounded-full border px-5 font-dmSans text-sm font-semibold tracking-[0.08em] uppercase md:px-7 md:text-base",
    "touch-manipulation select-none transition-colors duration-200",
    "border-accent/50 bg-accent/10 text-accent",
    "disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-white/50",
    focusRing,
  );

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-stretch justify-center p-3 md:p-6"
    >
      {/* Backdrop: tap to close */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 bg-surface-deep/90 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-dark text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.55)_0_14px,transparent_14px_28px)]"
        />

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-3 md:px-8">
          <p className="font-dmSans text-sm font-semibold tracking-[0.14em] text-white/80 uppercase tabular-nums">
            <span className="text-accent">{formatIndex(index)}</span> /{" "}
            {formatIndex(count - 1)}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={copy.close}
            {...pressFeedback}
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors duration-200 md:h-16 md:w-16",
              "touch-manipulation",
              focusRing,
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

        {/* Scrollable body; data-lenis-prevent keeps smooth-scroll off it. */}
        <div
          ref={bodyRef}
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div
            ref={contentRef}
            className="grid gap-8 p-5 md:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 xl:p-12"
          >
            <figure className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-surface-deep">
                {era.image ? (
                  <Image
                    src={era.image}
                    alt={era.imageCaption ?? era.title}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.05)_0_22px,transparent_22px_44px)]">
                    <span
                      aria-hidden="true"
                      className="font-boldCond text-[clamp(6rem,14vw,12rem)] leading-none text-accent/15"
                    >
                      {formatIndex(index)}
                    </span>
                    {/* TODO: add an approved image per era (Era.image). */}
                    <span className="mt-2 font-dmSans text-sm text-white/70">
                      {copy.imagePending}
                    </span>
                  </div>
                )}
              </div>
              {era.imageCaption && (
                <figcaption className="mt-3 font-dmSans text-sm leading-text text-white/75">
                  {era.imageCaption}
                </figcaption>
              )}
            </figure>

            <div className="flex flex-col">
              <p className="font-boldCond text-[clamp(2.25rem,4vw,3.75rem)] leading-none text-accent tabular-nums">
                {era.period}
              </p>
              <h2
                id={titleId}
                className="mt-4 font-boldCond text-[clamp(1.6rem,2.6vw,2.6rem)] leading-display uppercase"
              >
                {era.title}
              </h2>
              <div className="mt-6 space-y-4 font-dmSans text-lg leading-text text-white/85">
                {era.fullText.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {era.keyFacts && era.keyFacts.length > 0 && (
                <div className="mt-8 rounded-xl border border-accent/25 bg-surface-deep/60 p-5">
                  <h3 className="font-dmSans text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                    {copy.keyFacts}
                  </h3>
                  <ul className="mt-3 space-y-2 font-dmSans text-base leading-text text-white/85">
                    {era.keyFacts.map((fact) => (
                      <li key={fact} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {era.source && (
                <p className="mt-6 font-dmSans text-sm text-white/70">
                  <span className="font-semibold text-white/85">
                    {copy.source}:
                  </span>{" "}
                  {era.source}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar: read through every era without closing */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-5 py-3 md:px-8">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            {...pressFeedback}
            className={navBtn}
          >
            <span aria-hidden="true">←</span>
            {copy.prevEra}
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === count - 1}
            {...pressFeedback}
            className={navBtn}
          >
            {copy.nextEra}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default EraDetailOverlay;
