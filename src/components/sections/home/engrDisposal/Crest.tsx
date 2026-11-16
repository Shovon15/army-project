import Image from "next/image";
import type { Battalion } from "@/lib/home/engrDisposal";
import { cn } from "@/utils/helpers/cn";

/** "[Engr Battalion Name 1]" → "EB1"; uses shortName first when present. */
export const battalionInitials = (b: Battalion) => {
  const source = (b.shortName ?? b.name).replace(/[[\]()]/g, " ");
  const words = source.split(/\s+/).filter(Boolean);
  return words
    .map((w) => (/^\d+$/.test(w) ? w : w[0]))
    .join("")
    .slice(0, 4)
    .toUpperCase();
};

/** Battalion crest, or an initials badge when no crest image is set. */
const Crest = ({
  battalion,
  className,
}: {
  battalion: Battalion;
  className?: string;
}) => (
  <span
    aria-hidden="true"
    className={cn(
      "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-accent/40 bg-surface-deep/80 font-boldCond text-accent",
      className,
    )}
  >
    {battalion.crest ? (
      <Image
        src={battalion.crest}
        alt=""
        fill
        sizes="96px"
        className="object-contain p-1.5"
      />
    ) : (
      battalionInitials(battalion)
    )}
  </span>
);

export default Crest;
