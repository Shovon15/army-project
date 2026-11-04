import type { CSSProperties } from "react";
import { cn } from "@/utils/helpers/cn";
import Reveal from "@/components/common/animations/Reveal";

type Tag = "h1" | "h2" | "h3" | "h4";

type AnimatedHeadingProps = {
  /** One entry per line; each line wipes in from left to right. */
  lines: string[];
  tag?: Tag;
  /**
   * "load" plays on first paint (hero), "scroll" plays when the heading
   * scrolls into view.
   */
  trigger?: "load" | "scroll";
  className?: string;
};

/**
 * Big condensed uppercase heading whose lines wipe in left → right, one after
 * another. Styles: globals.css (.hero-line / .reveal-line).
 */
const AnimatedHeading = ({
  lines,
  tag: Tag = "h2",
  trigger = "scroll",
  className,
}: AnimatedHeadingProps) => {
  const heading = (
    <Tag
      className={cn(
        "font-boldCond leading-[1.22] uppercase",
        className,
      )}
    >
      {lines.map((line, i) => (
        <span
          key={`${line}-${i}`}
          className={trigger === "load" ? "hero-line" : "reveal-line"}
          style={{ "--line-i": i } as CSSProperties}
        >
          {line}
        </span>
      ))}
    </Tag>
  );

  return trigger === "load" ? heading : <Reveal once>{heading}</Reveal>;
};

export default AnimatedHeading;
