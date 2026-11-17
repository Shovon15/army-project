import type { OutcomeType } from "@/lib/home/bangladeshIncidents";
import { cn } from "@/utils/helpers/cn";

const STYLES: Record<OutcomeType, string> = {
  disposed: "border-accent/60 bg-accent/15 text-accent",
  detonated: "border-primary-light/60 bg-primary-light/15 text-primary-light",
  other: "border-white/30 bg-white/10 text-white/85",
};

const GLYPH: Record<OutcomeType, string> = {
  disposed: "✓",
  detonated: "!",
  other: "•",
};

/** Outcome pill. Colour is never the only signal: the text is always shown. */
const OutcomeBadge = ({
  type,
  text,
  className,
}: {
  type: OutcomeType;
  text: string;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-dmSans text-xs font-semibold",
      STYLES[type],
      className,
    )}
  >
    <span aria-hidden="true">{GLYPH[type]}</span>
    {text}
  </span>
);

export default OutcomeBadge;
