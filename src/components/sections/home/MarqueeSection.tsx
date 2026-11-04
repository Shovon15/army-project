import Marquee from "@/components/common/marquee/Marquee";
import SparkIcon from "@/assets/icons/SparkIcon";
import { cn } from "@/utils/helpers/cn";

type MarqueeSectionProps = {
  items?: string[];
  duration?: number;
  className?: string;
};

const DEFAULT_ITEMS = [
  "Rare Art Collections",
  "Guided Museum Tours",
  "Interactive Art Exhibits",
  "Discover Art History",
  "Artistic Every Journey",
];

/** Red ticker band that sits under the hero. */
const MarqueeSection = ({
  items = DEFAULT_ITEMS,
  duration = 35,
  className,
}: MarqueeSectionProps) => (
  <section
    aria-label="Highlights"
    className={cn("relative z-10 bg-primary py-5 text-white md:py-6", className)}
  >
    <Marquee
      items={items}
      duration={duration}
      itemClassName="font-boldCond text-[clamp(1.05rem,1.5vw,1.75rem)] leading-[1.3] uppercase"
      separator={<SparkIcon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.6} />}
    />
  </section>
);

export default MarqueeSection;
