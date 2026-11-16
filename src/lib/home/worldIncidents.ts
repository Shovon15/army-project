/* ---------------------------------------------------------------------------
   World IED Incidents (components/sections/home/worldIncidents/).

   TODO: Replace with verified records provided by the Corps of Engineers.
   Every incident below is a PLACEHOLDER with realistic structure only: the
   titles, dates, summaries and casualty notes are not real records.

   CONTENT RULE: summaries describe the event, impact and response only.
   Never include device construction, components or technical make-up.
--------------------------------------------------------------------------- */

/** The detail panel closes itself after this long without interaction. */
export const WORLD_INCIDENT_IDLE_MS = 60_000;

/**
 * World map. No map library is installed, so a static equirectangular SVG
 * is used (viewBox 0 0 1000 500, whole globe), matching projectLatLng below.
 * /public/maps/world.svg: 177 countries from Natural Earth 1:110m (public
 * domain), one <path data-name="…" data-iso="…"> each.
 * Set `available: false` to fall back to the placeholder grid.
 */
export const WORLD_MAP = {
  src: "/maps/world.svg",
  available: true,
  width: 1000,
  height: 500,
};

/** Equirectangular projection: lat/lng → x/y in the map's viewBox. */
export const projectLatLng = (
  lat: number,
  lng: number,
  width = WORLD_MAP.width,
  height = WORLD_MAP.height,
) => ({
  x: ((lng + 180) / 360) * width,
  y: ((90 - lat) / 180) * height,
});

export type IncidentCategory = "un" | "world";

export type WorldIncident = {
  id: string;
  category: IncidentCategory;
  title: string;
  country: string;
  /** UN only, e.g. "MINUSMA", "MINUSCA", "MONUSCO". */
  missionName?: string;
  location: string;
  lat: number;
  lng: number;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  /** 2–3 lines. */
  summary: string;
  casualties?: string;
  /** UN only. */
  bangladeshContingentInvolved?: boolean;
  image?: string;
  source?: string;
};

const PLACEHOLDER_TITLE = "Placeholder incident – replace with official record";
const PLACEHOLDER_SUMMARY =
  "Placeholder incident – replace with official record. The verified summary will describe the event, its impact and the response by the forces involved.";
const PLACEHOLDER_CASUALTIES = "Placeholder – to be confirmed";
const PLACEHOLDER_SOURCE = "Placeholder – source to be provided";

