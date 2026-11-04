import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionHeading from "@/components/common/typography/SectionHeading";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import NavLink from "@/components/common/link/NavLink";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import ArrowUpRightIcon from "@/assets/icons/ArrowUpRightIcon";
import { CalendarIcon, MapPinIcon } from "@/assets/icons/MetaIcons";

import eventImage1 from "@/assets/images/event-item-image-1.jpg";
import eventImage2 from "@/assets/images/event-item-image-2.jpg";
import eventImage3 from "@/assets/images/event-item-image-3.jpg";

export type MuseumEvent = {
  title: string;
  description: string;
  /** ISO date, e.g. "2026-03-15". */
  date: string;
  time: string;
  venue: string;
  href: string;
  image: StaticImageData | string;
};

type OurEventsProps = {
  badge?: string;
  titleLines?: string[];
  description?: string;
  cta?: { label: string; href: string };
  events?: MuseumEvent[];
};

const DEFAULT_EVENTS: MuseumEvent[] = [
  {
    title: "Art Through The Ages Exhibition",
    description: "A guided walk through five centuries of painting, from the Renaissance to the modern era.",
    date: "2026-03-15",
    time: "5:00 PM",
    venue: "Grand Heritage Gallery",
    href: "/events/art-through-the-ages",
    image: eventImage1,
  },
  {
    title: "Modern Artist Showcase",
    description: "Meet the artists behind our newest acquisitions and hear the stories behind their work.",
    date: "2026-06-12",
    time: "7:00 PM",
    venue: "Contemporary Art Wing",
    href: "/events/modern-artist-showcase",
    image: eventImage2,
  },
  {
    title: "Museum Guided Heritage Tour",
    description: "An expert-led tour of our heritage halls and the treasures they preserve.",
    date: "2026-11-25",
    time: "10:30 AM",
    venue: "Heritage Exhibition Hall",
    href: "/events/guided-heritage-tour",
    image: eventImage3,
  },
];

// UTC so the server and browser always print the same calendar day.
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  toDate(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

const EventCard = ({ event, index }: { event: MuseumEvent; index: number }) => {
  const d = 0.15 + index * 0.15;
  return (
    <div className="h-full" {...revealItem("down", 70, d, 1.2)}>
      <NavLink
        href={event.href}
        hover={false}
        ariaLabel={event.title}
        className="group flex h-full flex-col rounded-[20px] bg-white p-[10px] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)]"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px]">
          <ImageShine className="absolute inset-0">
            <div className="reveal-zoom absolute inset-0" style={delay(d)}>
              <Image
                src={event.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
              />
            </div>
          </ImageShine>

          {/* Date chip turns red on hover */}
          <span className="pointer-events-none absolute top-4 left-4 z-[3] flex w-[58px] flex-col items-center rounded-[12px] bg-white py-2 text-[#0b0b0b] transition-colors duration-500 group-hover:bg-[var(--primary)] group-hover:text-white">
            <span className="font-heading text-[20px] leading-none">
              {fmt(event.date, { day: "2-digit" })}
            </span>
            <span className="mt-1.5 font-dmSans text-[11px] font-semibold tracking-[0.12em] uppercase">
              {fmt(event.date, { month: "short" })}
            </span>
          </span>

          {/* Arrow pops in on hover */}
          <span className="pointer-events-none absolute top-4 right-4 z-[3] flex h-11 w-11 scale-0 -rotate-45 items-center justify-center rounded-full bg-primary text-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-hover:rotate-0">
            <ArrowUpRightIcon className="h-5 w-5" />
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-3 pt-6 pb-4 md:px-4">
          <h3 className="font-heading text-[clamp(0.95rem,1.1vw,1.15rem)] leading-title text-[#0b0b0b] uppercase transition-colors duration-300 group-hover:text-[var(--primary)]">
            {event.title}
          </h3>
          <p className="mt-3 line-clamp-2 font-dmSans text-[15px] leading-text text-[#5b5b5b]">
            {event.description}
          </p>

          <span aria-hidden className="relative mt-5 block h-px w-full overflow-hidden bg-black/10">
            <span className="absolute inset-0 origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-700 ease-[cubic-bezier(.77,0,.175,1)] group-hover:scale-x-100" />
          </span>

          <ul className="mt-5 space-y-2.5 font-dmSans text-[14px] text-[#3a3a3a]">
            <li className="flex items-center gap-2.5">
              <CalendarIcon className="h-[18px] w-[18px] shrink-0 text-[var(--primary)]" />
              <time dateTime={event.date}>
                {fmt(event.date, { month: "long", day: "numeric", year: "numeric" })}
              </time>
              <span aria-hidden className="text-black/30">/</span>
              {event.time}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPinIcon className="h-[18px] w-[18px] shrink-0 text-[var(--primary)]" />
              {event.venue}
            </li>
          </ul>
        </div>
      </NavLink>
    </div>
  );
};

const OurEvents = ({
  badge = "Our Events",
  titleLines = ["Don't Miss Our Featured", "Cultural Events"],
  description = "Join us for a vibrant calendar of exhibitions, artist talks, workshops, and community gatherings that celebrate art, history, and creativity.",
  cta = { label: "View All Events", href: "/events" },
  events = DEFAULT_EVENTS,
}: OurEventsProps) => (
  <section className="relative overflow-hidden bg-[#f4f4f4] py-20 text-[#0b0b0b] md:py-28">
    <ContentContainer size="narrow" className="h-auto">
      {/* Header row */}
      <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-16">
        <SectionHeading badge={badge} lines={titleLines} align="left" tone="light" />
        <Reveal once className="lg:pb-2">
          <p
            className="font-dmSans text-[clamp(15px,1vw,17px)] leading-text text-[#5b5b5b]"
            {...revealItem("down", 30, 0.25, 1)}
          >
            {description}
          </p>
          <div className="mt-7" {...revealItem("down", 30, 0.4, 1)}>
            <PrimaryButton href={cta.href} arrow>
              {cta.label}
            </PrimaryButton>
          </div>
        </Reveal>
      </div>

      <Reveal
        once
        className="mt-14 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-[30px]"
      >
        {events.map((event, i) => (
          <div
            key={event.title}
            className={i === 2 ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full" : undefined}
          >
            <EventCard event={event} index={i} />
          </div>
        ))}
      </Reveal>
    </ContentContainer>
  </section>
);

export default OurEvents;
