import type { OutcomeType } from "@/lib/home/bangladeshIncidents";
import { cn } from "@/utils/helpers/cn";

const STYLES: Record<OutcomeType, string> = {
  disposed: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  detonated: "border-red-400/50 bg-red-400/10 text-red-300",
  other: "border-amber-400/50 bg-amber-400/10 text-amber-200",
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
