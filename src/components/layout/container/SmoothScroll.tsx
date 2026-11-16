"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { scrollToHashWhenReady } from "@/utils/helpers/scrollToHash";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import type Lenis from "lenis";

/** True when this page load is a browser reload (F5 / reload button). */
const isReload = () =>
  (
    performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined
  )?.type === "reload";

// `useSearchParams()` opts its nearest Suspense boundary out of server
// rendering. Keeping it in this leaf — which renders nothing and sits behind
// its own boundary — confines that bailout here instead of dropping the whole
// app to client-side rendering.
function ScrollToTopOnRouteChange({ lenis }: { lenis: Lenis | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const firstRunRef = useRef(true);

  useEffect(() => {
    const firstRun = firstRunRef.current;
    firstRunRef.current = false;

    // Reloading a "/#section" URL: drop the hash and start at the top
    // instead of jumping back to that section.
    if (firstRun && window.location.hash && isReload()) {
      const { pathname: path, search } = window.location;
      window.history.replaceState(window.history.state, "", path + search);
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true, force: true });
      return;
    }

    // Arrived via a "/#section" link: scroll to that section, not the top.
    const hash = window.location.hash;
    if (hash) return scrollToHashWhenReady(hash);

    requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.1,
          force: true,
        });
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }, [routeKey, lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenis = useSmoothScroll();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTopOnRouteChange lenis={lenis} />
      </Suspense>
      {children}
    </>
  );
}
