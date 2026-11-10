"use client";

import { useEffect, useRef } from "react";

export type ScrollMetrics = {
  /** Pixels scrolled from the top. */
  y: number;
  /** 0 → 1 through the whole page. */
  progress: number;
  /** Pixels moved since the last frame (+ down, − up). */
  delta: number;
};

/**
 * Calls `onChange` (at most once per frame) with live scroll position and
 * page progress.
 *
 * Unlike a ScrollTrigger with `end: "max"`, the scrollable height is
 * re-measured whenever the document resizes, so it stays correct after
 * client-side navigation, lazy images, accordions, etc. Lenis scrolls the
 * window, so native `scroll` events cover it too.
 */
export function useScrollMetrics(onChange: (m: ScrollMetrics) => void) {
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });

  useEffect(() => {
    const root = document.documentElement;
    let max = 1;
    let lastY = window.scrollY;
    let raf = 0;

    const measure = () => {
      max = Math.max(1, root.scrollHeight - window.innerHeight);
    };

    const emit = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;
      cb.current({ y, delta, progress: Math.min(1, y / max) });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(emit);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    emit();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    // Page height changes (route change, images, accordions) without a resize.
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
    };
  }, []);
}
