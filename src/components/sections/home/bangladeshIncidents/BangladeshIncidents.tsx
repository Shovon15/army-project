"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionBadge from "@/components/common/typography/SectionBadge";
import {
  CHT_DISTRICTS,
  bangladeshIncidents,
  bangladeshIncidentsContent,
  type BangladeshIncident,
  type BangladeshRegion,
} from "@/lib/home/bangladeshIncidents";
import { cn } from "@/utils/helpers/cn";
import { MOTION_OK, motionAllowed, pressFeedback } from "../evolution/motion";
import {
  focusRingLight,
  formatIncidentDate,
  goldTextOnLight,
} from "../worldIncidents/shared";
import BangladeshMap, { regionHighlight } from "./BangladeshMap";
import IncidentTimeline from "./IncidentTimeline";
import BangladeshIncidentDetail from "./BangladeshIncidentDetail";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TABS: BangladeshRegion[] = ["cht", "country"];

const regionOfDistrict = (district: string): BangladeshRegion =>
  CHT_DISTRICTS.some((d) => d.toLowerCase() === district.toLowerCase())
    ? "cht"
    : "country";

type BangladeshIncidentsProps = {
  locale?: keyof typeof bangladeshIncidentsContent;
  incidents?: BangladeshIncident[];
  className?: string;
};

