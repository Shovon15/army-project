import type { StaticImageData } from "next/image";
import type { MuseumEvent } from "@/components/sections/home/OurEvents";
import type { GalleryImage } from "@/lib/gallery/gallery";

import armedForcesParade from "@/assets/images/event-1.jpg";
import marchPast from "@/assets/images/event-2.jpg";
import passingOutParade from "@/assets/images/event-3.jpg";
import deminingTraining from "@/assets/images/event-4.webp";
import nationalMemorial from "@/assets/images/event-5.jpg";
import fieldTrainingVisit from "@/assets/images/home.jpg";
import guardOfHonour from "@/assets/images/about-us.jpg";
import soldierOnTarget from "@/assets/images/a-soldier-engaging-a-target.jpg";
import jungleOperations from "@/assets/images/soldiers-2.jpg";
import bombDisposalRobot from "@/assets/images/images.jpg";
import eodPartnership from "@/assets/images/image.webp";
import eodRobotTraining from "@/assets/images/1744071310341.png";

export type EventSection = { heading: string; paragraphs: string[] };

/** Full event used by the detail page. Cards only read the MuseumEvent fields. */
export type CorpsEvent = MuseumEvent & {
  slug: string;
  category: string;
  /** Caption under the thumbnail on the detail page. */
  imageCaption: string;
  /** Opening paragraphs of the article. */
  overview: string[];
  sections: EventSection[];
  /** Order of the day, shown as a timeline. Optional. */
  programme?: { time: string; item: string }[];
  /** Photo gallery under the article. Optional: hidden when empty. */
  gallery?: GalleryImage[];
};

const photo = (
  src: StaticImageData,
  caption: string,
  alt: string = caption,
): GalleryImage => ({ src, caption, alt });

const event = (e: Omit<CorpsEvent, "href">): CorpsEvent => ({
  ...e,
  href: `/events/${e.slug}`,
});

/**
 * Bangladesh Army Corps of Engineers events, soonest first.
 *
 * TODO: sample events built around the Corps' real roles (bridging, disaster
 * response, demining, UN peacekeeping engineering, training) and national days
 * (Armed Forces Day 21 Nov, Victory Day 16 Dec). Confirm dates, venues,
 * programmes and article text, and replace the placeholder photos with the
 * Corps' own before going live.
 */
