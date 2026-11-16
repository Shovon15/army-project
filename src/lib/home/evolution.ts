/* ---------------------------------------------------------------------------
   Evolution of IED timeline (components/sections/home/evolution/).

   Edit the text here; the components never need to change.

   CONTENT RULE: the text is historical and educational only: context,
   significance, and how forces countered the threat. Never include
   construction methods, components, formulations or technical make-up.

   TODO: Replace with text approved by the Corps of Engineers. Every
   `fullText` below is a PLACEHOLDER; `shortText` is a neutral teaser that
   the curators should also review.
--------------------------------------------------------------------------- */

/** The detail overlay closes itself after this long without interaction. */
export const EVOLUTION_OVERLAY_IDLE_MS = 60_000;

export type Era = {
  id: string;
  period: string;
  title: string;
  /** One line, shown on the card. */
  shortText: string;
  /** 2–4 short paragraphs, shown in the detail view. */
  fullText: string[];
  /** Path under /public, e.g. "/images/evolution/antwerp.jpg". */
  image?: string;
  imageCaption?: string;
  /** 2–3 short bullet strings. */
  keyFacts?: string[];
  source?: string;
};

type EvolutionCopy = {
  /** Locale for number formatting ("01", "03 / 11"). */
  numberLocale: string;
  eyebrow: string;
  title: string;
  intro: string;
  railLabel: string;
  jumpToEra: string;
  prev: string;
  next: string;
  readMore: string;
  prevEra: string;
  nextEra: string;
  close: string;
  keyFacts: string;
  source: string;
  imagePending: string;
  eras: Era[];
};

// TODO: Replace with text approved by the Corps of Engineers.
const FULL_TEXT_PLACEHOLDER = [
  "Placeholder – museum curators to provide approved text.",
];

const erasEn: Era[] = [
  {
    id: "song-jin",
    period: "c. 1000–1300",
    title: "Song & Jin Dynasty",
    shortText:
      "Gunpowder weapons first appear on the battlefields of the Song–Jin wars in China.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "antwerp",
    period: "1585",
    title: "Siege of Antwerp",
    shortText:
      "Explosive 'hellburner' ships are sent against a Spanish blockade bridge on the Scheldt.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "civil-war",
    period: "1861–1865",
    title: "US Civil War Torpedoes",
    shortText:
      "Concealed 'torpedoes', early land and naval mines, slow advances on land and water.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "dynamite",
    period: "1867",
    title: "Invention of Dynamite",
    shortText:
      "Alfred Nobel patents dynamite, transforming mining and construction, and later warfare.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "wwi",
    period: "1914–1918",
    title: "WWI Booby Traps",
    shortText:
      "Retreating armies leave booby traps behind, and organised clearance work begins.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "wwii",
    period: "1939–1945",
    title: "WWII Sabotage",
    shortText:
      "Resistance groups and special forces target rail lines, bridges and supply depots.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "guerrilla",
    period: "1946–1975",
    title: "Guerrilla Conflicts",
    shortText:
      "Insurgencies from Malaya to Vietnam make improvised devices a weapon of attrition.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "wheelbarrow",
    period: "1970s–1972",
    title: "Term 'IED' & the Wheelbarrow",
    shortText:
      "British EOD teams coin the term 'IED' and field the Wheelbarrow remote robot.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "vbied",
    period: "1983–2009",
    title: "VBIEDs & Suicide Vests",
    shortText:
      "Vehicle- and person-borne attacks change how forces protect people and bases.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "asymmetric",
    period: "2001–2014",
    title: "Asymmetric Warfare & EFPs",
    shortText:
      "IEDs become a leading cause of casualties, driving a global counter-IED effort.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
  {
    id: "drones",
    period: "2015–Present",
    title: "Drone-Borne IEDs",
    shortText:
      "Misused commercial drones create an airborne threat that demands new countermeasures.",
    fullText: FULL_TEXT_PLACEHOLDER,
  },
];

export const evolutionContent: { en: EvolutionCopy; bn: EvolutionCopy } = {
  en: {
    numberLocale: "en-US",
    eyebrow: "A Thousand Years of Threat",
    title: "Evolution of IED",
    intro:
      "How improvised explosive devices evolved from early gunpowder weapons into today's drone-borne threats, and how forces learned to counter them.",
    railLabel: "IED history timeline, 11 eras",
    jumpToEra: "Jump to era",
    prev: "Previous era",
    next: "Next era",
    readMore: "Read more",
    prevEra: "Previous era",
    nextEra: "Next era",
    close: "Close",
    keyFacts: "Key facts",
    source: "Source",
    imagePending: "Image to be provided",
    eras: erasEn,
  },
  // TODO(bn): add the Bangla translation. Keep the same keys, ids and order.
  // "bn-BD" gives Bangla digits automatically.
  bn: {
    numberLocale: "bn-BD",
    eyebrow: "TODO",
    title: "TODO",
    intro: "TODO",
    railLabel: "TODO",
    jumpToEra: "TODO",
    prev: "TODO",
    next: "TODO",
    readMore: "TODO",
    prevEra: "TODO",
    nextEra: "TODO",
    close: "TODO",
    keyFacts: "TODO",
    source: "TODO",
    imagePending: "TODO",
    eras: erasEn.map((era) => ({
      ...era,
      title: "TODO",
      shortText: "TODO",
      fullText: ["TODO"],
    })),
  },
};
