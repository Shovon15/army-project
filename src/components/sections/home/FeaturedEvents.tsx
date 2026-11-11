
"use client";

import { useState } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionHeading from "@/components/common/typography/SectionHeading";
import Reveal from "@/components/common/animations/Reveal";
import CtaLine from "@/components/common/cta/CtaLine";
import { cn } from "@/utils/helpers/cn";
import { DEFAULT_EVENTS, EventCard, MuseumEvent } from "./OurEvents";


// export type MuseumEvent = {
//   title: string;
//   description: string;
//   href: string;
//   image: string;
//   date: string;
//   time?: string;
//   venue?: string;
// };

type FeaturedEventsProps = {
  badge?: string;
  titleLines?: string[];
  showHeading?: boolean;
  events?: MuseumEvent[];
  cta?: {
    text: string;
    linkLabel: string;
    href: string;
  } | null;
  tone?: "dark" | "light";
  /** Show this many events, then a "Load more" button for the next batch. Omit to show all. */
  pageSize?: number;
};

// const DEFAULT_EVENTS: MuseumEvent[] = EVENTS.slice(0, 3);

const FeaturedEvents = ({
  badge = "Upcoming Events",
  titleLines = ["Discover Our Latest", "Events & Experiences"],
  showHeading = true,
  events = DEFAULT_EVENTS,
  cta = {
    text: "Discover more experiences and upcoming events –",
    linkLabel: "View All Events.",
    href: "/events",
  },
  tone = "dark",
  pageSize,
}: FeaturedEventsProps) => {
  const dark = tone === "dark";
  const [visibleCount, setVisibleCount] = useState(pageSize ?? events.length);
  const visibleEvents = events.slice(0, visibleCount);
  const hasMore = !!pageSize && visibleCount < events.length;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-20 md:py-28",
        dark
          ? "bg-surface-dark text-white"
          : "bg-surface-light text-ink",
      )}
    >
      {dark && <GlowBackground />}

      <ContentContainer size="narrow" className="h-auto">
        {showHeading && (
          <SectionHeading
            badge={badge}
            lines={titleLines}
            tone={tone}
          />
        )}

        <Reveal
          once
          className={cn(
            "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]",
            showHeading && "mt-14 md:mt-16",
          )}
        >
          {visibleEvents.map((event, index) => (
            <div key={event.title} className="h-full">
              <EventCard event={event} index={index % 3} />
            </div>
          ))}
        </Reveal>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <PrimaryButton
              type="button"
              variant={dark ? "dark" : "primary"}
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + (pageSize ?? events.length), events.length),
                )
              }
            >
              Load More Events
            </PrimaryButton>
          </div>
        )}

        {cta && (
          <CtaLine
            {...cta}
            tone={tone}
            className="mt-12"
          />
        )}
      </ContentContainer>
    </section>
  );
};

export default FeaturedEvents;
