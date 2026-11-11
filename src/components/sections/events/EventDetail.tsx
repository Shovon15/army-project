import Image from "next/image";
import ContentContainer from "@/components/layout/container/contentContainer";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import SidebarLinks from "@/components/sections/shared/SidebarLinks";
import EventPhotoGallery from "./EventPhotoGallery";
import { CalendarIcon, MapPinIcon } from "@/assets/icons/MetaIcons";
import routes from "@/config/routes";
import { cn } from "@/utils/helpers/cn";
import type { CorpsEvent } from "@/lib/events/events";

// UTC so the server and browser always print the same calendar day.
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
export const formatEventDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** All-day Google Calendar link (start time and venue go in the details). */
const calendarUrl = (e: CorpsEvent) => {
  const day = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
  const start = toDate(e.date);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${day(start)}/${day(end)}`,
    details: `Starts ${e.time}. ${e.description}`,
    location: e.venue,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.4 1.4 0 0 1 0 2l-6.3 6.3a1.4 1.4 0 0 1-2 0Z" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </svg>
);

const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("font-heading text-[clamp(1.3rem,1.9vw,1.9rem)] leading-title text-ink uppercase", className)}>
    {children}
  </h2>
);

const Para = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("font-dmSans text-[clamp(15px,1.05vw,17px)] leading-[1.8] text-ink-muted", className)}>
    {children}
  </p>
);

/** Date / time / venue chips, used under the hero title. */
export const EventMetaChips = ({ event: e }: { event: CorpsEvent }) => (
  <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-dmSans text-[14px] text-white/85 md:text-[15px]">
    <li className="flex items-center gap-2">
      <CalendarIcon className="h-[18px] w-[18px] text-accent" />
      {formatEventDate(e.date)}
    </li>
    <li className="flex items-center gap-2">
      <ClockIcon className="h-[18px] w-[18px] text-accent" />
      {e.time}
    </li>
    <li className="flex items-center gap-2">
      <MapPinIcon className="h-[18px] w-[18px] text-accent" />
      {e.venue}
    </li>
  </ul>
);

/* ------------------------------ Sidebar ------------------------------ */

const InfoCard = ({ event: e }: { event: CorpsEvent }) => {
  const rows = [
    { icon: CalendarIcon, label: "Date", value: formatEventDate(e.date) },
    { icon: ClockIcon, label: "Time", value: e.time },
    { icon: MapPinIcon, label: "Venue", value: e.venue },
    { icon: TagIcon, label: "Category", value: e.category },
  ];
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-surface-dark p-6 text-white md:p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-60 w-60 rounded-full bg-[radial-gradient(closest-side,rgb(var(--primary-rgb)/0.55),transparent)]"
      />
      <h2 className="relative font-heading text-[clamp(1rem,1.2vw,1.2rem)] leading-title uppercase">
        Event Details
      </h2>
      <dl className="relative mt-6 space-y-4 font-dmSans text-[15px]">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3">
            <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" />
            <div>
              <dt className="text-[13px] tracking-[0.12em] text-accent uppercase">{label}</dt>
              <dd className="mt-0.5 text-white/90">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
      <div className="relative mt-7">
        <PrimaryButton href={calendarUrl(e)} arrow variant="light" size="sm">
          Add To Calendar
        </PrimaryButton>
      </div>
    </div>
  );
};

/* ------------------------------ Main ------------------------------ */

/**
 * Event detail: thumbnail with caption, article text, programme and an
 * optional photo gallery, with a sticky sidebar of details and other events.
 */
const EventDetail = ({ event: e, all }: { event: CorpsEvent; all: CorpsEvent[] }) => {
  const others = all.filter((o) => o.slug !== e.slug).slice(0, 5);
  const gallery = e.gallery ?? [];

  return (
    <section className="relative bg-white py-16 text-ink md:py-24">
      <ContentContainer
        size="narrow"
        className="grid h-auto items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]"
      >
        <article className="min-w-0">
          {/* Thumbnail */}
          <Reveal once>
            <figure {...revealItem("down", 40, 0, 1.1)}>
              <ImageShine className="aspect-[16/10] rounded-[20px]">
                <Image
                  src={e.image}
                  alt={e.imageCaption}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </ImageShine>
              <figcaption className="mt-3 font-dmSans text-[14px] text-ink-muted italic">
                {e.imageCaption}
              </figcaption>
            </figure>
          </Reveal>

          {/* Title + overview */}
          <header className="mt-10 md:mt-12">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 font-dmSans text-[13px] font-semibold tracking-[0.12em] text-primary uppercase">
              <span aria-hidden className="h-2 w-2 rotate-45 bg-primary" />
              {e.category}
            </p>
            <p className="mt-5 border-l-2 border-primary pl-5 font-dmSans text-[clamp(16px,1.15vw,19px)] leading-[1.7] text-ink-soft">
              {e.description}
            </p>
          </header>

          <div className="mt-8 space-y-5">
            {e.overview.map((p, i) => (
              <Para key={i}>{p}</Para>
            ))}
          </div>

          {/* Article sections */}
          {e.sections.map((s) => (
            <div key={s.heading} className="mt-12">
              <H2>{s.heading}</H2>
              <div className="mt-5 space-y-5">
                {s.paragraphs.map((p, i) => (
                  <Para key={i}>{p}</Para>
                ))}
              </div>
            </div>
          ))}

          {/* Programme */}
          {e.programme && e.programme.length > 0 && (
            <div className="mt-12">
              <H2>Programme</H2>
              <ol className="mt-6 overflow-hidden rounded-[20px] border border-black/5 bg-surface-light">
                {e.programme.map((p, i) => (
                  <li
                    key={p.time + p.item}
                    className={cn(
                      "flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-6",
                      i > 0 && "border-t border-black/5",
                    )}
                  >
                    <span className="w-24 shrink-0 font-heading text-[15px] text-primary tabular-nums">
                      {p.time}
                    </span>
                    <span className="font-dmSans text-[15px] text-ink">{p.item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Photo gallery (only when the event has photos) */}
          {gallery.length > 0 && (
            <div id="photos" className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <H2>Photo Gallery</H2>
                <span className="font-dmSans text-[14px] text-ink-muted">
                  {gallery.length} {gallery.length === 1 ? "photo" : "photos"}
                </span>
              </div>
              <div className="mt-6">
                <EventPhotoGallery images={gallery} />
              </div>
            </div>
          )}

          <div className="mt-14 border-t border-black/10 pt-8">
            <PrimaryButton href={routes.events} arrow>
              Back To All Events
            </PrimaryButton>
          </div>
        </article>

        <aside className="space-y-7 lg:sticky lg:top-28">
          <InfoCard event={e} />
          {others.length > 0 && (
            <SidebarLinks
              title="More Events"
              ariaLabel="More events"
              links={others.map((o) => ({ label: o.title, href: o.href }))}
            />
          )}
        </aside>
      </ContentContainer>
    </section>
  );
};

export default EventDetail;
