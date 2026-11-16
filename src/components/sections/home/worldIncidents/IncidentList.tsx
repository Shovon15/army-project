"use client";

import type { MouseEvent, RefObject } from "react";
import type { WorldIncident } from "@/lib/home/worldIncidents";
import { cn } from "@/utils/helpers/cn";
import { pressFeedback } from "../evolution/motion";
import { PIN_COLOR, focusRingDark, formatIncidentDate } from "./shared";
import { useWheelChain } from "./useWheelChain";

type IncidentListProps = {
  incidents: WorldIncident[];
  selectedId: string | null;
  dateLocale: string;
  emptyState: string;
  viewDetails: string;
  /** Scroll container (scrolls internally on wide screens). */
  scrollRef: RefObject<HTMLDivElement | null>;
  onSelect: (incident: WorldIncident, e: MouseEvent<HTMLElement>) => void;
};

const IncidentList = ({
  incidents,
  selectedId,
  dateLocale,
  emptyState,
  viewDetails,
  scrollRef,
  onSelect,
}: IncidentListProps) => {
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
          data-wi-card
          className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/15 p-8 text-center font-dmSans text-base text-white/75"
        >
          {emptyState}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {incidents.map((incident) => {
            const selected = incident.id === selectedId;
            const tag = incident.missionName
              ? `${incident.missionName} · ${incident.country}`
              : incident.country;
            return (
              <li key={incident.id} data-wi-card={incident.id}>
                <button
                  type="button"
                  onClick={(e) => onSelect(incident, e)}
                  aria-pressed={selected}
                  {...pressFeedback}
                  data-cursor="hide"
                  className={cn(
                    "relative flex min-h-14 w-full flex-col gap-2 rounded-2xl border p-4 text-left md:p-5",
                    "bg-gradient-to-br from-surface-card to-surface-deep transition-colors duration-200",
                    "touch-manipulation select-none will-change-transform",
                    selected
                      ? "border-accent shadow-[0_0_0_1px_var(--accent)]"
                      : "border-white/10",
                    focusRingDark,
                  )}
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: PIN_COLOR[incident.category] }}
                    />
                    <span className="font-dmSans text-xs font-semibold tracking-[0.12em] text-accent uppercase">
                      {tag}
                    </span>
                    <span className="ml-auto font-dmSans text-xs text-white/75 tabular-nums">
                      {formatIncidentDate(incident.date, dateLocale)}
                    </span>
                  </span>
                  <span className="font-boldCond text-lg leading-title text-white md:text-xl">
                    {incident.title}
                  </span>
                  <span className="font-dmSans text-sm text-white/75">
                    {incident.location}
                  </span>
                  <span className="line-clamp-1 font-dmSans text-sm text-white/80">
                    {incident.summary}
                  </span>
                  <span className="sr-only">{viewDetails}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </div>
  );
};

export default IncidentList;
