/* ---------------------------------------------------------------------------
   IED Statistics – Disposed by Engr Units
   (components/sections/home/engrDisposal/).

   TODO: Replace with verified records provided by the Corps of Engineers.
   Keep the KeyNumbers strip total in sync with the computed total here (or
   update KeyNumbers later to import this total via getOverallTotals()).

   Every battalion and event below is a PLACEHOLDER. ALL totals (per
   battalion, overall, per region, per year) are COMPUTED from `events` in
   ./engrDisposalTotals.ts; never hard-code a total.

   CONTENT RULE: summaries describe date, place, unit and outcome only.
   Never include device construction, components, or render-safe
   procedures/techniques.
--------------------------------------------------------------------------- */

/** The battalion drawer closes itself after this long without interaction. */
export const ENGR_DRAWER_IDLE_MS = 60_000;

export type DisposalRegion = "cht" | "country" | "un";

export const DISPOSAL_REGIONS: DisposalRegion[] = ["cht", "country", "un"];

export type DisposalEvent = {
  id: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  location: string;
  /** District or area. */
  district: string;
  region: DisposalRegion;
  title: string;
  /** 1–2 lines. */
  summary: string;
  /** Number of IEDs disposed in this event. */
  quantity: number;
  /** Defaults to "Disposed successfully". */
  outcome?: string;
  image?: string;
};

export type Battalion = {
  id: string;
  name: string;
  shortName?: string;
  /** Crest/logo image path under /public. */
  crest?: string;
  description?: string;
  events: DisposalEvent[];
};

export const DEFAULT_OUTCOME = "Disposed successfully";

const EVENT_TITLE = "Placeholder event – replace with official record";
const EVENT_SUMMARY =
  "Placeholder event – replace with official record (date, place, unit and outcome only).";

/** To add a battalion, append another entry; nothing else needs to change. */
export const battalions: Battalion[] = [
  {
    id: "bn-1",
    name: "[Engr Battalion Name 1]",
    shortName: "Bn 1",
    description: "Placeholder description – replace with official text.",
    events: [
      { id: "bn1-e1", date: "2016-03-14", location: "Thanchi", district: "Bandarban", region: "cht", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 3 },
      { id: "bn1-e2", date: "2018-06-04", location: "Ruma", district: "Bandarban", region: "cht", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 5 },
      { id: "bn1-e3", date: "2019-11-21", location: "Barkal", district: "Rangamati", region: "cht", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 2 },
      { id: "bn1-e4", date: "2021-02-09", location: "Bambari", district: "Ouaka, CAR", region: "un", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 4 },
      { id: "bn1-e5", date: "2023-08-30", location: "Dighinala", district: "Khagrachari", region: "cht", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 6 },
    ],
  },
  {
    id: "bn-2",
    name: "[Engr Battalion Name 2]",
    shortName: "Bn 2",
    description: "Placeholder description – replace with official text.",
    events: [
      { id: "bn2-e1", date: "2015-10-30", location: "Rajshahi Sadar", district: "Rajshahi", region: "country", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 2 },
      { id: "bn2-e2", date: "2017-03-25", location: "Patenga", district: "Chattogram", region: "country", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 1 },
      { id: "bn2-e3", date: "2020-01-12", location: "Kidal", district: "Kidal, Mali", region: "un", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 7 },
      { id: "bn2-e4", date: "2022-05-18", location: "Gazipur Sadar", district: "Gazipur", region: "country", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 3 },
    ],
  },
  {
    id: "bn-3",
    name: "[Engr Battalion Name 3]",
    shortName: "Bn 3",
    description: "Placeholder description – replace with official text.",
    events: [
      { id: "bn3-e1", date: "2016-07-12", location: "Gulshan", district: "Dhaka", region: "country", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 4 },
      { id: "bn3-e2", date: "2018-09-03", location: "Beni", district: "North Kivu, DR Congo", region: "un", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 5 },
      { id: "bn3-e3", date: "2019-04-27", location: "Rangamati Sadar", district: "Rangamati", region: "cht", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 2 },
      { id: "bn3-e4", date: "2021-01-19", location: "Sylhet Sadar", district: "Sylhet", region: "country", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 1 },
      { id: "bn3-e5", date: "2022-11-08", location: "Panchhari", district: "Khagrachari", region: "cht", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 3 },
      { id: "bn3-e6", date: "2024-02-15", location: "Juba", district: "Central Equatoria, South Sudan", region: "un", title: EVENT_TITLE, summary: EVENT_SUMMARY, quantity: 2 },
    ],
  },
];

