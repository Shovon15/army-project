import type { CSSProperties, ReactNode } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionBadge from "@/components/common/typography/SectionBadge";
import AnimatedHeading from "@/components/common/typography/AnimatedHeading";

const fade = (s: number) => ({ "--fade-delay": `${s}s` }) as CSSProperties;

type StatusScreenProps = {
  /** Giant outlined text, e.g. "404" or "Oops". */
  code: string;
  badge: string;
  titleLines: string[];
  description: ReactNode;
  /** Buttons row. */
  actions: ReactNode;
  /** Small print under the buttons (e.g. an error reference). */
  footnote?: ReactNode;
};

/**
 * Full-screen status page (404, error) on the navy + crimson-glow backdrop
 * used by the Featured Collections section.
 */
const StatusScreen = ({
  code,
  badge,
  titleLines,
  description,
  actions,
  footnote,
}: StatusScreenProps) => (
  <section className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-surface-dark text-white">
    <GlowBackground topLine />

    <ContentContainer
      size="narrow"
      className="relative flex w-full flex-col items-center pt-36 pb-20 text-center md:pt-40"
    >
      <p
        aria-hidden
        className="hero-fade font-heading text-[clamp(6rem,18vw,15rem)] leading-none text-transparent uppercase select-none [-webkit-text-stroke:2px_rgb(var(--accent-rgb)/0.55)]"
        style={fade(0)}
      >
        {code}
      </p>

      <SectionBadge tone="dark" className="hero-fade mt-6" style={fade(0.15)}>
        {badge}
      </SectionBadge>

      <AnimatedHeading
        tag="h1"
        trigger="load"
        lines={titleLines}
        className="mt-5 text-[clamp(1.6rem,3vw,2.8rem)]"
      />

      <p
        className="hero-fade mt-6 max-w-[540px] font-dmSans text-[clamp(15px,1vw,17px)] leading-text text-white/75"
        style={fade(0.8)}
      >
        {description}
      </p>

      <div className="hero-fade mt-9 flex flex-wrap justify-center gap-4" style={fade(0.95)}>
        {actions}
      </div>

      {footnote && (
        <p className="hero-fade mt-8 font-dmSans text-[13px] text-white/45" style={fade(1.1)}>
          {footnote}
        </p>
      )}
    </ContentContainer>
  </section>
);

export default StatusScreen;
