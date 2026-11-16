import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Lets an inner scroll box share the mouse wheel with the page's Lenis
 * smooth scroll.
 *
 * A static `data-lenis-prevent` makes Lenis ignore every wheel event over
 * the box, so the page can't scroll while the pointer is over it, even when
 * the box is at its end or isn't scrollable at all (below xl). Instead, this
 * decides per wheel event: the box keeps the wheel (attribute set) only while
 * it can still scroll in that direction; otherwise Lenis scrolls the page.
 *
 * Runs before Lenis because Lenis listens on window and this listener sits on
 * the element itself. Touch needs nothing: Lenis leaves touch to the browser,
 * and native scroll chaining hands it to the page at the ends.
 */
export const useWheelChain = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const scrollable =
        el.scrollHeight > el.clientHeight + 1 &&
        getComputedStyle(el).overflowY !== "visible";
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      const inner =
        scrollable && ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom));
      el.toggleAttribute("data-lenis-prevent-wheel", inner);
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeAttribute("data-lenis-prevent-wheel");
    };
  }, [ref]);
};
