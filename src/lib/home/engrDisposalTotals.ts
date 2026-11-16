/* Computed totals for the Engr disposal statistics. Everything is derived
   from the events in ./engrDisposal.ts; nothing here is hard-coded. */

import {
  DISPOSAL_REGIONS,
  type Battalion,
  type DisposalEvent,
  type DisposalRegion,
} from "./engrDisposal";

/** `null` = all time. */
export type YearFilter = number | null;

const yearOf = (e: DisposalEvent) => Number(e.date.slice(0, 4));

const inYear = (events: DisposalEvent[], year: YearFilter) =>
  year === null ? events : events.filter((e) => yearOf(e) === year);

const sumQuantity = (events: DisposalEvent[]) =>
  events.reduce((n, e) => n + e.quantity, 0);

const emptyRegions = (): Record<DisposalRegion, number> => ({
  cht: 0,
  country: 0,
  un: 0,
});

/** Newest first. */
export const sortEventsNewestFirst = (events: DisposalEvent[]) =>
  [...events].sort((a, b) => b.date.localeCompare(a.date));

export type BattalionTotals = {
  /** IEDs disposed. */
  total: number;
  /** Disposal operations (event count). */
  operations: number;
  /** IEDs disposed per region. */
  byRegion: Record<DisposalRegion, number>;
  /** Event count per region. */
  operationsByRegion: Record<DisposalRegion, number>;
  lastEvent: DisposalEvent | null;
};

export const getBattalionTotals = (
  battalion: Battalion,
  year: YearFilter = null,
): BattalionTotals => {
  const events = inYear(battalion.events, year);
  const byRegion = emptyRegions();
  const operationsByRegion = emptyRegions();
  events.forEach((e) => {
    byRegion[e.region] += e.quantity;
    operationsByRegion[e.region] += 1;
  });
  return {
    total: sumQuantity(events),
    operations: events.length,
    byRegion,
    operationsByRegion,
    lastEvent: sortEventsNewestFirst(events)[0] ?? null,
  };
};

export type OverallTotals = {
  total: number;
  battalions: number;
  operations: number;
  earliestYear: number | null;
  byRegion: Record<DisposalRegion, number>;
  /** IEDs disposed per year, ascending by year. */
  byYear: { year: number; total: number }[];
};

export const getOverallTotals = (
  list: Battalion[],
  year: YearFilter = null,
): OverallTotals => {
  const events = list.flatMap((b) => inYear(b.events, year));
  const byRegion = emptyRegions();
  const perYear = new Map<number, number>();
  events.forEach((e) => {
    byRegion[e.region] += e.quantity;
    perYear.set(yearOf(e), (perYear.get(yearOf(e)) ?? 0) + e.quantity);
  });
  const years = [...perYear.keys()].sort((a, b) => a - b);
  return {
    total: sumQuantity(events),
    battalions: list.length,
    operations: events.length,
    earliestYear: years[0] ?? null,
    byRegion,
    byYear: years.map((y) => ({ year: y, total: perYear.get(y) ?? 0 })),
  };
};

/** Years that have at least one event, newest first. */
export const getEventYears = (list: Battalion[]) =>
  [...new Set(list.flatMap((b) => b.events.map(yearOf)))].sort((a, b) => b - a);

export { DISPOSAL_REGIONS };
