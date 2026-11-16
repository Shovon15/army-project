import type Lenis from "lenis";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Smoothly scrolls so the top of `target` lands exactly at the top of the
 * viewport (0). No header offset: the header hides itself when scrolling
 * down, so an offset would leave an empty strip above the section.
 *
 * Used by the hero CTAs, Quick Access, Key Numbers and the header's Home
 * dropdown so every in-page jump behaves the same.
 */
export const scrollSectionToTop = (target: HTMLElement) => {
  if (typeof window === "undefined") return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;

  // Lazy-loaded images can shift layout during the glide; finish exactly.
  const settle = () => {
    const top = target.getBoundingClientRect().top;
    if (Math.abs(top) > 1) window.scrollTo(0, window.scrollY + top);
  };

  if (lenis) {
    lenis.scrollTo(target, {
      offset: 0,
      duration: reduceMotion ? 0 : 1.4,
      easing: easeInOutCubic,
      immediate: reduceMotion,
      force: true, // works even if Lenis was left stopped
      lock: true, // a stray wheel/touch can't cancel it halfway
      onComplete: settle,
    });
    return;
  }

  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY,
    behavior: reduceMotion ? "auto" : "smooth",
  });
  window.setTimeout(settle, reduceMotion ? 0 : 1200);
};

export default scrollSectionToTop;
