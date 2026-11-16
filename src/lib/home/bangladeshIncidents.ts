/* ---------------------------------------------------------------------------
   IED Incidents in Bangladesh (components/sections/home/bangladeshIncidents/).

   TODO: Replace with verified records provided by the Corps of Engineers.
   Every incident below is a PLACEHOLDER with realistic structure only: the
   titles, dates, summaries, units and outcomes are not real records.

   CONTENT RULE: summaries describe the event, location, response and outcome
   only. Never include device construction, components or technical make-up,
   and don't name civilian victims.
--------------------------------------------------------------------------- */

/** The detail panel closes itself after this long without interaction. */
export const BD_INCIDENT_IDLE_MS = 60_000;

/**
 * Bangladesh district map. No map library is installed, so a static SVG is
 * used, loaded inline so the districts can be styled.
 *
 * /public/maps/bangladesh-districts.svg: all 64 districts, one
 * <path data-name="…"> each. Generated from geoBoundaries BGD ADM2
 * (Bangladesh Bureau of Statistics, OCHA ROAP), licence CC BY 3.0 IGO, so
 * the credit below must stay visible.
 *
 * `width`/`height` match the SVG's viewBox and `bounds` is the exact lat/lng
 * box it covers (linear projection), so pins land on the right spot. If the
 * file is ever regenerated, update all three together.
 * Set `available: false` to fall back to the placeholder panel.
 */
export const BANGLADESH_MAP = {
  src: "/maps/bangladesh-districts.svg",
  available: true,
  width: 700,
  height: 988,
  bounds: { minLat: 20.4697, maxLat: 26.7554, minLng: 87.9152, maxLng: 92.7737 },
  credit: "Boundaries: geoBoundaries (BBS, OCHA) · CC BY 3.0 IGO",
};

/**
 * The map file uses older English spellings for some districts. Map them to
 * the names used in the incident data, so the CHT highlight and the district
 * filter match.
 */
const DISTRICT_ALIASES: Record<string, string> = {
  Khagrachhari: "Khagrachari",
  Chittagong: "Chattogram",
  Comilla: "Cumilla",
  Barisal: "Barishal",
  Bogra: "Bogura",
  Jessore: "Jashore",
  Brahamanbaria: "Brahmanbaria",
  Maulvibazar: "Moulvibazar",
  Nawabganj: "Chapai Nawabganj",
};

export const normalizeDistrict = (name: string) =>
  DISTRICT_ALIASES[name] ?? name;

/** District names (as used in the incident data) that make up the CHT. */
export const CHT_DISTRICTS = ["Rangamati", "Khagrachari", "Bandarban"];

/** Rough CHT box, used for the highlight on the placeholder panel only. */
export const CHT_APPROX_BOUNDS = {
  minLat: 21.2,
  maxLat: 23.7,
  minLng: 91.65,
  maxLng: 92.7,
};

/** Linear projection: lat/lng → x/y in the map's viewBox. */
export const projectBangladesh = (lat: number, lng: number) => {
  const { width, height, bounds } = BANGLADESH_MAP;
  return {
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width,
    y: ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * height,
  };
};

export type BangladeshRegion = "cht" | "country";

/** Drives the badge colour; the visible text always comes from `outcome`. */
export type OutcomeType = "disposed" | "detonated" | "other";

export type BangladeshIncident = {
  id: string;
  region: BangladeshRegion;
  title: string;
  district: string;
  /** Upazila or area (optional). */
  area?: string;
  lat: number;
  lng: number;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  /** 2–3 lines. */
  summary: string;
  /** e.g. an Engr battalion name. */
  respondingUnit?: string;
  /** e.g. "Safely disposed", "Detonated – casualties". */
  outcome: string;
  outcomeType: OutcomeType;
  image?: string;
  source?: string;
};

const TITLE = "Placeholder incident – replace with official record";
const SUMMARY =
  "Placeholder incident – replace with official record. The verified summary will describe the event, its location, the Engineer response and the outcome.";
const UNIT = "[Engr Battalion Name]";
const SOURCE = "Placeholder – source to be provided";

