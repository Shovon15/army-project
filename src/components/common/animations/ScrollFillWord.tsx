"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(ScrollTrigger);

type ScrollFillWordProps = {
  word: string;
  className?: string;
};

/**
 * One giant word stretched to the full width (SVG textLength). A faint copy
 * sits underneath and a red copy fills in left → right while the word
 * scrolls through the viewport (styles: .fill-word-red in globals.css).
 */
const ScrollFillWord = ({ word, className }: ScrollFillWordProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.setProperty("--fill", "100");
        return;
      }
      gsap.fromTo(
        el,
        { "--fill": 0 },
        {
          "--fill": 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 35%",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: ref },
  );

  const text = (fill: string) => (
    <svg
      viewBox="0 0 1000 190"
      className="block h-auto w-full overflow-visible"
      aria-hidden
    >
      <text
        x="0"
        y="170"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        className="font-heading"
        style={{ fontSize: 215, fill }}
      >
        {word}
      </text>
    </svg>
  );

  return (
    <div ref={ref} className={cn("relative select-none", className)} aria-hidden>
      {text("rgba(0,0,0,0.07)")}
      <div className="fill-word-red absolute inset-0">{text("var(--primary)")}</div>
    </div>
  );
};

export default ScrollFillWord;
