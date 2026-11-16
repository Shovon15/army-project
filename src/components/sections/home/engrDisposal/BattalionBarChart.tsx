"use client";

import type { MouseEvent } from "react";
import type { Battalion } from "@/lib/home/engrDisposal";
import type { YearFilter } from "@/lib/home/engrDisposalTotals";
import { cn } from "@/utils/helpers/cn";
import { pressFeedback } from "../evolution/motion";
import { focusRingDark } from "../worldIncidents/shared";

export type BarRow = {
  battalion: Battalion;
  /** Totals for the current year filter. */
  total: number;
  operations: number;
  /** All-time values: only used for the first paint, GSAP owns them after. */
  initialTotal: number;
  initialRatio: number;
};

type BattalionBarChartProps = {
  /** Sorted by `total`, highest first. */
  rows: BarRow[];
  years: number[];
  year: YearFilter;
  numberLocale: string;
  copy: {
    chartTitle: string;
    chartPeriod: string;
    allTime: string;
    iedsDisposed: string;
    openDetails: string;
    tableCaption: string;
    battalion: string;
    operations: string;
  };
  onYear: (year: YearFilter) => void;
  onOpen: (battalionId: string, e: MouseEvent<HTMLElement>) => void;
};

/**
 * Horizontal bars in plain HTML (no chart library is installed). Bars are
 * never remounted when the year changes: the section tweens `scaleX`, the
 * label position and the number, so React must not own those values after
 * the first paint (hence the constant `initial*` props).
 */
const BattalionBarChart = ({
  rows,
  years,
  year,
  numberLocale,
  copy,
  onYear,
  onOpen,
}: BattalionBarChartProps) => {
  const fmt = new Intl.NumberFormat(numberLocale);
  const yearFmt = new Intl.NumberFormat(numberLocale, { useGrouping: false });
  const periods: YearFilter[] = [null, ...years];

  return (
    <div className="mt-12 rounded-2xl border border-white/10 bg-surface-deep/40 p-5 md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="font-boldCond text-[clamp(1.3rem,1.8vw,1.75rem)] leading-title uppercase">
          {copy.chartTitle}
        </h3>

        {/* Period selector: All time, or one year */}
        <div
          role="group"
          aria-label={copy.chartPeriod}
          className="flex flex-wrap gap-2"
        >
          {periods.map((p) => {
            const active = p === year;
            return (
              <button
                key={p ?? "all"}
                type="button"
                data-ed-year
                aria-pressed={active}
                onClick={() => onYear(p)}
                {...pressFeedback}
                data-cursor="hide"
                className={cn(
                  "min-h-12 rounded-full border px-4 font-dmSans text-sm font-semibold tabular-nums transition-colors duration-200",
                  "touch-manipulation select-none",
                  active
                    ? "border-accent bg-accent text-surface-deep"
                    : "border-white/15 bg-surface-dark/60 text-white/85",
                  focusRingDark,
                )}
              >
                {p === null ? copy.allTime : yearFmt.format(p)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Each bar button carries its own full aria-label; the visually
          hidden table below repeats the same data for screen readers. */}
      <ul className="mt-6 flex flex-col gap-3">
        {rows.map((row) => {
          const label = `${row.battalion.name}, ${fmt.format(row.total)} ${copy.iedsDisposed}${
            year === null ? "" : ` (${yearFmt.format(year)})`
          }, ${copy.openDetails}`;
          return (
            <li key={row.battalion.id}>
              <button
                type="button"
                data-ed-bar={row.battalion.id}
                aria-label={label}
                onClick={(e) => onOpen(row.battalion.id, e)}
                {...pressFeedback}
                data-cursor="hide"
                className={cn(
                  "grid min-h-14 w-full grid-cols-1 items-center gap-2 rounded-xl px-3 py-3 text-left md:grid-cols-[minmax(160px,240px)_1fr] md:gap-5",
                  "touch-manipulation select-none will-change-transform",
                  focusRingDark,
                )}
              >
                <span
                  aria-hidden="true"
                  className="truncate font-dmSans text-sm font-semibold text-white md:text-base"
                >
                  {row.battalion.name}
                </span>
                <span aria-hidden="true" className="relative block h-9 pr-16">
                  <span className="relative block h-full">
                    <span className="absolute inset-0 rounded-lg bg-white/[0.06]" />
                    <span
                      data-ed-fill
                      className="absolute inset-0 origin-left rounded-lg bg-gradient-to-r from-accent/70 to-accent"
                      style={{ transform: `scaleX(${row.initialRatio})` }}
                    />
                    <span
                      data-ed-value
                      data-current={row.initialTotal}
                      className="absolute top-1/2 ml-3 -translate-y-1/2 font-boldCond text-xl leading-none text-accent tabular-nums md:text-2xl"
                      style={{ left: `${row.initialRatio * 100}%` }}
                    >
                      {fmt.format(row.initialTotal)}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Same data for screen readers */}
      <table className="sr-only">
        <caption>
          {copy.tableCaption}
          {year === null ? "" : ` (${yearFmt.format(year)})`}
        </caption>
        <thead>
          <tr>
            <th scope="col">{copy.battalion}</th>
            <th scope="col">{copy.iedsDisposed}</th>
            <th scope="col">{copy.operations}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.battalion.id}>
              <th scope="row">{row.battalion.name}</th>
              <td>{fmt.format(row.total)}</td>
              <td>{fmt.format(row.operations)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BattalionBarChart;
