/* ---------------------------------------------------------------------------
   Key Numbers strip (components/sections/home/KeyNumbers.tsx).

   Edit the figures here; the component never needs to change.

   TODO: Replace with official figures from the Corps of Engineers.
   Every `value` below is a PLACEHOLDER (0) until the client provides them.

   TODO: the link targets (#statistics, #bangladesh-incidents,
   #world-incidents) don't exist on the home page yet. Keep the links; they
   start working once those sections get their ids.
--------------------------------------------------------------------------- */

export type KeyNumberIcon = "disposal" | "battalion" | "cht" | "un";

export type KeyNumberStat = {
  id: string;
  /** Final number the counter animates to. */
  value: number;
  /** Text after the number, e.g. "+". */
  suffix: string;
  href: string;
  icon: KeyNumberIcon;
};

/** Numbers live in ONE place, shared by every language. */
export const keyNumberStats: KeyNumberStat[] = [
  {
    id: "ieds-disposed",
    value: 0,
    suffix: "+",
    href: "#statistics",
    icon: "disposal",
  },
  {
    id: "battalions",
    value: 0,
    suffix: "",
    href: "#statistics",
    icon: "battalion",
  },
  {
    id: "cht-incidents",
    value: 0,
    suffix: "+",
    href: "#bangladesh-incidents",
    icon: "cht",
  },
  {
    id: "un-incidents",
    value: 0,
    suffix: "+",
    href: "#world-incidents",
    icon: "un",
  },
];

/**
 * "Data as of" date (ISO yyyy-mm-dd). Leave null to hide the note.
 * TODO: set this when the official figures are added.
 */
export const keyNumbersDataAsOf: string | null = null;

type KeyNumbersCopy = {
  /** Locale passed to Intl.NumberFormat / date formatting. */
  numberLocale: string;
  eyebrow: string;
  title: string;
  viewDetails: string;
  /** Prefix for the date note, e.g. "Data as of". */
  dataAsOf: string;
  /** Label per stat, keyed by `KeyNumberStat.id`. */
  labels: Record<string, string>;
};

export const keyNumbersContent: { en: KeyNumbersCopy; bn: KeyNumbersCopy } = {
  en: {
    numberLocale: "en-US",
    eyebrow: "By the Numbers",
    title: "Protecting Lives, One Device at a Time",
    viewDetails: "View details",
    dataAsOf: "Data as of",
    labels: {
      "ieds-disposed": "IEDs Disposed by Engr Units",
      battalions: "Engineer Battalions Involved",
      "cht-incidents": "IED Incidents in CHT",
      "un-incidents": "IED Incidents in UN Mission Areas",
    },
  },
  // TODO(bn): add Bangla text. "bn-BD" gives Bangla digits automatically.
  bn: {
    numberLocale: "bn-BD",
    eyebrow: "TODO",
    title: "TODO",
    viewDetails: "TODO",
    dataAsOf: "TODO",
    labels: {
      "ieds-disposed": "TODO",
      battalions: "TODO",
      "cht-incidents": "TODO",
      "un-incidents": "TODO",
    },
  },
};
