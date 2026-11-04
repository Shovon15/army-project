import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/utils/helpers/cn";

type MarqueeProps = {
  items: ReactNode[];
  /** Rendered between items (and after the last one so the loop is even). */
  separator?: ReactNode;
  /** Seconds for one full loop; higher = slower. */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
  /** Gap on each side of an item/separator, e.g. "px-8". */
  gapClassName?: string;
};

/**
 * Infinite horizontal ticker, pure CSS (styles in globals.css → .marquee-track).
 * The list is rendered twice; the second copy is hidden from screen readers.
 */
const Marquee = ({
  items,
  separator,
  duration = 30,
  reverse = false,
  pauseOnHover = false,
  className,
  itemClassName,
  gapClassName = "px-6 md:px-9",
}: MarqueeProps) => {
  const list = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          <li className={cn("shrink-0 whitespace-nowrap", gapClassName, itemClassName)}>
            {item}
          </li>
          {separator && (
            <li aria-hidden className={cn("shrink-0", gapClassName)}>
              {separator}
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("overflow-hidden", pauseOnHover && "marquee-pause", className)}
    >
      <div
        className="marquee-track"
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-direction": reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
};

export default Marquee;
