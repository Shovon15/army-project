"use client";

import { useEffect, useEffectEvent, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";
import {
  WORLD_INCIDENT_IDLE_MS,
  type WorldIncident,
} from "@/lib/home/worldIncidents";
import { cn } from "@/utils/helpers/cn";
import { motionAllowed, pressFeedback } from "../evolution/motion";
import { PIN_COLOR, formatIncidentDate } from "./shared";

gsap.registerPlugin(useGSAP);

type DetailCopy = {
  close: string;
  location: string;
  date: string;
  casualties: string;
  source: string;
  bdContingent: string;
  imagePending: string;
};

type IncidentDetailProps = {
  incident: WorldIncident;
  copy: DetailCopy;
  dateLocale: string;
  /** Called after the close animation. */
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

const focusRingDrawer =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-surface-dark";

/**
 * Slide-in drawer for one incident. Closes on the close button, backdrop
 * tap, Esc, or after WORLD_INCIDENT_IDLE_MS without interaction.
 */
const IncidentDetail = ({
  incident,
  copy,
  dateLocale,
  onClose,
}: IncidentDetailProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const titleId = useId();

  /* ---------- Open: backdrop fades, drawer slides in from the right ---------- */
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      gsap
        .timeline()
        .fromTo(
          backdropRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25, ease: "power1.out" },
        )
        .fromTo(
          panelRef.current,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.45, ease: "power3.out" },
          "<",
        );
    },
    { scope: rootRef },
  );

  /* The close tween is created in an event handler (outside the useGSAP
     context), so the unmount cleanup below kills it explicitly. */
  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (!motionAllowed()) {
      onClose();
      return;
    }
    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, {
        xPercent: 100,
        duration: 0.35,
        ease: "power3.in",
      })
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.25 }, "-=0.2");
  };
  const closeEvent = useEffectEvent(close);

  useEffect(() => {
    const els = [backdropRef.current, panelRef.current];
    return () => gsap.killTweensOf(els);
  }, []);

  /* ---------- Lock page scroll (Lenis + native) and move focus in ---------- */
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  /* ---------- Keyboard: Esc closes, Tab stays inside the drawer ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeEvent();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (!current || !panel.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- Kiosk: auto-close after a period of no interaction ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let timer = 0;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => closeEvent(), WORLD_INCIDENT_IDLE_MS);
    };
    const events = ["pointerdown", "pointermove", "keydown", "wheel", "scroll"];
    events.forEach((ev) =>
      root.addEventListener(ev, reset, { capture: true, passive: true }),
    );
    reset();
    return () => {
      window.clearTimeout(timer);
      events.forEach((ev) =>
        root.removeEventListener(ev, reset, { capture: true }),
      );
    };
  }, []);

  const tag = incident.missionName
    ? `${incident.missionName} · ${incident.country}`
    : incident.country;

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop: tap to close */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 bg-surface-deep/85 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full flex-col border-l border-white/10 bg-surface-dark text-white shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.8)] md:max-w-[600px]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.55)_0_14px,transparent_14px_28px)]"
        />

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-3 md:px-7">
          <span className="inline-flex items-center gap-2 font-dmSans text-xs font-semibold tracking-[0.12em] text-accent uppercase">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PIN_COLOR[incident.category] }}
            />
            {tag}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={copy.close}
            {...pressFeedback}
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white touch-manipulation md:h-16 md:w-16",
              focusRingDrawer,
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body; data-lenis-prevent keeps smooth-scroll off it. */}
        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 md:p-7"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-surface-deep">
            {incident.image ? (
              <Image
                src={incident.image}
                alt={incident.title}
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgb(var(--accent-rgb)/0.05)_0_22px,transparent_22px_44px)]">
                <span className="font-dmSans text-sm text-white/70">
                  {copy.imagePending}
                </span>
              </div>
            )}
          </div>

          {incident.bangladeshContingentInvolved && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 font-dmSans text-xs font-semibold tracking-[0.12em] text-accent uppercase">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full border-2 border-white/90"
              />
              {copy.bdContingent}
            </p>
          )}

          <h2
            id={titleId}
            className="mt-5 font-boldCond text-[clamp(1.5rem,2.4vw,2.25rem)] leading-display uppercase"
          >
            {incident.title}
          </h2>

          <dl className="mt-5 grid grid-cols-1 gap-3 font-dmSans text-base sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-surface-deep/60 p-4">
              <dt className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                {copy.location}
              </dt>
              <dd className="mt-1 text-white">
                {incident.location}, {incident.country}
              </dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface-deep/60 p-4">
              <dt className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                {copy.date}
              </dt>
              <dd className="mt-1 text-white tabular-nums">
                <time dateTime={incident.date}>
                  {formatIncidentDate(incident.date, dateLocale, "long")}
                </time>
              </dd>
            </div>
            {incident.casualties && (
              <div className="rounded-xl border border-white/10 bg-surface-deep/60 p-4 sm:col-span-2">
                <dt className="text-xs font-semibold tracking-[0.12em] text-white/70 uppercase">
                  {copy.casualties}
                </dt>
                <dd className="mt-1 text-white">{incident.casualties}</dd>
              </div>
            )}
          </dl>

          <p className="mt-6 font-dmSans text-lg leading-text text-white/85">
            {incident.summary}
          </p>

          {incident.source && (
            <p className="mt-6 font-dmSans text-sm text-white/70">
              <span className="font-semibold text-white/85">
                {copy.source}:
              </span>{" "}
              {incident.source}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default IncidentDetail;
