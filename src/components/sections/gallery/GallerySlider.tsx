"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css/effect-coverflow";
import ImageComponent from "@/components/common/image";
import SectionHeading from "@/components/common/typography/SectionHeading";
import SliderArrowIcon from "@/assets/icons/SliderArrowIcon";
import { cn } from "@/utils/helpers/cn";
import type { GalleryMedia } from "@/lib/gallery/gallery";
import { galleryContent } from "@/lib/gallery/galleryContent";
import { Lightbox, type LightboxItem } from "./ImageGallery";

const copy = galleryContent.en;

/** Slider items as lightbox entries (videos use their poster as the thumbnail). */
const toLightboxItems = (items: GalleryMedia[]): LightboxItem[] =>
  items.map((item, i) => {
    const caption = item.caption ?? item.alt ?? `Item ${i + 1}`;
    return item.type === "video"
      ? { src: item.poster ?? "", alt: item.alt, caption, videoSrc: item.src }
      : { src: item.src, alt: item.alt, caption };
  });

type Props = {
  items: GalleryMedia[];
  autoplay?: boolean;
  badge?: string;
  titleLines?: string[];
  /** One line under the heading. */
  intro?: string;
  /** Set on the section so header links like "/#gallery" can scroll to it. */
  id?: string;
};

type CardSize = { width: number; height: number; radius: number };

// Active (centre) and inactive card sizes per breakpoint.
const CARD_SIZES: Record<string, { active: CardSize; inactive: CardSize }> = {
  mobile: {
    active: { width: 259, height: 390, radius: 10 },
    inactive: { width: 191, height: 340, radius: 6.4 },
  },
  lg: {
    active: { width: 450, height: 350, radius: 10 },
    inactive: { width: 170, height: 300, radius: 6.4 },
  },
  xl: {
    active: { width: 470, height: 390, radius: 10 },
    inactive: { width: 180, height: 340, radius: 6.4 },
  },
  "2xl": {
    active: { width: 519, height: 390, radius: 10 },
    inactive: { width: 191, height: 340, radius: 6.4 },
  },
};

const sizeKeyFor = (w: number) =>
  w >= 1536 ? "2xl" : w >= 1280 ? "xl" : w >= 1024 ? "lg" : "mobile";

