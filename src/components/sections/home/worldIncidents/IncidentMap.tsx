"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  WORLD_MAP,
  projectLatLng,
  type IncidentCategory,
  type WorldIncident,
} from "@/lib/home/worldIncidents";
import { cn } from "@/utils/helpers/cn";
import { pressFeedback } from "../evolution/motion";
import { PIN_COLOR, focusRingDark } from "./shared";

type IncidentMapProps = {
  incidents: WorldIncident[];
  category: IncidentCategory;
  selectedId: string | null;
  label: string;
  pendingText: string;
  pinLabel: (incident: WorldIncident) => string;
  onSelect: (incident: WorldIncident, e: MouseEvent<HTMLElement>) => void;
};

/** Country styling on the dark panel. */
const LAND_FILL = "#1f2b49";
const LAND_STROKE = "rgb(255 255 255 / 0.14)";
/** Tint for countries that have an incident on the active tab. */
const INCIDENT_TINT = {
  un: "rgb(213 181 70 / 0.28)",
  world: "rgb(224 101 91 / 0.24)",
} as const;
/** ISO code of the home country, outlined in the accent. */
const HOME_ISO = "BGD";
/** Incident country names → the map file's names, where they differ. */
const COUNTRY_ALIASES: Record<string, string> = {
  "DR Congo": "Democratic Republic of the Congo",
  "Congo (DRC)": "Democratic Republic of the Congo",
  "CAR": "Central African Republic",
  "USA": "United States of America",
};

/**
 * Equirectangular world map (Natural Earth, public domain) with one pin per
 * incident. The SVG is loaded inline so countries can be styled: countries
 * with an incident on the active tab get a soft tint. Pins are real buttons;
 * the list next to the map is the accessible equivalent, so the map artwork
 * itself is decorative.
 */
const IncidentMap = ({
  incidents,
  category,
  selectedId,
  label,
  pendingText,
  pinLabel,
  onSelect,
}: IncidentMapProps) => {
  const color = PIN_COLOR[category];
  const svgHostRef = useRef<HTMLDivElement>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [svgFailed, setSvgFailed] = useState(false);
  const showPlaceholder = !WORLD_MAP.available || svgFailed;

  /* Load the world SVG inline (our own static file) so countries can be styled. */
  useEffect(() => {
    if (!WORLD_MAP.available) return;
    let cancelled = false;
    fetch(WORLD_MAP.src)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => {
        if (!cancelled) setSvgMarkup(text);
      })
      .catch(() => {
        // Fall back to the placeholder grid; pins and list keep working.
        if (!cancelled) setSvgFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Base styling once the SVG is in the DOM. */
  useEffect(() => {
    const host = svgHostRef.current;
    if (!svgMarkup || !host) return;
    const svg = host.querySelector("svg");
    svg?.setAttribute("aria-hidden", "true");
    svg?.setAttribute("preserveAspectRatio", "none");
    host.querySelectorAll<SVGPathElement>("path").forEach((path) => {
      const home = path.dataset.iso === HOME_ISO;
      path.setAttribute("vector-effect", "non-scaling-stroke");
      path.setAttribute("stroke-width", home ? "1.5" : "0.75");
      path.setAttribute("stroke", home ? "rgb(213 181 70 / 0.9)" : LAND_STROKE);
      path.style.fill = LAND_FILL;
      path.style.transition = "fill 400ms ease";
    });
  }, [svgMarkup]);

  /* Tint the countries that contain an incident on the active tab. */
  useEffect(() => {
    const host = svgHostRef.current;
    const svg = host?.querySelector("svg");
    if (!svgMarkup || !host || !svg) return;
    const paths = Array.from(host.querySelectorAll<SVGPathElement>("path"));
    const hit = new Set<SVGPathElement>();
    incidents.forEach((incident) => {
      const { x, y } = projectLatLng(incident.lat, incident.lng);
      const point = new DOMPoint(x, y);
      // Coastal points can fall just offshore on the coarse 1:110m
      // coastline (e.g. Tyre, Lebanon), so fall back to the country name.
      const wanted = (
        COUNTRY_ALIASES[incident.country] ?? incident.country
      ).toLowerCase();
      const country =
        paths.find((p) => p.isPointInFill(point)) ??
        paths.find((p) => p.dataset.name?.toLowerCase() === wanted);
      if (country) hit.add(country);
    });
    const tint = INCIDENT_TINT[category];
    paths.forEach((p) => {
      p.style.fill = hit.has(p) ? tint : LAND_FILL;
    });
  }, [svgMarkup, incidents, category]);

  return (
    <div
      data-wi-map
      role="group"
      aria-label={label}
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-surface-deep"
      style={{ aspectRatio: `${WORLD_MAP.width} / ${WORLD_MAP.height}` }}
    >
      {svgMarkup ? (
        <>
          {/* Faint graticule behind the land, for a chart-table feel */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:calc(100%/12)_calc(100%/6)]"
          />
          <div
            ref={svgHostRef}
            aria-hidden="true"
            className="absolute inset-0 [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </>
      ) : showPlaceholder ? (
        /* No map file (WORLD_MAP.available = false) or it failed to load.
           Placeholder: a subtle 30° graticule plus the equator. */
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:calc(100%/12)_calc(100%/6)]" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-accent/20" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--surface-deep)_100%)]" />
          <span className="absolute bottom-3 left-4 font-dmSans text-xs tracking-[0.14em] text-white/60 uppercase">
            {pendingText}
          </span>
        </div>
      ) : null}

      {incidents.map((incident) => {
        const { x, y } = projectLatLng(incident.lat, incident.lng);
        const selected = incident.id === selectedId;
        return (
          <button
            key={incident.id}
            type="button"
            data-wi-pin={incident.id}
            aria-label={pinLabel(incident)}
            aria-pressed={selected}
            onClick={(e) => onSelect(incident, e)}
            {...pressFeedback}
            data-cursor="hide"
            className={cn(
              // 44×44 invisible hit area around the dot.
              "absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
              "touch-manipulation select-none",
              selected ? "z-20" : "z-10",
              focusRingDark,
            )}
            style={{
              left: `${(x / WORLD_MAP.width) * 100}%`,
              top: `${(y / WORLD_MAP.height) * 100}%`,
            }}
          >
            <span
              data-wi-pulse
              aria-hidden="true"
              className="absolute h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {incident.bangladeshContingentInvolved && (
              /* Bangladesh contingent marker: a white ring around the dot */
              <span
                aria-hidden="true"
                className="absolute h-6 w-6 rounded-full border-2 border-white/90"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative rounded-full border-2 border-surface-deep transition-[width,height,box-shadow] duration-200",
                selected
                  ? "h-5 w-5 shadow-[0_0_0_4px_rgb(255_255_255/0.85)]"
                  : "h-3.5 w-3.5",
              )}
              style={{ backgroundColor: color }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default IncidentMap;
