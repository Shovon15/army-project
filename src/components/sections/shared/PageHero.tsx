import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import AnimatedHeading from "@/components/common/typography/AnimatedHeading";
import NavLink from "@/components/common/link/NavLink";
import routes from "@/config/routes";
import { cn } from "@/utils/helpers/cn";

import defaultImage from "@/assets/images/museum-image.jpg";

export type Crumb = { label: string; href?: string };

type PageHeroProps = {
  /** One entry per heading line. */
  titleLines: string[];
  /** Trail after "Home". The last item is the current page (no link). */
  breadcrumbs: Crumb[];
  image?: StaticImageData | string;
  /** Overrides the title size (long titles, e.g. blog posts). */
  titleClassName?: string;
  /** Extra content under the breadcrumb (e.g. post date / category). */
  children?: React.ReactNode;
};

const fade = (s: number) => ({ "--fade-delay": `${s}s` }) as CSSProperties;

/**
 * Inner-page banner: dimmed photo over the navy glow, big title and a
 * breadcrumb trail. Used by About Us and any other inner page.
 */
const PageHero = ({
  titleLines,
  breadcrumbs,
  image = defaultImage,
  titleClassName,
  children,
}: PageHeroProps) => {
  const trail: Crumb[] = [{ label: "Home", href: routes.home }, ...breadcrumbs];
  const afterTitle = 0.25 + titleLines.length * 0.16 + 0.2;

  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-surface-dark text-white md:min-h-[520px]">
      <GlowBackground topLine />

      {/* Photo sits under a navy wash so the title always reads */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_6_56/0.55)_0%,rgb(11_6_56/0.85)_70%,var(--surface-dark)_100%)]" />
      </div>

      <ContentContainer
        size="narrow"
        className="relative flex w-full flex-col items-center pt-40 pb-16 text-center md:pt-48 md:pb-20"
      >
        <AnimatedHeading
          tag="h1"
          trigger="load"
          lines={titleLines}
          className={cn("text-[clamp(2.2rem,5vw,4.5rem)]", titleClassName)}
        />

        <nav aria-label="Breadcrumb" className="hero-fade mt-6" style={fade(afterTitle)}>
          <ol className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-accent/30 bg-white/[0.04] px-5 py-2 font-dmSans text-[13px] font-semibold tracking-[0.12em] uppercase backdrop-blur-sm md:text-sm">
            {trail.map((crumb, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={crumb.label} className="flex items-center gap-2">
                  {last || !crumb.href ? (
                    <span aria-current={last ? "page" : undefined} className="text-accent">
                      {crumb.label}
                    </span>
                  ) : (
                    <NavLink
                      href={crumb.href}
                      hover={false}
                      className="text-white/80 transition-colors duration-300 hover:text-white"
                    >
                      {crumb.label}
                    </NavLink>
                  )}
                  {!last && (
                    <span aria-hidden className="text-white/40">
                      /
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {children && (
          <div className="hero-fade mt-5" style={fade(afterTitle + 0.1)}>
            {children}
          </div>
        )}
      </ContentContainer>
    </section>
  );
};

export default PageHero;
