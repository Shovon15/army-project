
import ContentContainer from "@/components/layout/container/contentContainer";
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
}: FeaturedEventsProps) => {
  const dark = tone === "dark";

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
          {events.map((event, index) => (
            <div key={event.title} className="h-full">
              <EventCard event={event} index={index % 3} />
            </div>
          ))}
        </Reveal>

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
