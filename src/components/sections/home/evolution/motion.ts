import type { PointerEvent } from "react";
import gsap from "gsap";

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const motionAllowed = () =>
  typeof window !== "undefined" && window.matchMedia(MOTION_OK).matches;

const scaleTo = (el: HTMLElement, scale: number) => {
  if ((el as HTMLButtonElement).disabled) return;
  if (!motionAllowed()) return; // Reduced motion: no scale effects.
  gsap.to(el, { scale, duration: 0.15, ease: "power2.out", overwrite: "auto" });
};

/** Tap feedback (touch + mouse): spread onto any button. */
export const pressFeedback = {
  onPointerDown: (e: PointerEvent<HTMLElement>) => scaleTo(e.currentTarget, 0.97),
  onPointerUp: (e: PointerEvent<HTMLElement>) => scaleTo(e.currentTarget, 1),
  onPointerCancel: (e: PointerEvent<HTMLElement>) => scaleTo(e.currentTarget, 1),
  onPointerLeave: (e: PointerEvent<HTMLElement>) => scaleTo(e.currentTarget, 1),
};

/** Shared focus ring, same as the Quick Access / Key Numbers tiles. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface-deep";

/** Same ring for controls on a light section (offset matches the ivory). */
export const focusRingLight =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface-light";

/** Gold text on light backgrounds: the brand gold is ~2:1 on ivory, this
    darker gold is ~6:1 (WCAG AA). */
export const goldTextOnLight = "text-accent-dark";

/** Logo crimson at era 1 blending into the gold accent at the last era. */
export const eraTone = (index: number, count: number) => {
  const pct = count > 1 ? Math.round((index / (count - 1)) * 100) : 100;
  return `color-mix(in srgb, var(--accent) ${pct}%, var(--primary-light))`;
};
