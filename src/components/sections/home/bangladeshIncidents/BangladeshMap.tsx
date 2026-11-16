"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";
import {
  BANGLADESH_MAP,
  CHT_APPROX_BOUNDS,
  CHT_DISTRICTS,
  normalizeDistrict,
  projectBangladesh,
  type BangladeshIncident,
  type BangladeshRegion,
} from "@/lib/home/bangladeshIncidents";
import { cn } from "@/utils/helpers/cn";
import { pressFeedback } from "../evolution/motion";
import { focusRingLight } from "../worldIncidents/shared";

type BangladeshMapProps = {
  incidents: BangladeshIncident[];
  /** Region whose highlight state is applied when the SVG first loads. */
  region: BangladeshRegion;
  selectedId: string | null;
  label: string;
  pendingText: string;
  chtLabel: string;
  pinLabel: (incident: BangladeshIncident) => string;
  onSelect: (incident: BangladeshIncident, e: MouseEvent<HTMLElement>) => void;
  /** Tapping a district (SVG map only) filters the list to it. */
  onDistrict: (district: string) => void;
};

/** Map highlight per tab: CHT glows on its tab, the rest dims. */
export const regionHighlight = (region: BangladeshRegion) => ({
  cht: { opacity: region === "cht" ? 1 : 0.45 },
  other: { opacity: region === "cht" ? 0.4 : 1 },
});

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/* Map colours (original dark districts, gold CHT). Only the panel behind
   the map is light. */
const DISTRICT_FILL = "#1d2a4a";
const DISTRICT_STROKE = "rgb(255 255 255 / 0.18)";
const CHT_FILL = "rgb(213 181 70 / 0.35)";
const CHT_STROKE = "rgb(213 181 70 / 0.9)";