const BangladeshIncidents = ({
  locale = "en",
  incidents = bangladeshIncidents,
  className,
}: BangladeshIncidentsProps) => {
  const t = bangladeshIncidentsContent[locale];
  const numberFmt = new Intl.NumberFormat(t.dateLocale);

  const sectionRef = useRef<HTMLElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<BangladeshRegion, HTMLButtonElement>>>(
    {},
  );
  const openerRef = useRef<HTMLElement | null>(null);
  const switchTl = useRef<gsap.core.Timeline | null>(null);
  const pulseRef = useRef<gsap.core.Tween | null>(null);
  const onScreenRef = useRef(false);
  const shownKeyRef = useRef("cht|");

  /** Tab the visitor picked (aria-selected). */
  const [activeTab, setActiveTab] = useState<BangladeshRegion>("cht");
  /** Tab whose pins/cards are rendered (lags behind during the out-animation). */
  const [displayedTab, setDisplayedTab] = useState<BangladeshRegion>("cht");
  const [districtFilter, setDistrictFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const byTab = (tab: BangladeshRegion) =>
    incidents.filter((i) => i.region === tab);
  const shown = byTab(displayedTab)
    .filter((i) => !districtFilter || i.district === districtFilter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const openIncident = incidents.find((i) => i.id === openId) ?? null;

  /* Mini stats: always computed from the data. */
  const stats = [
    { id: "total", label: t.stats.total, value: incidents.length },
    { id: "cht", label: t.stats.cht, value: byTab("cht").length },
    { id: "country", label: t.stats.country, value: byTab("country").length },
    {
      id: "disposed",
      label: t.stats.disposed,
      value: incidents.filter((i) => i.outcomeType === "disposed").length,
    },
  ];

  const pinLabel = (incident: BangladeshIncident) =>
    [
      t.pinPrefix,
      incident.district,
      formatIncidentDate(incident.date, t.dateLocale, "long"),
      incident.outcome.toLowerCase(),
    ].join(", ");

  /* ---------- Entrance + pausing the pulse while off-screen ---------- */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          onScreenRef.current = self.isActive;
          if (self.isActive) pulseRef.current?.play();
          else pulseRef.current?.pause();
        },
      });

      const mm = gsap.matchMedia();
      // Reduced motion never matches: the final numbers and states stay.
      mm.add(MOTION_OK, () => {
        const fmt = new Intl.NumberFormat(t.dateLocale);
        const numbers = gsap.utils.toArray<HTMLElement>("[data-bd-count]");
        numbers.forEach((el) => {
          el.textContent = fmt.format(0);
        });
        const countUp = () =>
          numbers.forEach((el) => {
            const counter = { val: 0 };
            gsap.to(counter, {
              val: Number(el.dataset.value) || 0,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = fmt.format(Math.round(counter.val));
              },
            });
          });

        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.6 },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          })
          .from("[data-bd-heading] > *", { y: 30, autoAlpha: 0, stagger: 0.1 })
          .from(
            "[data-bd-stat]",
            { y: 20, autoAlpha: 0, stagger: 0.08 },
            "-=0.3",
          )
          .add(countUp, "<")
          .from(
            "[data-bd-tab]",
            { y: 20, autoAlpha: 0, stagger: 0.08 },
            "-=0.2",
          )
          .from("[data-bd-map]", { autoAlpha: 0, duration: 0.7 }, "-=0.2")
          .from(
            // The district SVG loads after mount, so this may be empty; an
            // array (not a selector string) avoids GSAP's "not found" warning.
            gsap.utils.toArray<Element>("[data-bd-cht]"),
            {
              scale: 0.85,
              autoAlpha: 0,
              transformOrigin: "50% 50%",
              duration: 0.6,
            },
            "-=0.3",
          )
          .from(
            "[data-bd-pin]",
            {
              scale: 0,
              autoAlpha: 0,
              stagger: 0.08,
              ease: "back.out(2)",
              duration: 0.45,
            },
            "-=0.2",
          )
          .from(
            "[data-bd-line]",
            { scaleY: 0, transformOrigin: "top center", duration: 0.8 },
            "-=0.3",
          )
          .from(
            "[data-bd-card]",
            { x: 30, autoAlpha: 0, stagger: 0.06, duration: 0.45 },
            "<0.1",
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [t.dateLocale] },
  );

  /* ---------- Bring the current pins and cards in ---------- */
  const animateIn = () => {
    const root = sectionRef.current;
    if (!root) return;
    const pins = root.querySelectorAll("[data-bd-pin]");
    const cards = root.querySelectorAll("[data-bd-card]");
    const line = root.querySelectorAll("[data-bd-line]");
    switchTl.current?.kill();
    if (!motionAllowed()) {
      gsap.set([...pins, ...cards, ...line], {
        clearProps: "opacity,visibility,transform",
      });
      return;
    }
    switchTl.current = gsap
      .timeline()
      .fromTo(
        pins,
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.45,
          ease: "back.out(2)",
          stagger: 0.08,
        },
      )
      .fromTo(
        line,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.5, ease: "power3.out" },
        0,
      )
      .fromTo(
        cards,
        { x: 30, autoAlpha: 0, scale: 1 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
        },
        0.1,
      );
  };

  const shownKey = `${displayedTab}|${districtFilter ?? ""}`;

  useGSAP(
    () => {
      // Pulse: recreated for the pins on screen, paused while off-screen.
      pulseRef.current?.kill();
      pulseRef.current = null;
      const rings = gsap.utils.toArray<HTMLElement>("[data-bd-pulse]");
      if (motionAllowed() && rings.length) {
        pulseRef.current = gsap.fromTo(
          rings,
          { scale: 1, opacity: 0.55 },
          {
            scale: 3,
            opacity: 0,
            duration: 1.4,
            ease: "power1.out",
            // Each ring repeats on its own (offset start), forever, yoyo.
            stagger: { each: 0.25, repeat: -1, yoyo: true },
            paused: !onScreenRef.current,
          },
        );
      } else {
        gsap.set(rings, { opacity: 0 });
      }

      // Skip the first render (the entrance handles it) and Strict Mode reruns.
      if (shownKeyRef.current === shownKey) return;
      shownKeyRef.current = shownKey;
      animateIn();
    },
    { scope: sectionRef, dependencies: [shownKey] },
  );

  /* ---------- Tab switch: one timeline for map highlight, pins and cards ---------- */
  const switchTab = (next: BangladeshRegion) => {
    if (next === activeTab) return;
    setActiveTab(next);
    setSelectedId(null);
    setDistrictFilter(null);
    switchTl.current?.kill();

    const root = sectionRef.current;
    if (!root) return;
    const cht = root.querySelectorAll("[data-bd-cht]");
    const other = root.querySelectorAll("[data-bd-other]");
    const h = regionHighlight(next);

    if (!motionAllowed()) {
      gsap.set(cht, h.cht);
      gsap.set(other, h.other);
      if (next === displayedTab) animateIn();
      else setDisplayedTab(next);
      return;
    }

    const tl = gsap.timeline();
    tl.to(cht, { ...h.cht, duration: 0.45, ease: "power2.inOut" }, 0).to(
      other,
      { ...h.other, duration: 0.45, ease: "power2.inOut" },
      0,
    );

    if (next === displayedTab) {
      // Tapped back to the tab still on screen: just bring it back in.
      switchTl.current = tl;
      animateIn();
      return;
    }
    tl.to(
      root.querySelectorAll("[data-bd-pin]"),
      { scale: 0.4, autoAlpha: 0, duration: 0.25, ease: "power2.in" },
      0,
    )
      .to(
        root.querySelectorAll("[data-bd-card]"),
        { autoAlpha: 0, scale: 0.97, duration: 0.25, ease: "power2.in" },
        0,
      )
      .call(() => setDisplayedTab(next), [], 0.26);
    switchTl.current = tl;
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(activeTab);
    let next: BangladeshRegion | null = null;
    if (e.key === "ArrowRight") next = TABS[(i + 1) % TABS.length];
    else if (e.key === "ArrowLeft")
      next = TABS[(i - 1 + TABS.length) % TABS.length];
    else if (e.key === "Home") next = TABS[0];
    else if (e.key === "End") next = TABS[TABS.length - 1];
    if (!next) return;
    e.preventDefault();
    switchTab(next);
    tabRefs.current[next]?.focus();
  };

  /* ---------- District filter (from tapping a district on the SVG map) ---------- */
  const filterByDistrict = (district: string) => {
    const region = regionOfDistrict(district);
    if (region !== activeTab) switchTab(region);
    setSelectedId(null);
    setDistrictFilter(district);
  };

  /* ---------- Selecting an incident (pin or card) ---------- */
  const scrollCardIntoView = (id: string) => {
    const list = listScrollRef.current;
    if (!list || list.scrollHeight <= list.clientHeight) return;
    const card = list.querySelector<HTMLElement>(`[data-bd-card="${id}"]`);
    if (!card) return;
    list.scrollTo({
      top: card.offsetTop - list.clientHeight / 2 + card.offsetHeight / 2,
      behavior: motionAllowed() ? "smooth" : "auto",
    });
  };

  const openFromPin = (
    incident: BangladeshIncident,
    e: MouseEvent<HTMLElement>,
  ) => {
    openerRef.current = e.currentTarget;
    setSelectedId(incident.id);
    scrollCardIntoView(incident.id);
    setOpenId(incident.id);
  };

  const openFromCard = (
    incident: BangladeshIncident,
    e: MouseEvent<HTMLElement>,
  ) => {
    openerRef.current = e.currentTarget;
    setSelectedId(incident.id);
    setOpenId(incident.id);
  };

  const closeDetail = () => {
    setOpenId(null);
    requestAnimationFrame(() =>
      openerRef.current?.focus({ preventScroll: true }),
    );
  };

  return (
    <section
      ref={sectionRef}
      id="bangladesh-incidents"
      aria-labelledby="bangladesh-incidents-heading"
      className={cn(
        "relative isolate overflow-hidden bg-surface-light py-16 text-ink md:py-20 xl:py-24",
        className,
      )}
    >
      {/* Faint hazard-stripe line at the top, as in Quick Access. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.8)_0_14px,transparent_14px_28px)]"
      />

      <ContentContainer>
        <div
          data-bd-heading
          className="mx-auto flex max-w-[820px] flex-col items-center text-center xl:mx-0 xl:items-start xl:text-left"
        >
          <SectionBadge
            tone="light"
            className={cn("border-accent/50 bg-accent/10", goldTextOnLight)}
          >
            {t.eyebrow}
          </SectionBadge>
          <h2
            id="bangladesh-incidents-heading"
            className="mt-4 font-boldCond text-[clamp(1.85rem,3vw,3rem)] leading-display text-ink uppercase"
          >
            {t.title}
          </h2>
          <p className="mt-4 font-dmSans text-base leading-text text-ink-muted md:text-lg">
            {t.intro}
          </p>
        </div>

        {/* Mini stats (computed) */}
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => {
            const final = numberFmt.format(s.value);
            return (
              <li
                key={s.id}
                data-bd-stat
                className="rounded-xl border border-ink/10 bg-white px-4 py-4 text-center shadow-[0_12px_30px_-20px_rgba(18,12,51,0.35)] xl:text-left"
              >
                <span className="sr-only">{`${final} ${s.label}`}</span>
                <span
                  aria-hidden="true"
                  data-bd-count
                  data-value={s.value}
                  className={cn(
                    "block font-boldCond text-[clamp(1.75rem,3vw,2.5rem)] leading-none tabular-nums",
                    goldTextOnLight,
                  )}
                >
                  {final}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-2 block font-dmSans text-sm font-semibold text-ink-soft"
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label={t.tabsLabel}
          onKeyDown={onTabKeyDown}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          {TABS.map((tab) => {
            const selected = tab === activeTab;
            return (
              <button
                key={tab}
                ref={(el) => {
                  tabRefs.current[tab] = el ?? undefined;
                }}
                id={`bangladesh-incidents-tab-${tab}`}
                type="button"
                role="tab"
                data-bd-tab
                aria-selected={selected}
                aria-controls="bangladesh-incidents-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => switchTab(tab)}
                {...pressFeedback}
                data-cursor="hide"
                className={cn(
                  "inline-flex min-h-14 items-center justify-center gap-3 rounded-full border px-6 font-dmSans text-base font-semibold transition-colors duration-200 md:px-8",
                  "touch-manipulation select-none",
                  selected
                    ? "border-accent bg-accent text-surface-deep"
                    : "border-ink/15 bg-white text-ink-soft hover:border-accent/60",
                  focusRingLight,
                )}
              >
                {t.tabs[tab]}
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {numberFmt.format(byTab(tab).length)}
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="bangladesh-incidents-panel"
          role="tabpanel"
          aria-labelledby={`bangladesh-incidents-tab-${activeTab}`}
          className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[45fr_55fr] xl:gap-8"
        >
          {/* Mobile: list first, small map below it. */}
          <div className="order-2 md:order-1">
            <BangladeshMap
              incidents={shown}
              region={displayedTab}
              selectedId={selectedId}
              label={t.mapLabel}
              pendingText={t.mapPending}
              chtLabel={t.chtLabel}
              pinLabel={pinLabel}
              onSelect={openFromPin}
              onDistrict={filterByDistrict}
            />
          </div>

          <div className="order-1 flex flex-col gap-4 md:order-2">
            {districtFilter && (
              <button
                type="button"
                onClick={() => setDistrictFilter(null)}
                aria-label={`${t.clearFilter}: ${districtFilter}`}
                {...pressFeedback}
                className={cn(
                  "inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-accent/60 bg-accent/10 px-5 font-dmSans text-sm font-semibold",
                  goldTextOnLight,
                  focusRingLight,
                )}
              >
                {t.filtered}: {districtFilter}
                <span aria-hidden="true">✕</span>
              </button>
            )}
            <div className="flex-1">
              <IncidentTimeline
                incidents={shown}
                selectedId={selectedId}
                dateLocale={t.dateLocale}
                emptyState={t.emptyState}
                viewDetails={t.viewDetails}
                scrollRef={listScrollRef}
                onSelect={openFromCard}
              />
            </div>
          </div>
        </div>
      </ContentContainer>

      {openIncident && (
        <BangladeshIncidentDetail
          incident={openIncident}
          copy={t}
          dateLocale={t.dateLocale}
          onClose={closeDetail}
        />
      )}
    </section>
  );
};

export default BangladeshIncidents;
