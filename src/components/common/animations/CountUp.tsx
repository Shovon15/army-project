"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Final number. */
  to: number;
  /** Text after the number, e.g. "+" or "M+". */
  suffix?: string;
  prefix?: string;
  /** Milliseconds. */
  duration?: number;
  className?: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Number that counts up from 0 the first time it scrolls into view.
 * Server-renders the final value (good for SEO / no-JS); reduced-motion users
 * see the final value straight away.
 */
const CountUp = ({
  to,
  suffix = "",
  prefix = "",
  duration = 2400,
  className,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;

    // Zero the number shortly before it reaches the screen, so visitors never
    // see the final value jump back to 0.
    const prime = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setValue(0);
          prime.disconnect();
        }
      },
      { rootMargin: "0px 0px 300px 0px" },
    );
    prime.observe(el);

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setValue(Math.round(easeOutExpo(t) * to));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          setValue(0);
          run();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);

    return () => {
      prime.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the real value, not every intermediate frame. */}
      <span className="sr-only">
        {prefix}
        {to}
        {suffix}
      </span>
      <span aria-hidden>
        {prefix}
        {value}
        {suffix}
      </span>
    </span>
  );
};

export default CountUp;
