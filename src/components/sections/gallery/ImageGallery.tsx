"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import type Lenis from "lenis";
import ContentContainer from "@/components/layout/container/contentContainer";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { cn } from "@/utils/helpers/cn";
import type { GalleryImage } from "@/lib/gallery/gallery";

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

// Repeating tall / square / wide rhythm so the masonry columns interlock.
const RATIOS = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[5/6]",
];

const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d={d} />
  </svg>
);

const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/* ------------------------------ Lightbox ------------------------------ */

const Lightbox = ({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const img = images[index];
  const go = useCallback(
    (step: number) => onIndex((index + step + count) % count),
    [index, count, onIndex],
  );

  // Lock page scroll (Lenis + native) and move focus into the dialog.
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const navBtn =
    "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-colors duration-300 hover:border-primary hover:bg-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none md:h-14 md:w-14";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${count}: ${img.caption}`}
      data-lenis-prevent
      className="gallery-lightbox fixed inset-0 z-[100] flex flex-col bg-surface-deep/95 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 text-white md:px-8 md:py-6">
        <p className="font-dmSans text-[14px] tracking-[0.12em] text-white/70 tabular-nums">
          <span className="text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>{" "}
          / {String(count).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className={navBtn}
        >
          <Icon d="M18 6 6 18M6 6l12 12" className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative mx-auto flex w-full min-h-0 flex-1 items-center justify-center px-4 md:px-24"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          key={index}
          className="gallery-lightbox-img relative h-full w-full max-w-[1200px]"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className={cn(
            navBtn,
            "absolute top-1/2 left-3 -translate-y-1/2 md:left-8",
          )}
        >
          <Icon d="M15 18l-6-6 6-6" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className={cn(
            navBtn,
            "absolute top-1/2 right-3 -translate-y-1/2 md:right-8",
          )}
        >
          <Icon d="M9 18l6-6-6-6" className="h-5 w-5" />
        </button>
      </div>

      {/* Caption + thumbnails */}
      <div className="px-4 pt-4 pb-5 text-center md:pb-7">
        <p className="font-heading text-[clamp(1rem,1.3vw,1.25rem)] text-white uppercase">
          {img.caption}
        </p>
        <ul className="mx-auto mt-4 flex max-w-full justify-start gap-2 overflow-x-auto pb-1 md:justify-center">
          {images.map((t, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`Show image ${i + 1}: ${t.caption}`}
                aria-current={i === index || undefined}
                className={cn(
                  "relative block h-12 w-16 cursor-pointer overflow-hidden rounded-lg transition-[opacity,box-shadow] duration-300 md:h-14 md:w-20",
                  i === index
                    ? "opacity-100 ring-2 ring-accent"
                    : "opacity-45 hover:opacity-80",
                )}
              >
                <Image
                  src={t.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
};

/* ------------------------------ Grid ------------------------------ */

/** Masonry photo grid; each photo opens a full-screen lightbox. */
const ImageGallery = ({
  images,
  theme = "light",
}: {
  images: GalleryImage[];
  theme?: "light" | "dark";
}) => {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    // Return focus to the photo that opened the lightbox.
    requestAnimationFrame(() => lastTrigger.current?.focus());
  }, []);

  return (
    <section
      id="gallery"
      className={cn(
        "relative bg-surface-light py-16 text-ink md:py-24",
        theme === "dark" && "bg-surface-dark text-white",
      )}
    >
      <ContentContainer size="narrow" className="h-auto">
        <Reveal
          once
          className="columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-[30px]"
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Open image: ${img.caption}`}
              className="group relative mb-5 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-[20px] text-left focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:outline-none lg:mb-[30px]"
            >
              <div
                className={cn(
                  "reveal-clip relative overflow-hidden rounded-[20px]",
                  RATIOS[i % RATIOS.length],
                )}
                style={
                  {
                    ...delay(0.1 + (i % 3) * 0.12),
                    "--clip-r": "20px",
                  } as CSSProperties
                }
              >
                <ImageShine className="absolute inset-0">
                  <div
                    className="reveal-zoom absolute inset-0"
                    style={delay(0.1 + (i % 3) * 0.12)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                    />
                  </div>
                </ImageShine>

                {/* Hover: navy wash, zoom icon, caption slides up */}
                <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-surface-dark/90 via-surface-dark/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="pointer-events-none absolute top-1/2 left-1/2 z-[4] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-focus-visible:scale-100">
                  <Icon d="M12 5v14M5 12h14" className="h-6 w-6" />
                </span>
                <p className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] translate-y-4 px-6 pb-6 font-heading text-[clamp(0.95rem,1.1vw,1.15rem)] text-white uppercase opacity-0 transition-[opacity,translate] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {img.caption}
                </p>
              </div>
            </button>
          ))}
        </Reveal>
      </ContentContainer>

      {open !== null && (
        <Lightbox
          images={images}
          index={open}
          onClose={close}
          onIndex={setOpen}
        />
      )}
    </section>
  );
};

export default ImageGallery;
