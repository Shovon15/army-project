import Image from "next/image";
import ContentContainer from "@/components/layout/container/contentContainer";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import CountUp from "@/components/common/animations/CountUp";
import SidebarLinks from "@/components/sections/shared/SidebarLinks";
import JourneyCard from "@/components/sections/shared/JourneyCard";
import { ColumnIcon, MaskIcon, PaletteIcon } from "@/assets/icons/MuseumIcons";
import { cn } from "@/utils/helpers/cn";
import type { MuseumCollection } from "@/lib/collections/collections";

const FEATURE_ICONS = [MaskIcon, PaletteIcon, ColumnIcon];

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-heading text-[clamp(1.3rem,1.9vw,1.9rem)] leading-title text-ink uppercase">
    {children}
  </h2>
);

const Para = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("font-dmSans text-[clamp(15px,1.05vw,17px)] leading-[1.8] text-ink-muted", className)}>
    {children}
  </p>
);

/* ------------------------------ Sidebar ------------------------------ */

const Sidebar = ({
  current,
  all,
}: {
  current: MuseumCollection;
  all: MuseumCollection[];
}) => (
  <aside className="space-y-7 lg:sticky lg:top-28">
    <SidebarLinks
      title="Discover Our Collections"
      ariaLabel="Collections"
      links={all.map((c) => ({ label: c.title, href: c.href, active: c.slug === current.slug }))}
    />
    <JourneyCard />
  </aside>
);

/* ------------------------------ Main ------------------------------ */

/** Collection detail: article-style content with a sticky sidebar. */
const CollectionDetail = ({
  collection: c,
  all,
}: {
  collection: MuseumCollection;
  all: MuseumCollection[];
}) => (
  <section className="relative bg-white py-16 text-ink md:py-24">
    <ContentContainer
      size="narrow"
      className="grid h-auto items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div className="order-1 min-w-0">
        <Reveal once>
          <div {...revealItem("down", 40, 0, 1.1)}>
            <ImageShine className="aspect-[16/10] rounded-[20px]">
              <Image
                src={c.image}
                alt={c.title}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </ImageShine>
          </div>
        </Reveal>

        <Para className="mt-10 text-ink-soft md:mt-12">{c.intro}</Para>

        {/* Highlights */}
        <div className="mt-14">
          <H2>Collection Highlights</H2>
          <Para className="mt-5">{c.highlightsText}</Para>

          <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
            <ul className="space-y-4">
              {c.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-4 rounded-[14px] bg-surface-light px-5 py-4 font-heading text-[14px] leading-title uppercase md:text-[15px]"
                >
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rotate-45 bg-primary" />
                  {h}
                </li>
              ))}
            </ul>
            <ImageShine className="aspect-[4/3] rounded-[20px]">
              <Image
                src={c.highlightImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </ImageShine>
          </div>

          {/* Stats */}
          <ul className="mt-10 grid gap-4 rounded-[20px] bg-surface-dark p-6 text-white sm:grid-cols-3 md:p-8">
            {c.stats.map((s, i) => (
              <li
                key={s.label}
                className={cn(
                  "text-center sm:px-4",
                  i > 0 && "border-t border-white/10 pt-4 sm:border-t-0 sm:border-l sm:pt-0",
                )}
              >
                <CountUp
                  to={s.value}
                  suffix={s.suffix}
                  duration={2400}
                  className="font-heading text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none text-accent tabular-nums"
                />
                <p className="mt-3 font-dmSans text-[14px] font-semibold tracking-[0.08em] text-white/80 uppercase">
                  {s.label}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured */}
        <div className="mt-14">
          <H2>Featured Collections</H2>
          <Para className="mt-5">{c.featuredText}</Para>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {c.featured.map((f, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <li
                  key={f.title}
                  className="group rounded-[20px] border border-black/5 bg-surface-light p-6 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)]"
                >
                  <Icon className="icon-wobble h-11 w-11 text-primary" />
                  <h3 className="mt-5 font-heading text-[clamp(0.95rem,1.05vw,1.1rem)] leading-title uppercase">
                    {f.title}
                  </h3>
                  <p className="mt-3 font-dmSans text-[15px] leading-text text-ink-muted">{f.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="order-2">
        <Sidebar current={c} all={all} />
      </div>
    </ContentContainer>
  </section>
);

export default CollectionDetail;
