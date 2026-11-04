"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image, { type StaticImageData } from "next/image";
import { QuoteIcon, StarIcon } from "@/assets/icons/MetaIcons";
import { revealItem } from "@/components/common/animations/revealItem";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** 1–5 */
  rating: number;
  avatar?: StaticImageData | string;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const Stars = ({ rating, className }: { rating: number; className?: string }) => (
  <span className={className} role="img" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={i < Math.round(rating) ? "h-4 w-4 text-[var(--primary)]" : "h-4 w-4 text-white/20"}
      />
    ))}
  </span>
);

const TestimonialCard = ({ item }: { item: Testimonial }) => (
  <figure className="group relative isolate flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#141414] p-7 transition-colors duration-500 hover:border-[var(--primary)]/50 md:p-9">
    {/* Red glow rises from the bottom on hover */}
    <span
      aria-hidden
      className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(230,31,37,0.28),transparent_70%)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100"
    />
    {/* Big faint quote mark drifts on hover */}
    <QuoteIcon className="absolute top-7 right-7 -z-10 h-20 w-20 text-white/[0.05] transition-[translate,rotate,color] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1 group-hover:-rotate-12 group-hover:text-[var(--primary)]/20" />

    <Stars rating={item.rating} className="flex gap-1" />
    <blockquote className="mt-6 flex-1 font-dmSans text-[17px] leading-[1.7] text-white/90">
      {item.quote}
    </blockquote>

    <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
      {item.avatar ? (
        <Image
          src={item.avatar}
          alt=""
          width={52}
          height={52}
          className="h-[52px] w-[52px] rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[#6b0f13] font-heading text-[15px] text-white transition-transform duration-500 group-hover:scale-110"
        >
          {initials(item.name)}
        </span>
      )}
      <span>
        <span className="block font-heading text-[15px] leading-[1.3] text-white uppercase">
          {item.name}
        </span>
        <span className="mt-1 block font-dmSans text-[14px] text-white/65">{item.role}</span>
      </span>
    </figcaption>
  </figure>
);

/** Looping, auto-playing testimonial carousel (1 / 2 / 3 cards per view). */
const TestimonialsSlider = ({ items }: { items: Testimonial[] }) => (
  <Swiper
    className="testimonial-swiper [&_.swiper-slide]:h-auto"
    modules={[Autoplay, Pagination]}
    loop={items.length > 3}
    speed={800}
    spaceBetween={30}
    slidesPerView={1}
    breakpoints={{ 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
    autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
    pagination={{ clickable: true }}
    grabCursor
  >
    {items.map((item, i) => (
      <SwiperSlide key={`${item.name}-${i}`}>
        {/* Cards slide in from the right, one after another */}
        <div className="h-full" {...revealItem("right", 90, 0.15 + (i % 3) * 0.15, 1.2)}>
          <TestimonialCard item={item} />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default TestimonialsSlider;
