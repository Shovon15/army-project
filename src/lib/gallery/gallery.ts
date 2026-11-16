import type { StaticImageData } from "next/image";

import museumImage from "@/assets/images/museum-image.jpg";
import museumImage1 from "@/assets/images/museum-image-1.jpg";
import collection1 from "@/assets/images/collection-item-image-1.jpg";
import collection2 from "@/assets/images/collection-item-image-2.jpg";
import collection3 from "@/assets/images/collection-item-image-3.jpg";
import exhibition1 from "@/assets/images/exhibition-item-image-1.jpg";
import exhibition2 from "@/assets/images/exhibition-item-image-2.jpg";
import exhibition3 from "@/assets/images/exhibition-item-image-3.jpg";
import whoWeAre3 from "@/assets/images/who-we-are-image-3.jpg";
import whoWeAre4 from "@/assets/images/who-we-are-image-4.jpg";
import whoWeAre5 from "@/assets/images/who-we-are-image-5.jpg";
import post1 from "@/assets/images/post-1.jpg";

// Corps of Engineers photos used by the gallery slider (GALLERY_MEDIA).
import armedForcesParade from "@/assets/images/event-1.jpg";
import marchPast from "@/assets/images/event-2.jpg";
import ceremonialMarch from "@/assets/images/event-3.jpg";
import deminingTraining from "@/assets/images/event-4.webp";
import nationalMemorial from "@/assets/images/event-5.jpg";
import fieldTrainingVisit from "@/assets/images/home.jpg";
import guardOfHonour from "@/assets/images/about-us.jpg";
import soldierOnTarget from "@/assets/images/a-soldier-engaging-a-target.jpg";
import jungleOperations from "@/assets/images/soldiers-2.jpg";
import bombDisposalRobot from "@/assets/images/images.jpg";
import eodPartnership from "@/assets/images/image.webp";
import eodRobotTraining from "@/assets/images/1744071310341.png";

export type GalleryImage = {
  src: StaticImageData | string;
  alt: string;
  /** Short caption shown on hover and in the lightbox. */
  caption: string;
};

// TODO: replace with the museum's own gallery photos (or load from the CMS).
export const GALLERY_IMAGES: GalleryImage[] = [
  { src: museumImage, alt: "Visitor admiring paintings in the gallery", caption: "Grand Heritage Gallery" },
  { src: whoWeAre4, alt: "Visitors studying artworks under a glass roof", caption: "The Glass Atrium" },
  { src: collection1, alt: "Marble sculptures on display", caption: "Sculpture Gallery" },
  { src: museumImage1, alt: "Domed rotunda hall with classical statues", caption: "The Rotunda" },
  { src: exhibition1, alt: "Renaissance paintings in a gilded hall", caption: "Renaissance Treasures" },
  { src: whoWeAre3, alt: "Gallery hall with framed paintings", caption: "Portrait Hall" },
  { src: collection2, alt: "Framed photographs on a gallery wall", caption: "Photography Collection" },
  { src: exhibition2, alt: "Contemporary artworks in a bright gallery", caption: "Contemporary Visions" },
  { src: whoWeAre5, alt: "Ornate gallery with a central sculpture", caption: "The Ornate Salon" },
  { src: collection3, alt: "Historic artefacts in display cases", caption: "Cultural Heritage" },
  { src: exhibition3, alt: "Ancient relics on display", caption: "Ancient Civilisations" },
  { src: post1, alt: "Classical paintings on a museum wall", caption: "Classical Art" },
];

/** Optional grouping for a future category filter (the slider ignores it). */
export type GalleryCategory =
  | "Operations"
  | "Training"
  | "UN Missions"
  | "Exhibits"
  | "Events";

