"use client";

import type { MouseEvent, RefObject } from "react";
import type { BangladeshIncident } from "@/lib/home/bangladeshIncidents";
import { cn } from "@/utils/helpers/cn";
import { pressFeedback } from "../evolution/motion";
import { focusRingLight, formatIncidentDate } from "../worldIncidents/shared";
import OutcomeBadge from "./OutcomeBadge";
import { useWheelChain } from "../worldIncidents/useWheelChain";

type IncidentTimelineProps = {
  /** Already sorted, newest first. */
  incidents: BangladeshIncident[];
  selectedId: string | null;
  dateLocale: string;
  emptyState: string;
  viewDetails: string;
  scrollRef: RefObject<HTMLDivElement | null>;
  onSelect: (incident: BangladeshIncident, e: MouseEvent<HTMLElement>) => void;
};

/** Vertical timeline: line + dot per incident, newest first. */
const IncidentTimeline = ({
  incidents,
  selectedId,
  dateLocale,
  emptyState,
  viewDetails,
  scrollRef,
  onSelect,
}: IncidentTimelineProps) => {
  useWheelChain(scrollRef);
  return (
  <div className="relative min-h-[240px] xl:h-full">
    {/* No static data-lenis-prevent / overscroll-contain: useWheelChain
        hands the wheel to the page at the list's ends, and touch chains
        to the page natively. */}
    <div
      ref={scrollRef}
      className="xl:absolute xl:inset-0 xl:overflow-y-auto xl:pr-2 custom-scrollbar"
    >
      {incidents.length === 0 ? (
        <p
          data-bd-card
          className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/15 p-8 text-center font-dmSans text-base text-white/75"
        >
          {emptyState}
        </p>
      ) : (
        <div className="relative pl-9">
          <span
            data-bd-line
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[11px] w-0.5 origin-top bg-gradient-to-b from-accent/70 to-accent/10"
          />
          <ol className="flex flex-col gap-4">
          {incidents.map((incident) => {
            const selected = incident.id === selectedId;
            const place = incident.area
              ? `${incident.district} · ${incident.area}`
              : incident.district;
            return (
              <li key={incident.id} data-bd-card={incident.id} className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-6 -left-9 h-6 w-6 rounded-full border-2 border-accent transition-colors duration-200",
                    selected ? "bg-accent" : "bg-surface-light",
                  )}
                />
                <button
                  type="button"
                  onClick={(e) => onSelect(incident, e)}
                  aria-pressed={selected}
                  {...pressFeedback}
                  data-cursor="hide"
                  className={cn(
                    "flex min-h-14 w-full flex-col gap-2 rounded-2xl border p-4 text-left md:p-5",
                    "bg-gradient-to-br from-surface-card to-surface-deep shadow-[0_18px_40px_-24px_rgba(7,3,37,0.55)] transition-colors duration-200",
                    "touch-manipulation select-none will-change-transform",
                    selected
                      ? "border-accent shadow-[0_0_0_1px_var(--accent)]"
                      : "border-white/10",
                    // Dark card on the light section: offset in ivory.
                    focusRingLight,
                  )}
                >
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <time
                      dateTime={incident.date}
                      className="font-dmSans text-xs font-semibold text-white/80 tabular-nums"
                    >
                      {formatIncidentDate(incident.date, dateLocale)}
                    </time>
                    <span className="font-dmSans text-xs font-semibold tracking-[0.12em] text-accent uppercase">
                      {place}
                    </span>
                    <OutcomeBadge
                      type={incident.outcomeType}
                      text={incident.outcome}
                      className="ml-auto"
                    />
                  </span>
                  <span className="font-boldCond text-lg leading-title text-white md:text-xl">
                    {incident.title}
                  </span>
                  <span className="line-clamp-1 font-dmSans text-sm text-white/80">
                    {incident.summary}
                  </span>
                  <span className="sr-only">{viewDetails}</span>
                </button>
              </li>
            );
          })}
          </ol>
        </div>
      )}
    </div>
  </div>
  );
};

export default IncidentTimeline;
