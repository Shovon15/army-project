"use client";

import { useRef } from "react";
import type { KeyboardEvent, PointerEvent, RefObject } from "react";
import gsap from "gsap";
import type { Era } from "@/lib/home/evolution";
import { cn } from "@/utils/helpers/cn";
import EraCard from "./EraCard";
import { eraTone } from "./motion";

type TimelineRailProps = {
  eras: Era[];
  railRef: RefObject<HTMLUListElement | null>;
  label: string;
  readMore: string;
  activeIndex: number;
  formatIndex: (index: number) => string;
  onOpen: (index: number) => void;
  onKeyDown: (e: KeyboardEvent<HTMLUListElement>) => void;
  /** Called after a mouse drag so the rail can settle on the nearest card. */
  onDragEnd: () => void;
};

/** Pixels the mouse has to move before a press becomes a drag. */
const DRAG_THRESHOLD = 6;

/**
 * Native horizontal scroller with CSS scroll-snap (touch swipes stay native).
 * Mouse users can also drag it; Draggable/InertiaPlugin aren't registered in
 * this project, so this is a small pointer-drag-to-scroll instead.
 *
 * The thin line is drawn as one segment per era (node i → node i+1), so each
 * segment can carry its own part of the sepia → accent gradient.
 */
const TimelineRail = ({
  eras,
  railRef,
  label,
  readMore,
  activeIndex,
  formatIndex,
  onOpen,
  onKeyDown,
  onDragEnd,
}: TimelineRailProps) => {
  const drag = useRef<{
    x: number;
    left: number;
    id: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const count = eras.length;

  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const rail = e.currentTarget;
    drag.current = {
      x: e.clientX,
      left: rail.scrollLeft,
      id: e.pointerId,
      moved: false,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d) return;
    const rail = e.currentTarget;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      d.moved = true;
      // Capture only once it's a real drag, so plain clicks still reach cards.
      rail.setPointerCapture(d.id);
      rail.style.scrollSnapType = "none";
      rail.style.cursor = "grabbing";
      gsap.killTweensOf(rail);
      gsap.to(rail.querySelectorAll("[data-ev-card]"), {
        scale: 1,
        duration: 0.15,
        overwrite: "auto",
      });
    }
    rail.scrollLeft = d.left - dx;
  };

  const endDrag = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    const rail = e.currentTarget;
    if (rail.hasPointerCapture(d.id)) rail.releasePointerCapture(d.id);
    rail.style.cursor = "";
    // Swallow the click that follows the drag, then re-arm.
    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    onDragEnd();
  };

  return (
    <ul
      ref={railRef}
      role="list"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        if (!suppressClick.current) return;
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn(
        "relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
        // Card width: ~80vw on mobile, 360px from md. Padding lets the first
        // and last card reach the centre, so both neighbours always peek in.
        "[--ev-card:80vw] [--ev-gap:1.25rem] md:[--ev-card:360px] md:[--ev-gap:1.75rem]",
        "gap-[var(--ev-gap)] px-[calc(50%-var(--ev-card)/2)] pt-2 pb-8",
        // Scrollbar hidden visually, still scrollable.
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "md:cursor-grab",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent",
      )}
    >
      {eras.map((era, i) => {
        const active = i === activeIndex;
        return (
          <li
            key={era.id}
            data-ev-item
            data-index={i}
            className="relative flex w-[var(--ev-card)] shrink-0 snap-center flex-col"
          >
            {/* Line + node */}
            <div aria-hidden="true" className="relative h-14 shrink-0">
              {i < count - 1 && (
                <span
                  data-ev-seg
                  className="absolute top-1/2 left-1/2 h-0.5 w-[calc(100%+var(--ev-gap))] -translate-y-1/2 origin-left"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${eraTone(i, count)}, ${eraTone(i + 1, count)})`,
                  }}
                />
              )}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span
                  data-ev-node
                  className={cn(
                    "block h-5 w-5 rounded-full border-2 transition-[background-color,box-shadow] duration-300",
                    active
                      ? "shadow-[0_0_0_6px_rgb(var(--accent-rgb)/0.18)]"
                      : "bg-surface-light",
                  )}
                  style={{
                    borderColor: eraTone(i, count),
                    backgroundColor: active ? eraTone(i, count) : undefined,
                  }}
                />
              </span>
              {/* Short connector from the node down to the card */}
              <span
                className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 opacity-50"
                style={{ backgroundColor: eraTone(i, count) }}
              />
            </div>

            <div data-ev-enter className="flex flex-1">
              <div data-ev-focus className="flex w-full">
                <EraCard
                  era={era}
                  index={i}
                  number={formatIndex(i)}
                  readMore={readMore}
                  onOpen={onOpen}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TimelineRail;