/** An item in the coverflow slider: an image, or a video with a poster frame. */
export type GalleryMedia =
  | {
      type: "image";
      src: StaticImageData | string;
      alt: string;
      caption?: string;
      category?: GalleryCategory;
    }
  | {
      type: "video";
      /** .mp4 URL (put files in /public/videos and use "/videos/name.mp4"). */
      src: string;
      poster?: StaticImageData | string;
      alt: string;
      caption?: string;
      category?: GalleryCategory;
    };

/*
  Field Operations Gallery (home page + /gallery).
  Captions describe the scene only: no technical details of devices.
  Alt text matches each caption and what the photo actually shows.

  TODO: several photos carry third-party watermarks or credits (event-1.jpg,
  event-3.jpg, event-5.jpg, 1744071310341.png). Confirm usage rights or swap
  in the Corps' own photos before launch.
  TODO: replace the sample videos (CC0 clips from MDN) with the Corps' own
  footage, e.g. "/videos/bridge-launch.mp4" in /public/videos, then write
  their captions and alt text.
*/
export const GALLERY_MEDIA: GalleryMedia[] = [
  {
    type: "image",
    src: armedForcesParade,
    alt: "Soldiers in camouflage and white gloves marching with Bangladesh national flags at a parade",
    caption: "National Parade Colour Party",
    category: "Events",
  },
  {
    type: "image",
    src: fieldTrainingVisit,
    alt: "Visitors meeting soldiers in camouflage face paint at a jungle field training camp",
    caption: "Field Training Camp Visit",
    category: "Training",
  },
  {
    type: "image",
    src: jungleOperations,
    alt: "Soldiers with helmet torches advancing along a misty jungle trail",
    caption: "Jungle Patrol Exercise",
    category: "Training",
  },
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: guardOfHonour,
    // TODO: sample clip; caption and alt to be provided with the real footage.
    alt: "Sample video clip, caption to be provided",
    caption: "Caption to be provided",
  },
  {
    type: "image",
    src: guardOfHonour,
    alt: "Soldiers in helmets and body armour advancing through a misty jungle stream bed",
    caption: "Jungle Operations Training",
    category: "Training",
  },
  {
    type: "image",
    src: bombDisposalRobot,
    alt: "EOD technician in a protective bomb suit walking beside a remote-controlled disposal robot",
    caption: "EOD Technician with Disposal Robot",
    category: "Training",
  },
  {
    type: "image",
    src: ceremonialMarch,
    alt: "Helmeted soldiers in goggles marching in formation with rifles",
    caption: "Parade Contingent on the March",
    category: "Events",
  },
  {
    type: "image",
    src: soldierOnTarget,
    alt: "Soldier in camouflage face paint looking through a rifle sight",
    caption: "Marksmanship Training",
    category: "Training",
  },
  {
    type: "image",
    src: deminingTraining,
    alt: "Deminers in blue protective vests and visors searching marked ground during a training exercise",
    caption: "Demining Training Exercise",
    category: "Training",
  },
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    poster: jungleOperations,
    // TODO: sample clip; caption and alt to be provided with the real footage.
    alt: "Sample video clip, caption to be provided",
    caption: "Caption to be provided",
  },
  {
    type: "image",
    src: eodPartnership,
    alt: "A Bangladesh Army officer and an instructor standing either side of an EOD protective suit",
    caption: "EOD Protective Suit Familiarisation",
    category: "Training",
  },
  {
    type: "image",
    src: marchPast,
    alt: "Army contingent saluting as it marches past with flags during a ceremonial parade",
    caption: "Ceremonial March-Past",
    category: "Events",
  },
  {
    type: "image",
    src: eodRobotTraining,
    alt: "EOD technician in a protective bomb suit working alongside a tracked remote-controlled robot",
    caption: "EOD Countermeasures Training",
    category: "Training",
  },
  {
    type: "image",
    src: nationalMemorial,
    alt: "Floral wreaths laid at the National Martyrs' Memorial in Savar",
    caption: "Tribute at the National Martyrs' Memorial",
    category: "Events",
  },
];