export const EVENTS: CorpsEvent[] = [
  event({
    slug: "armed-forces-day-engineering-display",
    title: "Armed Forces Day Engineering Display",
    category: "National Day",
    description:
      "Marking Armed Forces Day with a public display of bridging equipment, earth-moving plant and field engineering vehicles, with live demonstrations by Corps engineers.",
    date: "2026-11-21",
    time: "10:00 AM",
    venue: "Dhaka Cantonment",
    image: armedForcesParade,
    imageCaption: "Contingents carry the national flag and regimental colours on parade.",
    overview: [
      "Every year on 21 November, Bangladesh marks Armed Forces Day in memory of the day in 1971 when the Army, Navy and Air Force launched their first joint operations in the Liberation War. The Corps of Engineers joins the celebrations by opening its equipment park to the public.",
      "Visitors can see, up close, the machines and methods that engineers use to build roads, launch bridges, clear obstacles and restore services after a disaster, and talk to the soldiers who operate them.",
    ],
    sections: [
      {
        heading: "What You Will See",
        paragraphs: [
          "The display brings together bridging equipment, excavators, bulldozers, water purification units and field engineering vehicles. Each stand is crewed by engineers who explain what the equipment does and where it has been used, at home and on UN peacekeeping missions.",
          "Live demonstrations through the day include rapid obstacle clearance, a short-span bridge build and an emergency water supply set up from a river source.",
        ],
      },
      {
        heading: "For Families And Students",
        paragraphs: [
          "Engineering students and school groups are especially welcome. Officers from the Corps will talk about careers in military engineering and the training path from cadet to qualified engineer officer.",
        ],
      },
    ],
    programme: [
      { time: "10:00 AM", item: "Opening and Armed Forces Day address" },
      { time: "10:30 AM", item: "Equipment park opens to visitors" },
      { time: "12:00 PM", item: "Live demonstration: obstacle clearance" },
      { time: "2:30 PM", item: "Live demonstration: short-span bridge build" },
      { time: "4:30 PM", item: "Closing" },
    ],
    gallery: [
      photo(armedForcesParade, "Armed Forces Day parade", "Soldiers marching with the national flag and regimental colours"),
      photo(marchPast, "Contingents marching past", "Contingents marching past with flags and saluting"),
      photo(guardOfHonour, "Guard of honour", "Senior officers inspecting a guard of honour"),
      photo(fieldTrainingVisit, "Visitors meeting soldiers", "Visitors meeting soldiers in camouflage at a field training camp"),
    ],
  }),
  event({
    slug: "bridge-launching-demonstration",
    title: "Bridge Launching Demonstration",
    category: "Demonstration",
    description:
      "Watch engineers assemble and launch a modular panel bridge against the clock, the same drill used to restore crossings after floods or when a road link is cut.",
    date: "2026-11-28",
    time: "9:30 AM",
    venue: "Engineer Training Ground",
    image: passingOutParade,
    imageCaption: "Engineer troops march onto the training ground before the demonstration.",
    overview: [
      "Bangladesh is a land of rivers, and when a flood or cyclone cuts a road, the Corps of Engineers is often the fastest way to reconnect it. Modular panel bridges can be carried by truck, assembled by hand and pushed across a gap in a matter of hours.",
      "In this demonstration, an engineer field company will build and launch a complete bridge in front of spectators, explaining each stage as it happens.",
    ],
    sections: [
      {
        heading: "How A Panel Bridge Is Built",
        paragraphs: [
          "The bridge is assembled from standard steel panels and transoms bolted together on rollers at the near bank. A lightweight launching nose is added to the front, and the whole structure is pushed forward until it reaches the far bank and is jacked down onto its bearings.",
          "Because every part is interchangeable and can be lifted by a small team, the same kit can be used to build bridges of different lengths and load classes.",
        ],
      },
      {
        heading: "Why It Matters",
        paragraphs: [
          "The Corps has used this kind of bridging after floods and cyclones across the country, and on peacekeeping missions where roads and crossings had been destroyed. A fast, well-drilled bridging team can restore supplies to a cut-off community within a day.",
        ],
      },
    ],
    programme: [
      { time: "9:30 AM", item: "Arrival and safety briefing" },
      { time: "10:00 AM", item: "Site reconnaissance and setting out" },
      { time: "10:30 AM", item: "Bridge assembly and launch" },
      { time: "1:00 PM", item: "Load test and walk-across for visitors" },
    ],
    gallery: [
      photo(passingOutParade, "Engineer troops on parade", "Helmeted soldiers marching in formation with rifles"),
      photo(jungleOperations, "Moving to the crossing site", "Soldiers with helmet lamps moving along a misty jungle trail"),
      photo(fieldTrainingVisit, "Briefing visitors on site", "Visitors meeting soldiers at a field training camp"),
    ],
  }),
  event({
    slug: "disaster-response-flood-rescue-drill",
    title: "Disaster Response & Flood Rescue Drill",
    category: "Exercise",
    description:
      "A joint exercise on flood rescue, search in collapsed structures, emergency water supply and rapid shelter construction, the skills the Corps brings to national disaster relief.",
    date: "2026-12-05",
    time: "8:00 AM",
    venue: "Riverine Training Area",
    image: marchPast,
    imageCaption: "Engineer contingents assemble for the start of the exercise.",
    overview: [
      "When floods, cyclones or building collapses strike, the Corps of Engineers is among the first units called on to help civil authorities. This drill rehearses that response from start to finish.",
      "Engineers will work alongside other Army units and civil agencies through a realistic scenario: a river has burst its banks, a building has collapsed, and a village needs clean water and shelter.",
    ],
    sections: [
      {
        heading: "The Scenario",
        paragraphs: [
          "Teams will rescue people stranded by floodwater using boats, search a collapsed structure for survivors, set up a water purification point and build temporary shelters. Each task is timed and assessed.",
        ],
      },
      {
        heading: "Working With Civil Agencies",
        paragraphs: [
          "Disaster relief only works when everyone involved knows each other's role. The drill brings Corps engineers together with fire service, medical and local government teams to practise communication and handover.",
        ],
      },
    ],
    programme: [
      { time: "8:00 AM", item: "Scenario briefing" },
      { time: "8:30 AM", item: "Flood rescue phase" },
      { time: "11:00 AM", item: "Collapsed structure search" },
      { time: "1:30 PM", item: "Water supply and shelter construction" },
      { time: "4:00 PM", item: "After-action review" },
    ],
  }),
  event({
    slug: "victory-day-commemoration",
    title: "Victory Day Commemoration",
    category: "Commemoration",
    description:
      "A wreath-laying ceremony and parade honouring the engineers who served in the 1971 Liberation War and all members of the Corps who have given their lives for the nation.",
    date: "2026-12-16",
    time: "7:00 AM",
    venue: "Corps Memorial",
    image: nationalMemorial,
    imageCaption: "Floral wreaths laid in tribute to the martyrs of the Liberation War.",
    overview: [
      "On 16 December 1971, Bangladesh won its independence. Victory Day is the country's most important day of remembrance, and the Corps of Engineers marks it by honouring its own members who fought in the Liberation War and those who have died in service since.",
    ],
    sections: [
      {
        heading: "The Ceremony",
        paragraphs: [
          "The day begins with a gun salute and the national anthem, followed by a wreath-laying at the Corps memorial. Veterans, serving soldiers and the families of fallen engineers take part, followed by a one-minute silence.",
          "A parade by the Corps' units follows, with a special prayer for the martyrs.",
        ],
      },
      {
        heading: "Remembering The Engineers Of 1971",
        paragraphs: [
          "During the Liberation War, engineers demolished bridges and rail lines to slow enemy movement and later rebuilt crossings for the advancing allied forces. Their courage and skill helped bring the war to a close in December 1971.",
        ],
      },
    ],
    programme: [
      { time: "7:00 AM", item: "Gun salute and national anthem" },
      { time: "7:20 AM", item: "Wreath-laying at the Corps memorial" },
      { time: "8:00 AM", item: "Victory Day parade" },
      { time: "9:00 AM", item: "Special prayer for the martyrs" },
    ],
    gallery: [
      photo(nationalMemorial, "Wreaths at the memorial", "Wreaths laid at the National Martyrs' Memorial"),
      photo(guardOfHonour, "Guard of honour", "Senior officers inspecting a guard of honour"),
      photo(armedForcesParade, "Victory Day parade", "Soldiers marching with the national flag"),
    ],
  }),
  event({
    slug: "un-peacekeeping-medal-parade",
    title: "UN Peacekeeping Medal Parade",
    category: "Ceremony",
    description:
      "Honouring the returning engineering contingent, whose year on a UN mission included rebuilding roads, constructing bases and keeping water points running for local communities.",
    date: "2027-01-10",
    time: "10:00 AM",
    venue: "Engineer Centre Parade Ground",
    image: marchPast,
    imageCaption: "The returning contingent marches past the saluting dais.",
    overview: [
      "Bangladesh is one of the largest contributors of troops to United Nations peacekeeping, and engineer contingents from the Corps have served on missions across Africa and Asia.",
      "This parade welcomes home an engineering contingent after a year's deployment and presents each member with the UN service medal.",
    ],
    sections: [
      {
        heading: "The Contingent's Work",
        paragraphs: [
          "Peacekeeping engineers rebuild roads and airstrips, construct and maintain camps, drill wells, purify water and clear explosive hazards so that both the mission and local people can move safely. Much of their work continues to serve communities long after they leave.",
        ],
      },
      {
        heading: "The Medal Presentation",
        paragraphs: [
          "After the march-past, the reviewing officer will present the UN medal to the contingent, followed by short accounts from officers and soldiers about their year on the mission.",
        ],
      },
    ],
    gallery: [
      photo(marchPast, "Contingent march-past", "Contingents marching past with flags and saluting"),
      photo(guardOfHonour, "Inspection of the parade", "Senior officers inspecting a guard of honour"),
    ],
  }),
  event({
    slug: "mine-awareness-demining-workshop",
    title: "Mine Awareness & Demining Workshop",
    category: "Workshop",
    description:
      "A public session on the dangers of landmines and unexploded ordnance, and the clearance methods Corps engineers use at home and on peacekeeping missions.",
    date: "2027-01-24",
    time: "11:00 AM",
    venue: "Engineering Training Centre",
    image: deminingTraining,
    imageCaption: "Deminers in protective visors and vests search marked ground.",
    overview: [
      "Landmines and unexploded ordnance keep killing and injuring people long after a conflict ends. Corps of Engineers deminers have cleared hazardous areas on UN missions and trained others to do the same.",
      "This workshop explains, in plain terms, how mines and unexploded bombs are found and made safe, and what anyone should do if they come across a suspicious object.",
    ],
    sections: [
      {
        heading: "What The Workshop Covers",
        paragraphs: [
          "Instructors will walk through the stages of a clearance task: survey, marking, detection, and disposal. Participants will see detectors, protective equipment and remote-controlled robots used by explosive ordnance disposal teams.",
        ],
      },
      {
        heading: "Staying Safe",
        paragraphs: [
          "The most important lesson is simple: never touch a suspicious object. Mark the spot if you can, move away the way you came, and report it to the police or the nearest army unit.",
        ],
      },
    ],
    programme: [
      { time: "11:00 AM", item: "Introduction to landmines and UXO" },
      { time: "11:45 AM", item: "Clearance methods and equipment" },
      { time: "1:00 PM", item: "EOD robot demonstration" },
      { time: "2:00 PM", item: "Questions and answers" },
    ],
    gallery: [
      photo(deminingTraining, "Demining training", "Deminers in protective visors and vests searching marked ground"),
      photo(bombDisposalRobot, "Bomb disposal robot", "Technician in a protective suit beside a remote-controlled robot"),
      photo(eodPartnership, "EOD training partnership", "An officer beside a bomb disposal suit with an instructor"),
      photo(eodRobotTraining, "Working with a tracked robot", "Bomb disposal technician working alongside a tracked robot"),
    ],
  }),
  event({
    slug: "young-officers-engineering-graduation",
    title: "Young Officers' Engineering Course Graduation",
    category: "Graduation",
    description:
      "The passing-out ceremony for newly trained engineer officers, completing their course in combat engineering, construction and field fortifications.",
    date: "2027-02-07",
    time: "3:00 PM",
    venue: "Engineering Training Centre",
    image: passingOutParade,
    imageCaption: "Newly trained officers march at the passing-out parade.",
    overview: [
      "The Young Officers' Course turns newly commissioned lieutenants into engineer officers ready to lead troops in the field. This ceremony marks the end of their training and their move to engineer units across the country.",
    ],
    sections: [
      {
        heading: "The Course",
        paragraphs: [
          "Over several months, the officers study combat engineering, bridging, demolitions, field fortifications, construction management and mine warfare, finishing with a field exercise that tests everything they have learned.",
        ],
      },
      {
        heading: "The Ceremony",
        paragraphs: [
          "Families are invited to watch the passing-out parade, followed by the presentation of course certificates and awards for the best overall officer and best in field engineering.",
        ],
      },
    ],
    gallery: [
      photo(passingOutParade, "Passing-out parade", "Helmeted soldiers marching in formation with rifles"),
      photo(soldierOnTarget, "Field training", "Soldier in camouflage face paint aiming a rifle"),
      photo(jungleOperations, "Final field exercise", "Soldiers moving along a misty jungle trail"),
    ],
  }),
];

export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);
