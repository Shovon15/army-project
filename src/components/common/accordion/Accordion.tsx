"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SafeHtml from "../safeHtml";

gsap.registerPlugin(useGSAP);

type Props = {
  items: IFaqItem[];
  defaultOpenFirst?: boolean;
  tag?: "h2" | "h3" | "h4";
  /** 2 = masonry columns on desktop, 1 = single stacked list. */
  columns?: 1 | 2;
};

export function Accordion({
  items,
  defaultOpenFirst = true,
  tag = "h2",
  columns = 2,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    defaultOpenFirst ? 0 : null,
  );

  return (
    <div
      className={columns === 2 ? "columns-1 lg:columns-2 gap-3 w-full" : "w-full"}
    >
      {items.map((item, index) => (
        <FaqRow
          key={index}
          item={item}
          active={activeIndex === index}
          tag={tag}
          onToggle={() =>
            setActiveIndex((prev) => (prev === index ? null : index))
          }
        />
      ))}
    </div>
  );
}

function FaqRow({
  item,
  active,
  onToggle,
  tag = "h2",
}: {
  item: IFaqItem;
  active: boolean;
  onToggle: () => void;
  tag?: "h2" | "h3" | "h4";
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLSpanElement>(null);
  const Tag = tag;

  // const { language } = useAppSelector((state) => state.language);

  // The first render already has the right open/closed state in its markup,
  // so tween only on toggles. Tweening every row on mount made GSAP read each
  // row's computed styles right after hydration: a forced layout per row.
  const [initiallyActive] = useState(active);
  const hasMountedRef = useRef(false);

  useGSAP(
    () => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }

      gsap.to(contentRef.current, {
        height: active ? "auto" : 0,
        opacity: active ? 1 : 0,
        marginTop: active ? "1rem" : 0,
        duration: 0.3,
        ease: "power2.inOut",
      });

      // Rotate the chevron to indicate the open state.
      gsap.to(iconWrapRef.current, {
        rotate: active ? 180 : 0,
        transformOrigin: "50% 50%",
        duration: 0.3,
        ease: "power2.inOut",
      });
    },
    { dependencies: [active] },
  );

  return (
    <div
      className={`break-inside-avoid mb-3 rounded-[16px] border bg-white px-5 py-4 transition-colors duration-300 lg:px-7 lg:py-6 ${active ? "border-primary/30" : "border-black/5"}`}
    >
      <button
        type="button"
        aria-expanded={active}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
      >
        <Tag
          className={`font-heading text-[15px] leading-title uppercase transition-colors duration-300 lg:text-[17px] ${active ? "text-primary" : "text-ink"}`}
        >
          {item.question}
        </Tag>

        <span
          ref={iconWrapRef}
          aria-hidden
          className={`relative ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full p-2 transition-colors duration-300 ${active ? "bg-primary text-white" : "bg-surface-light text-ink"}`}
          style={initiallyActive ? { transform: "rotate(180deg)" } : undefined}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 7L10 13L16 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        ref={contentRef}
        className={
          initiallyActive ? "mt-4 overflow-hidden" : "h-0 overflow-hidden opacity-0"
        }
      >
        <div className="font-dmSans text-[15px] leading-text text-ink-muted whitespace-pre-line">
          <SafeHtml content={item.answer} />
        </div>
      </div>
    </div>
  );
}
