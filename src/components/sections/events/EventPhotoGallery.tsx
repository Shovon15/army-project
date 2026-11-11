"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import ImageShine from "@/components/common/image/ImageShine";
import { Lightbox } from "@/components/sections/gallery/ImageGallery";
import type { GalleryImage } from "@/lib/gallery/gallery";

/** Captioned photo grid for an event; each photo opens the full-screen lightbox. */
const EventPhotoGallery = ({ images }: { images: GalleryImage[] }) => {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => lastTrigger.current?.focus());
  }, []);

  return (
    <>
      <ul data-cursor="hide" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((img, i) => (
          <li key={i}>
            <figure>
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                aria-label={`Open photo ${i + 1}: ${img.caption}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[16px] focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:outline-none"
              >
                <ImageShine className="aspect-[4/3] rounded-[16px]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 640px) 40vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                  />
                </ImageShine>
                <span className="pointer-events-none absolute inset-0 z-[3] bg-surface-dark/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute top-1/2 left-1/2 z-[4] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-focus-visible:scale-100">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <figcaption className="mt-3 font-dmSans text-[14px] leading-snug text-ink-muted">
                {img.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox images={images} index={open} onClose={close} onIndex={setOpen} />
      )}
    </>
  );
};

export default EventPhotoGallery;