export const worldIncidents: WorldIncident[] = [
  /* ---------- 2.1 UN Mission Areas ---------- */
  {
    id: "un-1",
    category: "un",
    title: PLACEHOLDER_TITLE,
    country: "Mali",
    missionName: "MINUSMA",
    location: "Kidal region",
    lat: 18.44,
    lng: 1.41,
    date: "2019-03-12",
    summary: PLACEHOLDER_SUMMARY,
    casualties: PLACEHOLDER_CASUALTIES,
    bangladeshContingentInvolved: true,
    source: PLACEHOLDER_SOURCE,
  },
  {
    id: "un-2",
    category: "un",
    title: PLACEHOLDER_TITLE,
    country: "Central African Republic",
    missionName: "MINUSCA",
    location: "Bambari",
    lat: 5.76,
    lng: 20.67,
    date: "2021-07-04",
    summary: PLACEHOLDER_SUMMARY,
    casualties: PLACEHOLDER_CASUALTIES,
    bangladeshContingentInvolved: true,
    source: PLACEHOLDER_SOURCE,
  },
  {
    id: "un-3",
    category: "un",
    title: PLACEHOLDER_TITLE,
    country: "DR Congo",
    missionName: "MONUSCO",
    location: "Beni territory",
    lat: 0.49,
    lng: 29.47,
    date: "2020-11-18",
    summary: PLACEHOLDER_SUMMARY,
    bangladeshContingentInvolved: false,
    source: PLACEHOLDER_SOURCE,
  },
  {
    id: "un-4",
    category: "un",
    title: PLACEHOLDER_TITLE,
    country: "South Sudan",
    missionName: "UNMISS",
    location: "Juba",
    lat: 4.85,
    lng: 31.58,
    date: "2018-05-23",
    summary: PLACEHOLDER_SUMMARY,
    bangladeshContingentInvolved: false,
  },
  {
    id: "un-5",
    category: "un",
    title: PLACEHOLDER_TITLE,
    country: "Lebanon",
    missionName: "UNIFIL",
    location: "Southern Lebanon",
    lat: 33.27,
    lng: 35.2,
    date: "2017-09-09",
    summary: PLACEHOLDER_SUMMARY,
    casualties: PLACEHOLDER_CASUALTIES,
    bangladeshContingentInvolved: false,
    source: PLACEHOLDER_SOURCE,
  },

  /* ---------- 2.2 Rest of the World ---------- */
  {
    id: "world-1",
    category: "world",
    title: PLACEHOLDER_TITLE,
    country: "Afghanistan",
    location: "Kandahar province",
    lat: 31.61,
    lng: 65.71,
    date: "2010-08-14",
    summary: PLACEHOLDER_SUMMARY,
    casualties: PLACEHOLDER_CASUALTIES,
    source: PLACEHOLDER_SOURCE,
  },
  {
    id: "world-2",
    category: "world",
    title: PLACEHOLDER_TITLE,
    country: "Iraq",
    location: "Baghdad",
    lat: 33.31,
    lng: 44.37,
    date: "2007-02-03",
    summary: PLACEHOLDER_SUMMARY,
    casualties: PLACEHOLDER_CASUALTIES,
    source: PLACEHOLDER_SOURCE,
  },
  {
    id: "world-3",
    category: "world",
    title: PLACEHOLDER_TITLE,
    country: "Somalia",
    location: "Mogadishu",
    lat: 2.05,
    lng: 45.32,
    date: "2017-10-14",
    summary: PLACEHOLDER_SUMMARY,
    source: PLACEHOLDER_SOURCE,
  },
  {
    id: "world-4",
    category: "world",
    title: PLACEHOLDER_TITLE,
    country: "Nigeria",
    location: "Borno State",
    lat: 11.85,
    lng: 13.16,
    date: "2015-06-22",
    summary: PLACEHOLDER_SUMMARY,
    casualties: PLACEHOLDER_CASUALTIES,
  },
  {
    id: "world-5",
    category: "world",
    title: PLACEHOLDER_TITLE,
    country: "Colombia",
    location: "Cauca department",
    lat: 2.45,
    lng: -76.6,
    date: "2012-04-27",
    summary: PLACEHOLDER_SUMMARY,
    source: PLACEHOLDER_SOURCE,
  },
];

type WorldIncidentsCopy = {
  /** Locale for dates and numbers. */
  dateLocale: string;
  eyebrow: string;
  title: string;
  intro: string;
  tabs: Record<IncidentCategory, string>;
  tabsLabel: string;
  mapLabel: string;
  mapPending: string;
  pinPrefix: string;
  emptyState: string;
  close: string;
  location: string;
  date: string;
  casualties: string;
  source: string;
  bdContingent: string;
  imagePending: string;
  viewDetails: string;
};

export const worldIncidentsContent: {
  en: WorldIncidentsCopy;
  bn: WorldIncidentsCopy;
} = {
  en: {
    dateLocale: "en-GB",
    eyebrow: "Global Threat",
    title: "World IED Incidents",
    intro:
      "IEDs remain one of the deadliest threats to soldiers, peacekeepers and civilians worldwide.",
    tabs: { un: "UN Mission Areas", world: "Rest of the World" },
    tabsLabel: "Incident groups",
    mapLabel: "World map of IED incidents",
    mapPending: "World map to be added",
    pinPrefix: "IED incident",
    emptyState: "Records will be added soon",
    close: "Close",
    location: "Location",
    date: "Date",
    casualties: "Casualties",
    source: "Source",
    bdContingent: "Bangladesh contingent involved",
    imagePending: "Image to be provided",
    viewDetails: "View details",
  },
  // TODO(bn): add the Bangla translation. Keep the same keys.
  bn: {
    dateLocale: "bn-BD",
    eyebrow: "TODO",
    title: "TODO",
    intro: "TODO",
    tabs: { un: "TODO", world: "TODO" },
    tabsLabel: "TODO",
    mapLabel: "TODO",
    mapPending: "TODO",
    pinPrefix: "TODO",
    emptyState: "TODO",
    close: "TODO",
    location: "TODO",
    date: "TODO",
    casualties: "TODO",
    source: "TODO",
    bdContingent: "TODO",
    imagePending: "TODO",
    viewDetails: "TODO",
  },
};
