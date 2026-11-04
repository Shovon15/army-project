import { cn } from "@/utils/helpers/cn";
import SectionBadge from "./SectionBadge";
import AnimatedHeading from "./AnimatedHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";

type SectionHeadingProps = {
  badge: string;
  /** One entry per line; lines wipe in left → right on scroll. */
  lines: string[];
  /** "dark" = white text for dark sections. */
  tone?: "dark" | "light";
  align?: "center" | "left";
  className?: string;
  headingClassName?: string;
};

/** Badge + big animated title used at the top of each section. */
const SectionHeading = ({
  badge,
  lines,
  tone = "light",
  align = "center",
  className,
  headingClassName,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "flex flex-col",
      align === "center" ? "items-center text-center" : "items-start",
      className,
    )}
  >
    <Reveal once>
      <div {...revealItem("down", 24, 0, 0.9)}>
        <SectionBadge tone={tone}>{badge}</SectionBadge>
      </div>
    </Reveal>
    <AnimatedHeading
      lines={lines}
      className={cn(
        "mt-5 text-[clamp(1.5rem,2.3vw,2.0rem)]",
        tone === "dark" ? "text-white" : "text-[#0b0b0b]",
        headingClassName,
      )}
    />
  </div>
);

export default SectionHeading;