/** Breakpoint key that follows window resizes ("lg" during SSR). */
const useCardSizeKey = () => {
  const [key, setKey] = useState("lg");
  useEffect(() => {
    const update = () => setKey(sizeKeyFor(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return key;
};

const EASE = "cubic-bezier(0.22,1,0.36,1)";

/** Video plays only while its slide is the active one; otherwise shows the poster. */
const SlideVideo = ({
  item,
  isActive,
}: {
  item: Extract<GalleryMedia, { type: "video" }>;
  isActive: boolean;
}) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const poster =
    typeof item.poster === "string" ? item.poster : item.poster?.src;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (isActive) video.play().catch(() => {});
    else video.pause();
  }, [isActive]);

  return (
    <div className="relative h-full w-full">
      <video
        ref={ref}
        src={item.src}
        poster={poster}
        muted
        loop
        playsInline
        preload={isActive ? "auto" : "none"}
        aria-label={item.alt}
        title={item.caption ?? item.alt}
        className="block h-full w-full object-cover"
      />
      {/* Play badge so a paused video reads as a video, not a photo. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg transition-opacity duration-500",
          isActive ? "opacity-0" : "opacity-100",
        )}
      >
        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
  );
};

const ArrowButton = ({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) => (
  <div
    className={cn(
      "pointer-events-none absolute top-0 z-10 hidden h-full w-fit items-center lg:flex xl:w-[12%] 2xl:w-[18%]",
      dir === "prev"
        ? "left-0 justify-end bg-gradient-to-l from-surface-light/60 to-surface-light"
        : "right-0 justify-start bg-gradient-to-r from-surface-light/60 to-surface-light",
    )}
  >
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary bg-white p-3 text-primary shadow transition-colors duration-300 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <SliderArrowIcon className={dir === "next" ? "rotate-180" : undefined} />
    </button>
  </div>
);

const GallerySlider = ({
  items,
  autoplay = true,
  badge = copy.eyebrow,
  titleLines = copy.titleLines,
  intro = copy.intro,
  id = "gallery",
}: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { active, inactive } = CARD_SIZES[useCardSizeKey()];
  const lightboxItems = useMemo(() => toLightboxItems(items), [items]);
  const [open, setOpen] = useState<number | null>(null);

  // Pause autoplay while the viewer is open; resume when it closes.
  const openAt = useCallback((i: number) => {
    swiperRef.current?.autoplay?.stop();
    setOpen(i);
  }, []);
  const close = useCallback(() => {
    setOpen(null);
    if (autoplay) swiperRef.current?.autoplay?.start();
  }, [autoplay]);

  // Each slide reserves the midpoint of the two widths, so the wide active card
  // overlaps into the gap instead of leaving empty space around small cards.
  const slideWidth = Math.round((active.width + inactive.width) / 2);

  // Loop mode needs plenty of slides; repeat short lists to at least 11.
  const MIN_SLIDES = 11;
  const slides =
    items.length === 0 || items.length >= MIN_SLIDES
      ? items
      : Array.from({ length: MIN_SLIDES }, (_, i) => items[i % items.length]);

  return (
    <section
      id={id}
      className="relative isolate w-full overflow-hidden bg-surface-light py-20 text-ink md:py-28"
    >
      <SectionHeading badge={badge} lines={titleLines} tone="light" />
      {intro && (
        <p className="mx-auto mt-4 max-w-[720px] px-4 text-center font-dmSans text-base leading-text text-ink-muted md:text-lg">
          {intro}
        </p>
      )}

      <div data-cursor="hide" className="relative mt-10 h-[470px] md:mt-14 lg:px-[5vw] xl:px-[8vw] 2xl:px-[10vw]">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Pagination, EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          watchSlidesProgress
          speed={700}
          autoplay={
            autoplay
              ? {
                  delay: 3500,
                  disableOnInteraction: false,
                  // Don't wait for a CSS transitionend before resuming: the
                  // instant (no-animation) re-layout on mount never fires one,
                  // which left autoplay paused until the first manual swipe.
                  waitForTransition: false,
                }
              : false
          }
          coverflowEffect={{
            rotate: 0,
            stretch: -70,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          // Swiper only fires onClick for taps, not drags.
          onClick={(swiper) => {
            const i = Number(
              (swiper.clickedSlide as HTMLElement | undefined)?.dataset.index,
            );
            if (!Number.isNaN(i)) openAt(i % items.length);
          }}
          className="gallery-coverflow !h-full !pb-[50px]"
        >
          {slides.map((item, index) => (
            <SwiperSlide
              key={index}
              data-index={index}
              style={{ width: slideWidth }}
              className="group/slide !flex !h-full cursor-zoom-in items-center justify-center select-none"
            >
              {({ isActive }) => {
                const size = isActive ? active : inactive;
                return (
                  <div
                    className="relative shrink-0 overflow-hidden"
                    style={{
                      width: size.width,
                      height: size.height,
                      borderRadius: size.radius,
                      transition: `width 700ms ${EASE}, height 700ms ${EASE}, border-radius 700ms ease`,
                    }}
                  >
                    {item.type === "video" ? (
                      <SlideVideo item={item} isActive={isActive && open === null} />
                    ) : (
                      <ImageComponent
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1536px) 519px, (min-width: 1024px) 470px, 259px"
                        className="object-cover"
                      />
                    )}

                    {/* Expand hint on the centre slide */}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute top-3 right-3 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-[opacity,transform] duration-500",
                        isActive
                          ? "scale-90 opacity-0 group-hover/slide:scale-100 group-hover/slide:opacity-100"
                          : "opacity-0",
                      )}
                    >
                      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </span>

                    {/* Real tap/keyboard target over the slide. Only the
                        centre slide is in the tab order, so focus never
                        scrolls hidden slides into the clipped track. Taps
                        also reach Swiper's onClick (same index, harmless);
                        Swiper swallows the click after a drag. A pointer
                        press must not focus it: Swiper refuses to drag
                        when the press starts on the focused element. */}
                    <button
                      type="button"
                      tabIndex={isActive ? 0 : -1}
                      onMouseDown={(e) => e.preventDefault()}
                      aria-label={`${copy.openItem}: ${item.caption ?? item.alt}`}
                      onClick={() => openAt(index % items.length)}
                      className="absolute inset-0 z-[3] min-h-14 cursor-zoom-in focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent"
                      style={{ borderRadius: size.radius }}
                    />

                    {item.caption && (
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-10 pb-4 font-dmSans text-white text-base font-medium transition-opacity duration-500",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      >
                        {item.caption}
                      </div>
                    )}
                  </div>
                );
              }}
            </SwiperSlide>
          ))}
        </Swiper>

        <ArrowButton
          dir="prev"
          onClick={() => swiperRef.current?.slidePrev()}
        />
        <ArrowButton
          dir="next"
          onClick={() => swiperRef.current?.slideNext()}
        />
      </div>

      {/* Keyboard users: open the viewer without clicking a slide */}
      {items.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="sr-only focus:not-sr-only focus:inline-flex focus:min-h-14 focus:items-center focus:rounded-full focus:bg-primary focus:px-6 focus:font-dmSans focus:text-white focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2"
          >
            {copy.openViewer}
          </button>
        </div>
      )}

      {open !== null && (
        <Lightbox
          images={lightboxItems}
          index={open}
          onClose={close}
          onIndex={setOpen}
        />
      )}
    </section>
  );
};

export default GallerySlider;
