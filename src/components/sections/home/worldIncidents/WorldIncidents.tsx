"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionBadge from "@/components/common/typography/SectionBadge";
import {
  worldIncidents,
  worldIncidentsContent,
  type IncidentCategory,
  type WorldIncident,
} from "@/lib/home/worldIncidents";
import { cn } from "@/utils/helpers/cn";
import { MOTION_OK, motionAllowed, pressFeedback } from "../evolution/motion";
import IncidentMap from "./IncidentMap";
import IncidentList from "./IncidentList";
import IncidentDetail from "./IncidentDetail";
import { focusRingDark, formatIncidentDate } from "./shared";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TABS: IncidentCategory[] = ["un", "world"];

type WorldIncidentsProps = {
  locale?: keyof typeof worldIncidentsContent;
  incidents?: WorldIncident[];
  className?: string;
};

const WorldIncidents = ({
  locale = "en",
  incidents = worldIncidents,
  className,
}: WorldIncidentsProps) => {
  const t = worldIncidentsContent[locale];

  const sectionRef = useRef<HTMLElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<IncidentCategory, HTMLButtonElement>>>(
    {},
  );
  const openerRef = useRef<HTMLElement | null>(null);
  const switchTl = useRef<gsap.core.Timeline | null>(null);
  const pulseRef = useRef<gsap.core.Tween | null>(null);
  const onScreenRef = useRef(false);
  const shownTabRef = useRef<IncidentCategory>("un");

  /** Tab the visitor picked (aria-selected). */
  const [activeTab, setActiveTab] = useState<IncidentCategory>("un");
  /** Tab whose pins/cards are rendered (lags behind during the out-animation). */
  const [displayedTab, setDisplayedTab] = useState<IncidentCategory>("un");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const byTab = (tab: IncidentCategory) =>
    incidents.filter((i) => i.category === tab);
  const shown = byTab(displayedTab);
  const openIncident = incidents.find((i) => i.id === openId) ?? null;

  const pinLabel = (incident: WorldIncident) =>
    [
      t.pinPrefix,
      incident.country,
      incident.missionName,
      formatIncidentDate(incident.date, t.dateLocale, "long"),
    ]
      .filter(Boolean)
      .join(", ");

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
      // Reduced motion never matches: everything is simply shown.
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.6 },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          })
          .from("[data-wi-heading] > *", { y: 30, autoAlpha: 0, stagger: 0.1 })
          .from(
            "[data-wi-tab]",
            { y: 20, autoAlpha: 0, stagger: 0.08 },
            "-=0.3",
          )
          .from("[data-wi-map]", { autoAlpha: 0, duration: 0.7 }, "-=0.2")
          .from(
            "[data-wi-pin]",
            {
              scale: 0,
              autoAlpha: 0,
              stagger: 0.08,
              ease: "back.out(2)",
              duration: 0.45,
            },
            "-=0.3",
          )
          .from(
            "[data-wi-card]",
            { x: 30, autoAlpha: 0, stagger: 0.06, duration: 0.45 },
            "-=0.4",
          );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  /* ---------- Tab switch: animate the new pins and cards in ---------- */
  const animateIn = () => {
    const root = sectionRef.current;
    if (!root) return;
    const pins = root.querySelectorAll("[data-wi-pin]");
    const cards = root.querySelectorAll("[data-wi-card]");
    switchTl.current?.kill();
    if (!motionAllowed()) {
      gsap.set([...pins, ...cards], {
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

  useGSAP(
    () => {
      // Pulse: recreated for the pins on screen, paused while off-screen.
      pulseRef.current?.kill();
      pulseRef.current = null;
      const rings = gsap.utils.toArray<HTMLElement>("[data-wi-pulse]");
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
      if (shownTabRef.current === displayedTab) return;
      shownTabRef.current = displayedTab;
      animateIn();
    },
    { scope: sectionRef, dependencies: [displayedTab] },
  );

  const switchTab = (next: IncidentCategory) => {
    if (next === activeTab) return;
    setActiveTab(next);
    setSelectedId(null);
    switchTl.current?.kill();

    // Tapped back to the tab still on screen: just bring it back in.
    if (next === displayedTab) {
      animateIn();
      return;
    }
    if (!motionAllowed()) {
      setDisplayedTab(next);
      return;
    }
    const root = sectionRef.current;
    if (!root) return;
    switchTl.current = gsap
      .timeline({ onComplete: () => setDisplayedTab(next) })
      .to(root.querySelectorAll("[data-wi-pin]"), {
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.in",
      })
      .to(
        root.querySelectorAll("[data-wi-card]"),
        { autoAlpha: 0, scale: 0.97, duration: 0.25, ease: "power2.in" },
        "<",
      );
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(activeTab);
    let next: IncidentCategory | null = null;
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

  /* ---------- Selecting an incident (pin or card) ---------- */
  const scrollCardIntoView = (id: string) => {
    const list = listScrollRef.current;
    if (!list || list.scrollHeight <= list.clientHeight) return;
    const card = list.querySelector<HTMLElement>(`[data-wi-card="${id}"]`);
    if (!card) return;
    list.scrollTo({
      top: card.offsetTop - list.clientHeight / 2 + card.offsetHeight / 2,
      behavior: motionAllowed() ? "smooth" : "auto",
    });
  };

  const openFromPin = (incident: WorldIncident, e: MouseEvent<HTMLElement>) => {
    openerRef.current = e.currentTarget;
    setSelectedId(incident.id);
    scrollCardIntoView(incident.id);
    setOpenId(incident.id);
  };

  const openFromCard = (
    incident: WorldIncident,
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
      id="world-incidents"
      aria-labelledby="world-incidents-heading"
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
          data-wi-heading
          className="flex max-w-[820px] flex-col items-center text-center mx-auto xl:mx-0 xl:items-start xl:text-left"
        >
          <SectionBadge
            tone="dark"
            className="border-accent/50 bg-surface-deep/60 text-accent"
          >
            {t.eyebrow}
          </SectionBadge>
          <h2
            id="world-incidents-heading"
            className="mt-4 font-boldCond text-[clamp(1.85rem,3vw,3rem)] leading-display uppercase"
          >
            {t.title}
          </h2>
          <p className="mt-4 font-dmSans text-base leading-text text-white/80 md:text-lg">
            {t.intro}
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label={t.tabsLabel}
          onKeyDown={onTabKeyDown}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          {TABS.map((tab) => {
            const selected = tab === activeTab;
            return (
              <button
                key={tab}
                ref={(el) => {
                  tabRefs.current[tab] = el ?? undefined;
                }}
                id={`world-incidents-tab-${tab}`}
                type="button"
                role="tab"
                data-wi-tab
                aria-selected={selected}
                aria-controls="world-incidents-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => switchTab(tab)}
                {...pressFeedback}
                data-cursor="hide"
                className={cn(
                  "inline-flex min-h-14 items-center justify-center gap-3 rounded-full border px-6 font-dmSans text-base font-semibold transition-colors duration-200 md:px-8",
                  "touch-manipulation select-none",
                  selected
                    ? "border-accent bg-accent text-surface-deep"
                    : "border-white/15 bg-surface-deep/60 text-white/85",
                  focusRingDark,
                )}
              >
                {t.tabs[tab]}
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{byTab(tab).length}</span>
              </button>
            );
          })}
        </div>

        <div
          id="world-incidents-panel"
          role="tabpanel"
          aria-labelledby={`world-incidents-tab-${activeTab}`}
          className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[3fr_2fr] xl:gap-8"
        >
          {/* Hidden on mobile: the list is the main view there. */}
          <div className="hidden md:block">
            <IncidentMap
              incidents={shown}
              category={displayedTab}
              selectedId={selectedId}
              label={t.mapLabel}
              pendingText={t.mapPending}
              pinLabel={pinLabel}
              onSelect={openFromPin}
            />
          </div>

          <IncidentList
            incidents={shown}
            selectedId={selectedId}
            dateLocale={t.dateLocale}
            emptyState={t.emptyState}
            viewDetails={t.viewDetails}
            scrollRef={listScrollRef}
            onSelect={openFromCard}
          />
        </div>
      </ContentContainer>

      {openIncident && (
        <IncidentDetail
          incident={openIncident}
          copy={t}
          dateLocale={t.dateLocale}
          onClose={closeDetail}
        />
      )}
    </section>
  );
};

export default WorldIncidents;
