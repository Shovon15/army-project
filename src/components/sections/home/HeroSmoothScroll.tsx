"use client";

import { useEffect, useRef } from "react";
import { scrollSectionToTop as smoothScrollTo } from "@/utils/helpers/scrollSectionToTop";

/**
 * Hero helper (renders nothing). The hero stays a server component; this
 * attaches one click listener to it:
 *
 * - CTA links to a section on this page ("#evolution", rendered by NavLink as
 *   "/#evolution") smooth-scroll there instead of Next.js jumping to the hash.
 * - `[data-scroll-next]` (the "Touch to explore" cue) smooth-scrolls to the
 *   section right after the hero.
 *
 * The listener runs in the capture phase so it handles the click before
 * Next.js <Link> (and Lenis's own "#" handler) see it.
 */
const HeroSmoothScroll = () => {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = markerRef.current?.closest("section");
    if (!section) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab etc.
      const el = e.target as Element;

      if (el.closest("[data-scroll-next]")) {
        const next = section.nextElementSibling as HTMLElement | null;
        if (!next) return;
        e.preventDefault();
        e.stopPropagation();
        smoothScrollTo(next);
        return;
      }

      const link = el.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      const samePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname;
      if (!samePage || !url.hash || url.hash === "#") return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return; // Section not on the page: let the link behave normally.

      e.preventDefault();
      e.stopPropagation();
      smoothScrollTo(target);
      history.replaceState(null, "", url.hash);
    };

    section.addEventListener("click", onClick, { capture: true });
    return () => section.removeEventListener("click", onClick, { capture: true });
  }, []);

  return <span ref={markerRef} hidden />;
};

export default HeroSmoothScroll;
