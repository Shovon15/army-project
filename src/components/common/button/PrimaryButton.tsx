"use client";

import React from "react";
import { cn } from "@/utils/helpers/cn";
import ButtonComponent, { BaseButtonProps } from ".";
import ArrowUpRightIcon from "@/assets/icons/ArrowUpRightIcon";

type Variant = "primary" | "dark" | "light" | "outline";
type Size = "sm" | "md" | "lg";

type Props = BaseButtonProps & {
  /** Classes for the outer wrapper (layout: width, display, margins). */
  className?: string;
  /** Classes for the button itself (padding, font, colours). */
  innerClassName?: string;
  variant?: Variant;
  size?: Size;
  /**
   * Trailing arrow. `true`/"inline" = small ↗ next to the label,
   * "circle" = arrow inside a round chip.
   */
  arrow?: boolean | "inline" | "circle";
};

const EASE = "ease-[cubic-bezier(.7,0,.2,1)]";
/* Soft ease-out so the arrow glides into its 50° turn instead of snapping. */
const ARROW_EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

const VARIANTS: Record<
  Variant,
  { base: string; fill: string; hoverText: string; chip: string }
> = {
  primary: {
    base: "bg-primary text-white",
    fill: "bg-white",
    hoverText: "group-hover:text-ink",
    chip: "bg-white text-primary group-hover:bg-primary group-hover:text-white",
  },
  /* Red at rest, black on hover (ring keeps the shape visible on dark bgs). */
  dark: {
    base: "bg-primary text-white ring-1 ring-transparent transition-shadow hover:ring-white/15",
    fill: "bg-surface-dark",
    hoverText: "group-hover:text-white",
    chip: "bg-white text-primary group-hover:bg-primary group-hover:text-white",
  },
  light: {
    base: "bg-white text-ink",
    fill: "bg-primary",
    hoverText: "group-hover:text-white",
    chip: "bg-primary text-white group-hover:bg-white group-hover:text-primary",
  },
  outline: {
    base: "bg-transparent text-white border border-white/25",
    fill: "bg-white",
    hoverText: "group-hover:text-ink",
    chip: "bg-white/10 text-white group-hover:bg-primary",
  },
};

const SIZES: Record<Size, { inline: string; circle: string; chip: string }> = {
  sm: {
    inline: "h-10 px-5 text-sm",
    circle: "h-10 pl-5 pr-1 text-sm",
    chip: "h-8 w-8",
  },
  md: {
    inline: "h-[50px] px-6 text-[15px] lg:h-[52px] lg:px-7 lg:text-base",
    circle: "h-[46px] pl-6 pr-1.5 text-sm lg:h-[52px]",
    chip: "h-9 w-9 lg:h-10 lg:w-10",
  },
  lg: {
    inline: "h-14 px-8 text-base lg:h-[60px] lg:text-lg",
    circle: "h-14 pl-8 pr-2 text-base lg:h-[60px]",
    chip: "h-11 w-11",
  },
};

/**
 * Puts the ripple's centre where the pointer crossed the button edge, sized so
 * the circle covers the whole button from that point. Called on enter (ripple
 * grows from the entry side) and on leave (it shrinks back toward the exit).
 */
const placeRipple = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
  el.style.setProperty("--rx", `${x}px`);
  el.style.setProperty("--ry", `${y}px`);
  el.style.setProperty("--rd", `${d}px`);
};

/**
 * The site's global pill button.
 *
 * - `href` renders a link, otherwise a <button> (or <span> via `as="span"`).
 * - Hover: a fill ripples out from the side the pointer entered, the label
 *   rolls up and the arrow turns 180°. The cursor dot hides over it
 *   (`data-cursor="hide"`, see CustomCursor).
 */
const PrimaryButton = ({
  className,
  innerClassName,
  variant = "primary",
  size = "md",
  arrow = false,
  children,
  ...props
}: Props) => {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const arrowMode = arrow === true ? "inline" : arrow;

  return (
    <span
      data-cursor="hide"
      onPointerEnter={placeRipple}
      onPointerLeave={placeRipple}
      className={cn("inline-flex", className)}
    >
      <ButtonComponent
        {...props}
        className={cn(
          "group relative isolate w-full overflow-hidden rounded-full font-dmSans font-semibold capitalize",
          "transition-[transform,box-shadow] duration-300",
          "hover:shadow-[0_14px_40px_-12px_rgb(var(--primary-rgb)/0.65)]",
          v.base,
          arrowMode === "circle" ? s.circle : s.inline,
          "gap-3",
          innerClassName,
        )}
      >
        {/* Ripple fill: grows from the entry point, shrinks toward the exit */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-[var(--ry,50%)] left-[var(--rx,0px)] -z-10 h-[var(--rd,300%)] w-[var(--rd,300%)] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-[650ms] group-hover:scale-100",
            EASE,
            v.fill,
          )}
        />

        {/* Rolling label */}
        <span
          className={cn(
            "relative block overflow-hidden transition-colors duration-500",
            v.hoverText,
          )}
        >
          <span
            className={cn(
              "block transition-transform duration-500 group-hover:-translate-y-full",
              EASE,
            )}
          >
            {children}
          </span>
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0",
              EASE,
            )}
          >
            {children}
          </span>
        </span>

        {arrowMode === "inline" && (
          <ArrowUpRightIcon
            className={cn(
              "h-5 w-5 shrink-0 transition-[rotate,color] duration-700 group-hover:rotate-50",
              ARROW_EASE,
              v.hoverText,
            )}
          />
        )}

        {arrowMode === "circle" && (
          <span
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-full transition-colors duration-500",
              s.chip,
              v.chip,
            )}
          >
            <ArrowUpRightIcon
              className={cn(
                "h-5 w-5 transition-[rotate] duration-700 group-hover:rotate-50",
                ARROW_EASE,
              )}
            />
          </span>
        )}
      </ButtonComponent>
    </span>
  );
};

export default PrimaryButton;
