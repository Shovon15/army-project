"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Elements the dot reacts to (swells into a soft halo) when hovered. */
/** Elements the dot disappears over (buttons show their own ripple). */
const HIDE = "button, [role='button'], [data-cursor='hide']";
const INTERACTIVE =
  "a, button, [role='button'], label, select, summary, [data-cursor='hover']";

/**
 * A red dot that smoothly trails the normal mouse pointer. The native
 * arrow / hand cursor stays visible; the dot just follows it with a soft lag.
 * Over links and buttons it swells into a translucent halo around the pointer.
 *
 * Only runs on devices with a fine, hovering pointer (not touch).
 */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });

    const follow = { duration: reduceMotion ? 0 : 0.5, ease: "power3.out" };
    const moveX = gsap.quickTo(dot, "x", follow);
    const moveY = gsap.quickTo(dot, "y", follow);

    let visible = false;
    let hovering = false;
    let hidden = false;
    let pressed = false;

    const applyState = () => {
      const scale = hidden ? 0 : hovering ? 4 : 1;
      gsap.to(dot, {
        scale: pressed ? scale * 0.75 : scale,
        opacity: hidden ? 0 : hovering ? 0.22 : 1,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { clientX: x, clientY: y } = e;

      if (!visible) {
        visible = true;
        gsap.set(dot, { x, y });
        gsap.set(dot, { autoAlpha: 1 });
        applyState();
      }

      moveX(x);
      moveY(y);

      const target = e.target as Element | null;
      const isHidden = !!target?.closest(HIDE);
      const isHover = !isHidden && !!target?.closest(INTERACTIVE);
      if (isHover !== hovering || isHidden !== hidden) {
        hovering = isHover;
        hidden = isHidden;
        applyState();
      }
    };

    const onDown = () => {
      pressed = true;
      applyState();
    };
    const onUp = () => {
      pressed = false;
      applyState();
    };

    const onLeaveWindow = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      visible = false;
      gsap.to(dot, { autoAlpha: 0, scale: 0, duration: 0.3, overwrite: "auto" });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseout", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onLeaveWindow);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-0 z-[9999] h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_rgb(var(--accent-rgb)/0.9),0_0_12px_rgb(var(--primary-rgb)/0.6)] will-change-transform"
    />
  );
};

export default CustomCursor;
