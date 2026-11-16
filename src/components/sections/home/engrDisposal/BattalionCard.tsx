"use client";

import type { MouseEvent } from "react";
import {
  DISPOSAL_REGIONS,
  type Battalion,
  type DisposalRegion,
} from "@/lib/home/engrDisposal";
import type { BattalionTotals } from "@/lib/home/engrDisposalTotals";
import { cn } from "@/utils/helpers/cn";
import { pressFeedback } from "../evolution/motion";
import { focusRingDark, formatIncidentDate } from "../worldIncidents/shared";
import Crest from "./Crest";

/** Region shades for the tiny stacked bar (always paired with text labels). */
export const REGION_SHADE: Record<DisposalRegion, string> = {
  cht: "bg-accent",
  country: "bg-accent/55",
  un: "bg-sky-300",
};

type BattalionCardProps = {
  battalion: Battalion;
  totals: BattalionTotals;
  numberLocale: string;
  dateLocale: string;
  copy: {
    iedsDisposed: string;
    lastDisposal: string;
    viewEvents: string;
    emptyState: string;
    regions: Record<DisposalRegion, string>;
  };
  onOpen: (battalionId: string, e: MouseEvent<HTMLElement>) => void;
};

/** One battalion. The whole card is a single tap target. */
const BattalionCard = ({
  battalion,
  totals,
  numberLocale,
  dateLocale,
  copy,
  onOpen,
}: BattalionCardProps) => {
  const fmt = new Intl.NumberFormat(numberLocale);
  const last = totals.lastEvent;
  const regionText = DISPOSAL_REGIONS.map(
    (r) => `${copy.regions[r]} ${fmt.format(totals.byRegion[r])}`,
  ).join(", ");
  const label = [
    battalion.name,
    `${fmt.format(totals.total)} ${copy.iedsDisposed}`,
    last
      ? `${copy.lastDisposal}: ${formatIncidentDate(last.date, dateLocale, "long")}, ${last.location}`
      : copy.emptyState,
    totals.total > 0 ? regionText : null,
    copy.viewEvents,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <button
      type="button"
      data-ed-card-btn={battalion.id}
      aria-label={label}
      onClick={(e) => onOpen(battalion.id, e)}
      {...pressFeedback}
      data-cursor="hide"
      className={cn(
        "relative flex min-h-14 w-full flex-col overflow-hidden rounded-2xl border border-white/10 p-6 text-left md:p-7",
        "bg-gradient-to-br from-surface-card to-surface-deep shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]",
        "touch-manipulation select-none will-change-transform",
        focusRingDark,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-accent opacity-60"
      />

      <span aria-hidden="true" className="flex flex-1 flex-col">
        <span className="flex items-center gap-4">
          <Crest battalion={battalion} className="h-16 w-16 text-xl" />
          <span className="font-boldCond text-[clamp(1.15rem,1.4vw,1.45rem)] leading-title uppercase text-white">
            {battalion.name}
          </span>
        </span>

        <span className="mt-6 flex items-baseline gap-3">
          <span className="font-boldCond text-[clamp(2.75rem,4vw,4rem)] leading-none text-accent tabular-nums">
            {fmt.format(totals.total)}
          </span>
          <span className="font-dmSans text-sm font-semibold text-white/80">
            {copy.iedsDisposed}
          </span>
        </span>

        <span className="mt-3 font-dmSans text-sm text-white/80">
          {last ? (
            <>
              {copy.lastDisposal}:{" "}
              <span className="text-white">
                {formatIncidentDate(last.date, dateLocale)}, {last.location}
              </span>
            </>
          ) : (
            copy.emptyState
          )}
        </span>

        {totals.total > 0 && (
          <span className="mt-5 block">
            {/* Tiny stacked bar; the text badges below carry the meaning */}
            <span className="flex h-2 overflow-hidden rounded-full bg-white/10">
              {DISPOSAL_REGIONS.map((r) =>
                totals.byRegion[r] > 0 ? (
                  <span
                    key={r}
                    className={REGION_SHADE[r]}
                    style={{ width: `${(totals.byRegion[r] / totals.total) * 100}%` }}
                  />
                ) : null,
              )}
            </span>
            <span className="mt-3 flex flex-wrap gap-2">
              {DISPOSAL_REGIONS.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-surface-deep/60 px-2.5 py-1 font-dmSans text-xs font-semibold text-white/85"
                >
                  <span className={cn("h-2 w-2 rounded-full", REGION_SHADE[r])} />
                  {copy.regions[r]}
                  <span className="tabular-nums text-white">
                    {fmt.format(totals.byRegion[r])}
                  </span>
                </span>
              ))}
            </span>
          </span>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-dmSans text-sm font-semibold tracking-[0.12em] text-accent uppercase">
          {copy.viewEvents}
          <span>→</span>
        </span>
      </span>
    </button>
  );
};

export default BattalionCard;
