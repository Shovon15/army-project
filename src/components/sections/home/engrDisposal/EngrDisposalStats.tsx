"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionBadge from "@/components/common/typography/SectionBadge";
import {
  battalions as defaultBattalions,
  engrDisposalContent,
  type Battalion,
} from "@/lib/home/engrDisposal";
import {
  getBattalionTotals,
  getEventYears,
  getOverallTotals,
  type YearFilter,
} from "@/lib/home/engrDisposalTotals";
import { cn } from "@/utils/helpers/cn";
import { MOTION_OK, motionAllowed } from "../evolution/motion";
import DisposalSummary, { type SummaryItem } from "./DisposalSummary";
import BattalionBarChart, { type BarRow } from "./BattalionBarChart";
import BattalionCard from "./BattalionCard";
import BattalionDrawer from "./BattalionDrawer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type EngrDisposalStatsProps = {
  locale?: keyof typeof engrDisposalContent;
  battalions?: Battalion[];
  className?: string;
};

const EngrDisposalStats = ({
  locale = "en",
  battalions = defaultBattalions,
  className,
}: EngrDisposalStatsProps) => {
  const t = engrDisposalContent[locale];
  const fmt = new Intl.NumberFormat(t.numberLocale);
  const yearFmt = new Intl.NumberFormat(t.numberLocale, { useGrouping: false });

  const sectionRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const shownYearRef = useRef<YearFilter>(null);

  const [year, setYear] = useState<YearFilter>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* ---------- Everything below is computed from the events ---------- */
  const overall = getOverallTotals(battalions);
  const years = getEventYears(battalions);

  // Cards and the drawer's previous/next follow the all-time ranking.
  const ranked = battalions
    .map((b) => ({ battalion: b, totals: getBattalionTotals(b) }))
    .sort(
      (a, b) =>
        b.totals.total - a.totals.total ||
        a.battalion.name.localeCompare(b.battalion.name),
    );
  const allTimeMax = Math.max(0, ...ranked.map((r) => r.totals.total));

  const rows: BarRow[] = ranked
    .map(({ battalion, totals: allTime }) => {
      const filtered = getBattalionTotals(battalion, year);
      return {
        battalion,
        total: filtered.total,
        operations: filtered.operations,
        initialTotal: allTime.total,
        initialRatio: allTimeMax > 0 ? allTime.total / allTimeMax : 0,
      };
    })
    .sort(
      (a, b) =>
        b.total - a.total || a.battalion.name.localeCompare(b.battalion.name),
    );

  const summary: SummaryItem[] = [
    {
      id: "total",
      label: t.summary.total,
      value: overall.total,
      srText: `${fmt.format(overall.total)} ${t.summary.total}`,
    },
    {
      id: "battalions",
      label: t.summary.battalions,
      value: overall.battalions,
      srText: `${fmt.format(overall.battalions)} ${t.summary.battalions}`,
    },
    {
      id: "operations",
      label: t.summary.operations,
      value: overall.operations,
      srText: `${fmt.format(overall.operations)} ${t.summary.operations}`,
    },
    ...(overall.earliestYear !== null
      ? [
          {
            id: "since",
            label: t.summary.firstRecord,
            prefix: t.summary.since,
            value: overall.earliestYear,
            from: overall.earliestYear - 30,
            grouping: false,
            srText: `${t.summary.since} ${yearFmt.format(overall.earliestYear)}`,
          },
        ]
      : []),
  ];

  /* ---------- Entrance ---------- */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      // Reduced motion never matches: final values and widths stay as rendered.
      mm.add(MOTION_OK, () => {
        const numFmt = (grouping: boolean) =>
          new Intl.NumberFormat(t.numberLocale, { useGrouping: grouping });

        /** Tween a plain object and write the formatted value (no re-render). */
        const count = (el: HTMLElement, from: number, to: number, duration: number) => {
          const f = numFmt(el.dataset.grouping !== "0");
          const obj = { val: from };
          el.textContent = f.format(from);
          return gsap.to(obj, {
            val: to,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = f.format(Math.round(obj.val));
            },
          });
        };

        const stats = gsap.utils.toArray<HTMLElement>("[data-ed-count]");
        const values = gsap.utils.toArray<HTMLElement>("[data-ed-value]");
        // Start values hidden at their "from" so nothing jumps back later.
        stats.forEach((el) => {
          el.textContent = numFmt(el.dataset.grouping !== "0").format(
            Number(el.dataset.from) || 0,
          );
        });
        values.forEach((el) => {
          el.textContent = numFmt(true).format(0);
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.6 },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          })
          .from("[data-ed-heading] > *", { y: 30, autoAlpha: 0, stagger: 0.1 })
          .from("[data-ed-stat]", { y: 30, autoAlpha: 0, stagger: 0.08 }, "-=0.3")
          .add(() => {
            stats.forEach((el) =>
              count(el, Number(el.dataset.from) || 0, Number(el.dataset.value) || 0, 2),
            );
          }, "<")
          .from("[data-ed-year]", { autoAlpha: 0, stagger: 0.03, duration: 0.3 }, "-=0.2")
          .addLabel("bars")
          .from(
            "[data-ed-fill]",
            { scaleX: 0, transformOrigin: "left center", stagger: 0.1, duration: 1.1 },
            "bars",
          )
          .from(
            "[data-ed-value]",
            { left: "0%", stagger: 0.1, duration: 1.1 },
            "bars",
          )
          .add(() => {
            values.forEach((el, i) =>
              gsap.delayedCall(i * 0.1, () =>
                count(el, 0, Number(el.dataset.current) || 0, 1.1),
              ),
            );
          }, "bars")
          .from(
            "[data-ed-card]",
            { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.7 },
            "bars+=0.5",
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [t.numberLocale] },
  );

  /* ---------- Year change: tween bars and numbers, never remount ---------- */
  useGSAP(
    () => {
      if (shownYearRef.current === year) return; // First render / Strict Mode.
      shownYearRef.current = year;
      const section = sectionRef.current;
      if (!section) return;

      const max = Math.max(0, ...rows.map((r) => r.total));
      const motion = motionAllowed();
      const numFmt = new Intl.NumberFormat(t.numberLocale);

      rows.forEach((row) => {
        const bar = section.querySelector(`[data-ed-bar="${row.battalion.id}"]`);
        const fill = bar?.querySelector<HTMLElement>("[data-ed-fill]");
        const value = bar?.querySelector<HTMLElement>("[data-ed-value]");
        if (!fill || !value) return;
        const ratio = max > 0 ? row.total / max : 0;
        const from = Number(value.dataset.current) || 0;
        value.dataset.current = String(row.total);

        if (!motion) {
          gsap.set(fill, { scaleX: ratio });
          gsap.set(value, { left: `${ratio * 100}%` });
          value.textContent = numFmt.format(row.total);
          return;
        }
        gsap.to(fill, { scaleX: ratio, duration: 0.7, ease: "power3.out", overwrite: "auto" });
        gsap.to(value, { left: `${ratio * 100}%`, duration: 0.7, ease: "power3.out", overwrite: "auto" });
        const obj = { val: from };
        gsap.to(obj, {
          val: row.total,
          duration: 0.7,
          ease: "power2.out",
          onUpdate: () => {
            value.textContent = numFmt.format(Math.round(obj.val));
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [year] },
  );

  /* ---------- Drawer ---------- */
  const openBattalion = (id: string, e: MouseEvent<HTMLElement>) => {
    const i = ranked.findIndex((r) => r.battalion.id === id);
    if (i < 0) return;
    openerRef.current = e.currentTarget;
    setOpenIndex(i);
  };

  const closeDrawer = () => {
    setOpenIndex(null);
    requestAnimationFrame(() =>
      openerRef.current?.focus({ preventScroll: true }),
    );
  };

  return (
    <section
      ref={sectionRef}
      id="statistics"
      aria-labelledby="statistics-heading"
      className={cn(
        "relative isolate overflow-hidden bg-surface-dark py-16 text-white md:py-20 xl:py-24",
        className,
      )}
    >
      {/* Diagonal hazard-stripe texture, very low opacity (as Key Numbers). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.03] bg-[repeating-linear-gradient(135deg,var(--accent)_0_22px,transparent_22px_44px)]"
      />

      <ContentContainer>
        <div
          data-ed-heading
          className="mx-auto flex max-w-[820px] flex-col items-center text-center xl:mx-0 xl:items-start xl:text-left"
        >
          <SectionBadge
            tone="dark"
            className="border-accent/50 bg-surface-deep/60 text-accent"
          >
            {t.eyebrow}
          </SectionBadge>
          <h2
            id="statistics-heading"
            className="mt-4 font-boldCond text-[clamp(1.85rem,3vw,3rem)] leading-display uppercase"
          >
            {t.title}
          </h2>
          <p className="mt-4 font-dmSans text-base leading-text text-white/80 md:text-lg">
            {t.intro}
          </p>
        </div>

        <DisposalSummary items={summary} numberLocale={t.numberLocale} />

        {battalions.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-white/15 p-10 text-center font-dmSans text-base text-white/75">
            {t.emptyState}
          </p>
        ) : (
          <>
            <BattalionBarChart
              rows={rows}
              years={years}
              year={year}
              numberLocale={t.numberLocale}
              copy={t}
              onYear={setYear}
              onOpen={openBattalion}
            />

            <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {ranked.map(({ battalion, totals }) => (
                <li key={battalion.id} data-ed-card className="flex">
                  <BattalionCard
                    battalion={battalion}
                    totals={totals}
                    numberLocale={t.numberLocale}
                    dateLocale={t.dateLocale}
                    copy={t}
                    onOpen={openBattalion}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </ContentContainer>

      {openIndex !== null && (
        <BattalionDrawer
          battalions={ranked.map((r) => r.battalion)}
          initialIndex={openIndex}
          copy={t}
          numberLocale={t.numberLocale}
          dateLocale={t.dateLocale}
          onClose={closeDrawer}
        />
      )}
    </section>
  );
};

export default EngrDisposalStats;