export const bangladeshIncidents: BangladeshIncident[] = [
  /* ---------- 3.1 Chittagong Hill Tracts ---------- */
  {
    id: "cht-1",
    region: "cht",
    title: TITLE,
    district: "Bandarban",
    area: "Thanchi",
    lat: 21.79,
    lng: 92.43,
    date: "2018-06-04",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Safely disposed",
    outcomeType: "disposed",
    source: SOURCE,
  },
  {
    id: "cht-2",
    region: "cht",
    title: TITLE,
    district: "Rangamati",
    area: "Barkal",
    lat: 22.73,
    lng: 92.37,
    date: "2020-02-17",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Safely disposed",
    outcomeType: "disposed",
  },
  {
    id: "cht-3",
    region: "cht",
    title: TITLE,
    district: "Khagrachari",
    area: "Dighinala",
    lat: 23.25,
    lng: 92.06,
    date: "2019-09-28",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Detonated – casualties",
    outcomeType: "detonated",
    source: SOURCE,
  },
  {
    id: "cht-4",
    region: "cht",
    title: TITLE,
    district: "Rangamati",
    area: "Rangamati Sadar",
    lat: 22.65,
    lng: 92.17,
    date: "2022-11-08",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Safely disposed",
    outcomeType: "disposed",
  },
  {
    id: "cht-5",
    region: "cht",
    title: TITLE,
    district: "Bandarban",
    area: "Ruma",
    lat: 22.05,
    lng: 92.4,
    date: "2023-04-15",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Safely disposed",
    outcomeType: "disposed",
    source: SOURCE,
  },

  /* ---------- 3.2 Rest of the Country ---------- */
  {
    id: "country-1",
    region: "country",
    title: TITLE,
    district: "Dhaka",
    lat: 23.81,
    lng: 90.41,
    date: "2016-07-12",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Safely disposed",
    outcomeType: "disposed",
    source: SOURCE,
  },
  {
    id: "country-2",
    region: "country",
    title: TITLE,
    district: "Chattogram",
    lat: 22.34,
    lng: 91.83,
    date: "2017-03-25",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Safely disposed",
    outcomeType: "disposed",
  },
  {
    id: "country-3",
    region: "country",
    title: TITLE,
    district: "Rajshahi",
    lat: 24.37,
    lng: 88.6,
    date: "2015-10-30",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Detonated – no casualties",
    outcomeType: "other",
    source: SOURCE,
  },
  {
    id: "country-4",
    region: "country",
    title: TITLE,
    district: "Sylhet",
    lat: 24.9,
    lng: 91.87,
    date: "2021-01-19",
    summary: SUMMARY,
    respondingUnit: UNIT,
    outcome: "Safely disposed",
    outcomeType: "disposed",
  },
];

type BangladeshIncidentsCopy = {
  /** Locale for dates and numbers ("bn-BD" gives Bangla digits). */
  dateLocale: string;
  eyebrow: string;
  title: string;
  intro: string;
  tabs: Record<BangladeshRegion, string>;
  tabsLabel: string;
  stats: {
    total: string;
    cht: string;
    country: string;
    disposed: string;
  };
  mapLabel: string;
  mapPending: string;
  chtLabel: string;
  pinPrefix: string;
  filtered: string;
  clearFilter: string;
  emptyState: string;
  close: string;
  district: string;
  date: string;
  respondingUnit: string;
  outcome: string;
  source: string;
  imagePending: string;
  viewDetails: string;
};

export const bangladeshIncidentsContent: {
  en: BangladeshIncidentsCopy;
  bn: BangladeshIncidentsCopy;
} = {
  en: {
    dateLocale: "en-GB",
    eyebrow: "On Home Soil",
    title: "IED Incidents in Bangladesh",
    intro:
      "How Engineer units of the Bangladesh Army respond to IED threats across the country, from the hill tracts to urban areas.",
    tabs: { cht: "Chittagong Hill Tracts", country: "Rest of the Country" },
    tabsLabel: "Incident regions",
    stats: {
      total: "Total incidents",
      cht: "CHT",
      country: "Rest of country",
      disposed: "Safely disposed",
    },
    mapLabel: "Map of IED incidents in Bangladesh",
    mapPending: "District map to be added",
    chtLabel: "CHT",
    pinPrefix: "IED incident",
    filtered: "Filtered",
    clearFilter: "Clear filter",
    emptyState: "Records will be added soon",
    close: "Close",
    district: "District / area",
    date: "Date",
    respondingUnit: "Responding unit",
    outcome: "Outcome",
    source: "Source",
    imagePending: "Image to be provided",
    viewDetails: "View details",
  },
  // TODO(bn): add the Bangla translation. Keep the same keys.
  bn: {
    dateLocale: "bn-BD",
    eyebrow: "TODO",
    title: "TODO",
    intro: "TODO",
    tabs: { cht: "TODO", country: "TODO" },
    tabsLabel: "TODO",
    stats: { total: "TODO", cht: "TODO", country: "TODO", disposed: "TODO" },
    mapLabel: "TODO",
    mapPending: "TODO",
    chtLabel: "TODO",
    pinPrefix: "TODO",
    filtered: "TODO",
    clearFilter: "TODO",
    emptyState: "TODO",
    close: "TODO",
    district: "TODO",
    date: "TODO",
    respondingUnit: "TODO",
    outcome: "TODO",
    source: "TODO",
    imagePending: "TODO",
    viewDetails: "TODO",
  },
};
