export type SummaryItem = {
  id: string;
  label: string;
  value: number;
  /** Text shown before the number, e.g. "Since". */
  prefix?: string;
  /** Count-up starts here (e.g. a few decades before a year). */
  from?: number;
  /** Years are shown without digit grouping ("2015", not "2,015"). */
  grouping?: boolean;
  /** Screen-reader sentence with the final value. */
  srText: string;
};

/** Large count-up numbers. Visible digits are aria-hidden; srText carries the value. */
const DisposalSummary = ({
  items,
  numberLocale,
}: {
  items: SummaryItem[];
  numberLocale: string;
}) => (
  <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
    {items.map((item) => {
      const fmt = new Intl.NumberFormat(numberLocale, {
        useGrouping: item.grouping ?? true,
      });
      return (
        <li
          key={item.id}
          data-ed-stat
          className="flex flex-col items-center rounded-2xl border border-white/10 bg-surface-deep/50 px-3 py-6 text-center md:px-6 md:py-8"
        >
          <span className="sr-only">{item.srText}</span>
          <span
            aria-hidden="true"
            className="flex items-baseline gap-2 font-boldCond leading-none text-accent tabular-nums"
          >
            {item.prefix && (
              <span className="font-dmSans text-base font-semibold text-white/80 md:text-lg">
                {item.prefix}
              </span>
            )}
            <span
              data-ed-count
              data-value={item.value}
              data-from={item.from ?? 0}
              data-grouping={item.grouping === false ? "0" : "1"}
              className="text-[clamp(2rem,9vw,2.5rem)] md:text-[clamp(2.5rem,5vw,4.5rem)]"
            >
              {fmt.format(item.value)}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="mt-3 block font-dmSans text-sm leading-snug font-semibold text-white/90 md:text-base"
          >
            {item.label}
          </span>
        </li>
      );
    })}
  </ul>
);

export default DisposalSummary;