const BangladeshMap = ({
  incidents,
  region,
  selectedId,
  label,
  pendingText,
  chtLabel,
  pinLabel,
  onSelect,
  onDistrict,
}: BangladeshMapProps) => {
  const { width, height } = BANGLADESH_MAP;
  const svgHostRef = useRef<HTMLDivElement>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [svgFailed, setSvgFailed] = useState(false);
  /** Placeholder only when there is no map file (or it failed to load). */
  const showPlaceholder = !BANGLADESH_MAP.available || svgFailed;

  /* Load the district SVG inline (our own static file) so paths can be styled. */
  useEffect(() => {
    if (!BANGLADESH_MAP.available) return;
    let cancelled = false;
    fetch(BANGLADESH_MAP.src)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => {
        if (!cancelled) setSvgMarkup(text);
      })
      .catch(() => {
        // Fall back to the placeholder panel; the list still works.
        if (!cancelled) setSvgFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Tag and style the districts once the SVG is in the DOM. */
  useEffect(() => {
    const host = svgHostRef.current;
    if (!svgMarkup || !host) return;
    const svg = host.querySelector("svg");
    svg?.setAttribute("aria-hidden", "true");
    svg?.setAttribute("preserveAspectRatio", "none");
    const cht = new Set(CHT_DISTRICTS.map((d) => d.toLowerCase()));
    host.querySelectorAll<SVGPathElement>("path").forEach((path) => {
      const raw = path.dataset.name ?? path.id;
      if (!raw) return;
      // Map file spellings → the names used in the incident data.
      const name = normalizeDistrict(raw);
      const isCht = cht.has(name.toLowerCase());
      path.dataset.bdDistrict = name;
      path.setAttribute("vector-effect", "non-scaling-stroke");
      path.setAttribute("stroke-width", "1");
      path.style.cursor = "pointer";
      if (isCht) {
        path.setAttribute("data-bd-cht", "");
        path.setAttribute("fill", CHT_FILL);
        path.setAttribute("stroke", CHT_STROKE);
      } else {
        path.setAttribute("data-bd-other", "");
        path.setAttribute("fill", DISTRICT_FILL);
        path.setAttribute("stroke", DISTRICT_STROKE);
      }
    });
    const h = regionHighlight(region);
    gsap.set(host.querySelectorAll("[data-bd-cht]"), h.cht);
    gsap.set(host.querySelectorAll("[data-bd-other]"), h.other);
    // Only when new markup arrives; tab changes are tweened by the section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgMarkup]);

  const chtBox = {
    a: projectBangladesh(CHT_APPROX_BOUNDS.maxLat, CHT_APPROX_BOUNDS.minLng),
    b: projectBangladesh(CHT_APPROX_BOUNDS.minLat, CHT_APPROX_BOUNDS.maxLng),
  };
  const initial = regionHighlight(region);

  return (
    <div
      data-bd-map
      role="group"
      aria-label={label}
      /* Height fits the screen: on xl the width is capped so that the map's
         height (width × 988/700) never exceeds the viewport minus a margin;
         aspect-ratio keeps the shape, so pins stay on their districts. */
      className="relative mx-auto h-[min(320px,calc(100svh-7rem))] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_50px_-28px_rgba(18,12,51,0.35)] md:h-[min(420px,calc(100svh-7rem))] xl:h-auto xl:w-[min(100%,calc((100svh-10rem)*700/988))]"
      style={{ aspectRatio: `${width} / ${height}` }}
      onClick={(e) => {
        const district = (e.target as Element).closest<SVGElement>(
          "[data-bd-district]",
        )?.dataset.bdDistrict;
        if (district) onDistrict(district);
      }}
    >
      {svgMarkup ? (
        <div
          ref={svgHostRef}
          aria-hidden="true"
          className="absolute inset-0 [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : showPlaceholder ? (
        /* No map file (BANGLADESH_MAP.available = false) or it failed to
           load. Placeholder: grid + an approximate CHT zone. */
        <div aria-hidden="true" className="absolute inset-0">
          <div
            data-bd-other
            style={initial.other}
            className="absolute inset-0 bg-[linear-gradient(to_right,rgb(18_12_51/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(18_12_51/0.07)_1px,transparent_1px)] bg-[size:calc(100%/6)_calc(100%/8)]"
          />
          <div
            data-bd-cht
            style={{
              ...initial.cht,
              left: pct(chtBox.a.x, width),
              top: pct(chtBox.a.y, height),
              width: pct(chtBox.b.x - chtBox.a.x, width),
              height: pct(chtBox.b.y - chtBox.a.y, height),
            }}
            className="absolute rounded-[40%] border-2 border-accent/80 bg-accent/25 shadow-[0_0_40px_rgb(var(--accent-rgb)/0.35)]"
          />
          <span className="absolute bottom-3 left-4 font-dmSans text-xs tracking-[0.14em] text-ink-muted uppercase">
            {pendingText}
          </span>
        </div>
      ) : null}

      {/* Data credit required by the boundary licence (CC BY 3.0 IGO) */}
      {svgMarkup && (
        <span className="pointer-events-none absolute right-3 bottom-2 z-[5] font-dmSans text-[11px] text-ink-muted">
          {BANGLADESH_MAP.credit}
        </span>
      )}

      {/* CHT label, placed at the west edge of the CHT zone */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -translate-x-full -translate-y-1/2 pr-2 font-boldCond text-lg tracking-[0.12em] text-accent",
        )}
        style={{
          left: pct(chtBox.a.x, width),
          top: pct((chtBox.a.y + chtBox.b.y) / 2, height),
        }}
      >
        {chtLabel}
      </span>

      {incidents.map((incident) => {
        const { x, y } = projectBangladesh(incident.lat, incident.lng);
        const selected = incident.id === selectedId;
        return (
          <button
            key={incident.id}
            type="button"
            data-bd-pin={incident.id}
            aria-label={pinLabel(incident)}
            aria-pressed={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(incident, e);
            }}
            {...pressFeedback}
            data-cursor="hide"
            className={cn(
              // 44×44 invisible hit area around the dot.
              "absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
              "touch-manipulation select-none",
              selected ? "z-20" : "z-10",
              focusRingLight,
            )}
            style={{ left: pct(x, width), top: pct(y, height) }}
          >
            <span
              data-bd-pulse
              aria-hidden="true"
              className="absolute h-3.5 w-3.5 rounded-full bg-accent"
            />
            <span
              aria-hidden="true"
              className={cn(
                "relative rounded-full border-2 border-surface-deep bg-accent transition-[width,height,box-shadow] duration-200",
                selected
                  ? "h-5 w-5 shadow-[0_0_0_4px_rgb(255_255_255/0.85)]"
                  : "h-3.5 w-3.5",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default BangladeshMap;
