"use client";

import Image from "next/image";
import type { Era } from "@/lib/home/evolution";
import { cn } from "@/utils/helpers/cn";
import { focusRingLight, pressFeedback } from "./motion";

type EraCardProps = {
  era: Era;
  index: number;
  /** Era number as displayed, e.g. "03" (localised digits). */
  number: string;
  readMore: string;
  onOpen: (index: number) => void;
};

/** One era on the rail. The whole card is a single tap target. */
const EraCard = ({ era, index, number, readMore, onOpen }: EraCardProps) => (
  <button
    type="button"
    data-ev-card={index}
    aria-label={`${era.period}, ${era.title}, ${readMore.toLowerCase()}`}
    onClick={() => onOpen(index)}
    {...pressFeedback}
    data-cursor="hide"
    className={cn(
      "group relative flex h-full min-h-14 w-full flex-col overflow-hidden rounded-2xl border border-white/10 text-left",
      "bg-gradient-to-br from-surface-card to-surface-dark shadow-[0_28px_50px_-24px_rgba(7,3,37,0.55)]",
      "touch-manipulation select-none will-change-transform",
      // Card is dark, but it sits on the light section: offset in ivory.
      focusRingLight,
    )}
  >
    {/* Accent top border */}
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 z-10 h-1 bg-accent opacity-60"
    />

    {era.image ? (
      <span className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden bg-surface-deep">
        <Image
          src={era.image}
          alt=""
          fill
          sizes="(min-width: 768px) 360px, 80vw"
          draggable={false}
          className="object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 to-transparent"
        />
      </span>
    ) : (
      /* Era number watermark when there is no image */
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-4 font-boldCond text-[clamp(5rem,7vw,7rem)] leading-none text-accent/10"
      >
        {number}
      </span>
    )}

    <span
      aria-hidden="true"
      className="relative flex flex-1 flex-col p-6 md:p-7"
    >
      <span className="block font-boldCond text-[clamp(1.75rem,2.4vw,2.4rem)] leading-none text-accent tabular-nums">
        {era.period}
      </span>
      <span className="mt-4 block font-boldCond text-[clamp(1.2rem,1.4vw,1.5rem)] leading-title uppercase text-white">
        {era.title}
      </span>
      <span className="mt-3 block font-dmSans text-base leading-text text-white/80">
        {era.shortText}
      </span>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-dmSans text-sm font-semibold tracking-[0.12em] text-accent uppercase">
        {readMore}
        <span aria-hidden="true">→</span>
      </span>
    </span>
  </button>
);

export default EraCard;
