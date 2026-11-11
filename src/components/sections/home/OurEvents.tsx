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
import EventDescription from "./EventDescription";

import { EVENTS } from "@/lib/events/events";

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

/** Home page shows the next three events. */
export const DEFAULT_EVENTS: MuseumEvent[] = EVENTS.slice(0, 3);

// UTC so the server and browser always print the same calendar day.
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  toDate(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;
export const EventCard = ({
  event,
  index,
}: {
  event: MuseumEvent;
  index: number;
}) => {
  const d = 0.15 + index * 0.15;

  return (
    <div className="h-full" {...revealItem("down", 70, d, 1.2)}>
      <article className="group/card flex h-full flex-col overflow-hidden rounded-[20px] bg-white p-[10px] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.2)]">
        {/* Image */}
        <NavLink
          href={event.href}
          hover={false}
          ariaLabel={`View ${event.title}`}
          tabIndex={-1}
          className="relative block aspect-[4/3] overflow-hidden rounded-[14px]"
        >
          <ImageShine className="absolute inset-0">
            <div className="reveal-zoom absolute inset-0" style={delay(d)}>
              <Image
                src={event.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover/card:scale-110"
              />
            </div>
          </ImageShine>

          {/* Modern Expandable Arrow */}
          {/* At rest: a 44px circle with the arrow centred (12px padding each
              side, no gap). On hover the label's max-width opens up and the
              pill grows to fit it, so the text is never clipped. */}
          <span className="absolute right-4 top-4 z-[3] flex h-11 min-w-11 items-center justify-center gap-0 overflow-hidden rounded-full bg-primary px-3 text-white shadow-lg transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/card:gap-2 group-hover/card:px-5 group-hover/card:shadow-xl">
            <ArrowUpRightIcon className="h-5 w-5 shrink-0 transition-transform duration-500 group-hover/card:rotate-45" />

            <span className="block max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/card:max-w-[120px] group-hover/card:opacity-100">
              Read More
            </span>
          </span>
        </NavLink>

        {/* Body */}
        <div className="flex flex-1 flex-col px-3 pt-6 pb-4 md:px-4">
          <h3 className="font-heading text-[clamp(0.95rem,1.1vw,1.15rem)] leading-title text-ink uppercase transition-colors duration-300 group-hover/card:text-primary">
            <NavLink href={event.href} hover={false}>
              {event.title}
            </NavLink>
          </h3>

          <EventDescription text={event.description} />

          {/* Bottom Read More */}
          <div className="mt-auto pt-6">
            <NavLink
              href={event.href}
              hover={false}
              ariaLabel={`Read more about ${event.title}`}
              className="group/link inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors duration-300 hover:text-primary"
            >
              <span className="relative">
                Read More
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover/link:w-full" />
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition-all duration-300 group-hover/link:border-primary group-hover/link:bg-primary group-hover/link:text-white">
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/link:rotate-45" />
              </span>
            </NavLink>
          </div>
        </div>
      </article>
    </div>
  );
};

const OurEvents = ({
  badge = "Our Events",
  titleLines = ["Upcoming Events &", "Ceremonies"],
  description = "Demonstrations, drills, commemorations and ceremonies from the Bangladesh Army Corps of Engineers.",
  cta = { label: "View All Events", href: "/events" },
  events = DEFAULT_EVENTS,
}: OurEventsProps) => (
  <section
    id="events"
    className="relative overflow-hidden bg-surface-light py-20 text-ink md:py-28"
  >
    <ContentContainer size="narrow" className="h-auto">
      {/* Header row */}
      <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          badge={badge}
          lines={titleLines}
          align="left"
          tone="light"
        />
        <Reveal once className="lg:pb-2">
          {/* <p
            className="font-dmSans text-[clamp(15px,1vw,17px)] leading-text text-ink-muted"
            {...revealItem("down", 30, 0.25, 1)}
          >
            {description}
          </p> */}
          <div
            className="mt-7 flex justify-center lg:justify-end"
            {...revealItem("down", 30, 0.4, 1)}
          >
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
            className={
              i === 2
                ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full"
                : undefined
            }
          >
            <EventCard event={event} index={i} />
          </div>
        ))}
      </Reveal>
    </ContentContainer>
  </section>
);

export default OurEvents;
