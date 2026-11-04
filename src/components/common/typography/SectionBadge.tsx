import type { CSSProperties } from "react";
import { cn } from "@/utils/helpers/cn";
import SparkIcon from "@/assets/icons/SparkIcon";

type SectionBadgeProps = {
  children: React.ReactNode;
  /** "dark" for dark backgrounds (hero), "light" for light sections. */
  tone?: "dark" | "light";
  className?: string;
  style?: CSSProperties;
};

/** Small pill label with a spinning red asterisk, shown above section titles. */
const SectionBadge = ({
  children,
  tone = "light",
  className,
  style,
}: SectionBadgeProps) => (
  <span
    style={style}
    className={cn(
      "inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-dmSans text-[11px] font-semibold tracking-[0.14em] uppercase md:text-xs",
      tone === "dark"
        ? "border-accent/30 bg-white/[0.04] text-white backdrop-blur-sm"
        : "border-black/10 bg-white text-ink",
      className,
    )}
  >
    <SparkIcon
      className={cn("hero-spark h-3.5 w-3.5", tone === "dark" ? "text-accent" : "text-primary")}
    />
    {children}
  </span>
);

export default SectionBadge;
