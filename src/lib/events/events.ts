import type { MuseumEvent } from "@/components/sections/home/OurEvents";

import armedForcesParade from "@/assets/images/event-1.jpg";
import marchPast from "@/assets/images/event-2.jpg";
import passingOutParade from "@/assets/images/event-3.jpg";
import deminingTraining from "@/assets/images/event-4.webp";
import nationalMemorial from "@/assets/images/event-5.jpg";

/**
 * Bangladesh Army Corps of Engineers events, soonest first.
 *
 * TODO: sample events built around the Corps' real roles (bridging, disaster
 * response, demining, UN peacekeeping engineering, training) and national days
 * (Armed Forces Day 21 Nov, Victory Day 16 Dec). Confirm dates and venues and
 * replace the placeholder photos with the Corps' own before going live.
 */
export const EVENTS: MuseumEvent[] = [
  {
    title: "Armed Forces Day Engineering Display",
    description:
      "Marking Armed Forces Day with a public display of bridging equipment, earth-moving plant and field engineering vehicles, with live demonstrations by Corps engineers.",
    date: "2026-11-21",
    time: "10:00 AM",
    venue: "Dhaka Cantonment",
    href: "/events/armed-forces-day-engineering-display",
    image: armedForcesParade,
  },
  {
    title: "Bridge Launching Demonstration",
    description:
      "Watch engineers assemble and launch a modular panel bridge against the clock, the same drill used to restore crossings after floods or when a road link is cut.",
    date: "2026-11-28",
    time: "9:30 AM",
    venue: "Engineer Training Ground",
    href: "/events/bridge-launching-demonstration",
    image: passingOutParade,
  },
  {
    title: "Disaster Response & Flood Rescue Drill",
    description:
      "A joint exercise on flood rescue, search in collapsed structures, emergency water supply and rapid shelter construction, the skills the Corps brings to national disaster relief.",
    date: "2026-12-05",
    time: "8:00 AM",
    venue: "Riverine Training Area",
    href: "/events/disaster-response-flood-rescue-drill",
    image: marchPast,
  },
  {
    title: "Victory Day Commemoration",
    description:
      "A wreath-laying ceremony and parade honouring the engineers who served in the 1971 Liberation War and all members of the Corps who have given their lives for the nation.",
    date: "2026-12-16",
    time: "7:00 AM",
    venue: "Corps Memorial",
    href: "/events/victory-day-commemoration",
    image: nationalMemorial,
  },
  {
    title: "UN Peacekeeping Medal Parade",
    description:
      "Honouring the returning engineering contingent, whose year on a UN mission included rebuilding roads, constructing bases and keeping water points running for local communities.",
    date: "2027-01-10",
    time: "10:00 AM",
    venue: "Engineer Centre Parade Ground",
    href: "/events/un-peacekeeping-medal-parade",
    image: marchPast,
  },
  {
    title: "Mine Awareness & Demining Workshop",
    description:
      "A public session on the dangers of landmines and unexploded ordnance, and the clearance methods Corps engineers use at home and on peacekeeping missions.",
    date: "2027-01-24",
    time: "11:00 AM",
    venue: "Engineering Training Centre",
    href: "/events/mine-awareness-demining-workshop",
    image: deminingTraining,
  },
  {
    title: "Young Officers' Engineering Course Graduation",
    description:
      "The passing-out ceremony for newly trained engineer officers, completing their course in combat engineering, construction and field fortifications.",
    date: "2027-02-07",
    time: "3:00 PM",
    venue: "Engineering Training Centre",
    href: "/events/young-officers-engineering-graduation",
    image: passingOutParade,
  },
];
