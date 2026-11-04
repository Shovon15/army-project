"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DEFAULT_FONT_ID,
  FONT_PRESETS,
  FONT_STORAGE_KEY,
} from "@/config/fonts";
import { cn } from "@/utils/helpers/cn";

const CHANGE_EVENT = "museon:fontchange";

// Panel sections, in the order they first appear in FONT_PRESETS.
const GROUPS = [...new Set(FONT_PRESETS.map((p) => p.group))];

// The active preset lives on <html data-font>, so read it from there.
const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
};
const getSnapshot = () =>
  document.documentElement.dataset.font || DEFAULT_FONT_ID;
const getServerSnapshot = () => DEFAULT_FONT_ID;

const applyFont = (id: string) => {
  document.documentElement.dataset.font = id;
  try {
    localStorage.setItem(FONT_STORAGE_KEY, id);
  } catch {
    // Storage blocked (private mode etc.): the choice just isn't remembered.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  // Text reflows with the new font: re-measure scroll animations once loaded.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
};

/**
 * Floating bottom-left button that opens a list of font presets
 * (src/config/fonts.ts). Picking one restyles the whole site instantly.
 */
const FontSwitcher = () => {
  const active = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [open, setOpen] = useState(false);
  // The panel is only mounted after the first open, so the non-default fonts
  // (used by its previews) aren't downloaded until someone wants them.
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const toggle = () => {
    setMounted(true);
    setOpen((v) => !v);
  };

  // Close on outside click and Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 left-4 z-40 md:bottom-6 md:left-6"
    >
      {mounted && (
        <div
          id={panelId}
          role="group"
          aria-label="Font style"
          inert={!open}
          className={cn(
            "absolute bottom-[calc(100%+12px)] left-0 w-[min(300px,calc(100vw-32px))] origin-bottom-left rounded-[20px] border border-white/10 bg-ink/95 p-3 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[opacity,scale,translate] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
            open
              ? "visible scale-100 opacity-100"
              : "invisible translate-y-2 scale-95 opacity-0",
          )}
        >
          <p className="px-2 pt-1 pb-2 font-dmSans text-[12px] font-semibold tracking-[0.14em] text-white/60 uppercase">
            Choose font style
          </p>
          {/* Scrolls inside; data-lenis-prevent keeps smooth-scroll off it. */}
          <div
            data-lenis-prevent
            className="-mr-1.5 max-h-[min(60vh,520px)] overflow-y-auto overscroll-contain pr-1.5 [scrollbar-width:thin]"
          >
            {GROUPS.map((group) => (
              <div key={group} className="mb-2 last:mb-0">
                <p className="px-2 pt-2 pb-1.5 font-dmSans text-[11px] tracking-[0.12em] text-accent uppercase">
                  {group}
                </p>
                <ul className="space-y-1">
                  {FONT_PRESETS.filter((p) => p.group === group).map(
                    (preset) => {
                      const isActive = preset.id === active;
                      return (
                        <li key={preset.id}>
                          <button
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => applyFont(preset.id)}
                            className={cn(
                              "group flex w-full items-center gap-4 rounded-[14px] border px-3 py-2.5 text-left transition-colors duration-300",
                              isActive
                                ? "border-primary bg-primary/15"
                                : "border-transparent hover:border-white/15 hover:bg-white/[0.06]",
                            )}
                          >
                            {/* Preview in the preset's own fonts */}
                            <span
                              aria-hidden
                              className={cn(
                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] text-[22px] leading-none transition-colors duration-300",
                                isActive
                                  ? "bg-primary text-white"
                                  : "bg-white/10 group-hover:bg-white/15",
                              )}
                              style={{
                                fontFamily: preset.heading.family,
                                fontWeight: preset.heading.weight,
                              }}
                            >
                              Aa
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className="block truncate text-[15px] leading-tight uppercase"
                                style={{
                                  fontFamily: preset.heading.family,
                                  fontWeight: preset.heading.weight,
                                  letterSpacing: preset.heading.tracking,
                                }}
                              >
                                {preset.label}
                              </span>
                              <span
                                className="mt-1 block truncate text-[13px] text-white/60"
                                style={{ fontFamily: preset.ui }}
                              >
                                {preset.description}
                              </span>
                            </span>
                            <span
                              aria-hidden
                              className={cn(
                                "h-2.5 w-2.5 shrink-0 rounded-full transition-[scale,background-color] duration-300",
                                isActive
                                  ? "scale-100 bg-primary"
                                  : "scale-0 bg-white/40",
                              )}
                            />
                          </button>
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hamburger ↔ close */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={mounted ? panelId : undefined}
        aria-label={open ? "Close font options" : "Change font"}
        title="Change font"
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_15px_35px_-12px_rgba(0,0,0,0.55)] transition-colors duration-300 md:h-[52px] md:w-[52px]",
          open
            ? "border-primary bg-primary text-white"
            : "border-white/15 bg-surface-dark text-white hover:border-primary hover:bg-primary",
        )}
      >
        <span aria-hidden className="relative block h-3.5 w-5">
          <span
            className={cn(
              "absolute left-0 h-0.5 w-full rounded-full bg-current transition-[top,rotate] duration-300",
              open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
            )}
          />
          <span
            className={cn(
              "absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-[opacity,scale] duration-300",
              open ? "scale-x-0 opacity-0" : "opacity-100",
            )}
          />
          <span
            className={cn(
              "absolute left-0 h-0.5 w-full rounded-full bg-current transition-[top,bottom,rotate] duration-300",
              open
                ? "top-1/2 -translate-y-1/2 -rotate-45"
                : "top-[calc(100%-2px)]",
            )}
          />
        </span>
      </button>
    </div>
  );
};

export default FontSwitcher;
