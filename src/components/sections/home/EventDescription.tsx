"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/utils/helpers/cn";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";

/**
 * Event description clamped to two lines, with a round arrow button that
 * expands / shrinks it. The arrow only shows when the text actually overflows.
 */
const EventDescription = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const id = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      if (open) return;
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, text]);

  return (
    <div className="mt-3 flex items-start gap-3">
      <p
        id={id}
        ref={ref}
        className={cn(
          "flex-1 overflow-hidden font-dmSans text-[15px] leading-text text-ink-muted transition-[max-height] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          open ? "max-h-[20lh]" : "line-clamp-2 max-h-[2lh]",
        )}
      >
        {text}
      </p>

      {(overflows || open) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          aria-label={open ? "Show less" : "Show full description"}
          className="mt-0.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/10 text-ink transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none [&_path]:stroke-current"
        >
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
              open && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
};

export default EventDescription;