type EngrDisposalCopy = {
  /** Locale for numbers and dates. */
  numberLocale: string;
  dateLocale: string;
  eyebrow: string;
  title: string;
  intro: string;
  summary: {
    total: string;
    battalions: string;
    operations: string;
    since: string;
    firstRecord: string;
  };
  chartTitle: string;
  chartPeriod: string;
  allTime: string;
  /** "IEDs disposed" (bar labels, table header). */
  iedsDisposed: string;
  openDetails: string;
  tableCaption: string;
  battalion: string;
  operations: string;
  regions: Record<DisposalRegion, string>;
  lastDisposal: string;
  viewEvents: string;
  emptyState: string;
  all: string;
  filterLabel: string;
  /** "× {n} IEDs" → prefix/suffix around the quantity. */
  quantitySuffix: string;
  prevBattalion: string;
  nextBattalion: string;
  close: string;
};

export const engrDisposalContent: {
  en: EngrDisposalCopy;
  bn: EngrDisposalCopy;
} = {
  en: {
    numberLocale: "en-US",
    dateLocale: "en-GB",
    eyebrow: "Mission Accomplished",
    title: "IEDs Disposed by Engineer Units",
    intro:
      "The record of IEDs successfully disposed of by Engineer battalions of the Bangladesh Army.",
    summary: {
      total: "Total IEDs disposed",
      battalions: "Battalions",
      operations: "Disposal operations",
      since: "Since",
      firstRecord: "First recorded operation",
    },
    chartTitle: "Battalion comparison",
    chartPeriod: "Show totals for",
    allTime: "All time",
    iedsDisposed: "IEDs disposed",
    openDetails: "open details",
    tableCaption: "IEDs disposed per Engineer battalion",
    battalion: "Battalion",
    operations: "Operations",
    regions: { cht: "CHT", country: "Rest of country", un: "UN" },
    lastDisposal: "Last disposal",
    viewEvents: "View disposal events",
    emptyState: "Records will be added soon",
    all: "All",
    filterLabel: "Filter events by region",
    quantitySuffix: "IEDs",
    prevBattalion: "Previous battalion",
    nextBattalion: "Next battalion",
    close: "Close",
  },
  // TODO(bn): add the Bangla translation. Keep the same keys.
  bn: {
    numberLocale: "bn-BD",
    dateLocale: "bn-BD",
    eyebrow: "TODO",
    title: "TODO",
    intro: "TODO",
    summary: {
      total: "TODO",
      battalions: "TODO",
      operations: "TODO",
      since: "TODO",
      firstRecord: "TODO",
    },
    chartTitle: "TODO",
    chartPeriod: "TODO",
    allTime: "TODO",
    iedsDisposed: "TODO",
    openDetails: "TODO",
    tableCaption: "TODO",
    battalion: "TODO",
    operations: "TODO",
    regions: { cht: "TODO", country: "TODO", un: "TODO" },
    lastDisposal: "TODO",
    viewEvents: "TODO",
    emptyState: "TODO",
    all: "TODO",
    filterLabel: "TODO",
    quantitySuffix: "TODO",
    prevBattalion: "TODO",
    nextBattalion: "TODO",
    close: "TODO",
  },
};
