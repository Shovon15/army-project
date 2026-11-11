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

/** An item in the coverflow slider: an image, or a video with a poster frame. */
export type GalleryMedia =
  | { type: "image"; src: StaticImageData | string; alt: string; caption?: string }
  | {
      type: "video";
      /** .mp4 URL (put files in /public/videos and use "/videos/name.mp4"). */
      src: string;
      poster?: StaticImageData | string;
      alt: string;
      caption?: string;
    };

// TODO: replace the sample videos (CC0 clips from MDN) with the Corps' own
// footage, e.g. "/videos/bridge-launch.mp4" in /public/videos.
export const GALLERY_MEDIA: GalleryMedia[] = [
  {
    type: "image",
    src: armedForcesParade,
    alt: "Soldiers marching with the national flag and regimental colours",
    caption: "Armed Forces Day Parade",
  },
  {
    type: "image",
    src: fieldTrainingVisit,
    alt: "Visitors meeting soldiers in camouflage at a jungle field training camp",
    caption: "Field Training Visit",
  },
  {
    type: "image",
    src: jungleOperations,
    alt: "Soldiers with helmet lamps moving along a misty jungle trail",
    caption: "Jungle Operations Training",
  },
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: guardOfHonour,
    alt: "Video highlights",
    caption: "Video Highlights",
  },
  {
    type: "image",
    src: guardOfHonour,
    alt: "Senior officers inspecting a guard of honour",
    caption: "Guard Of Honour",
  },
  {
    type: "image",
    src: bombDisposalRobot,
    alt: "Bomb disposal technician in a protective suit beside a remote-controlled robot",
    caption: "Bomb Disposal Robotics",
  },
  {
    type: "image",
    src: ceremonialMarch,
    alt: "Helmeted soldiers marching in formation with rifles",
    caption: "Ceremonial March",
  },
  {
    type: "image",
    src: soldierOnTarget,
    alt: "Soldier in camouflage face paint aiming a rifle with a red-dot sight",
    caption: "Ready On Target",
  },
  {
    type: "image",
    src: deminingTraining,
    alt: "Deminers in protective visors and vests searching marked ground",
    caption: "Demining Training",
  },
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    poster: jungleOperations,
    alt: "Video from the field",
    caption: "On The Ground",
  },
  {
    type: "image",
    src: eodPartnership,
    alt: "A Bangladesh Army officer beside a bomb disposal suit with an instructor",
    caption: "EOD Training Partnership",
  },
  {
    type: "image",
    src: marchPast,
    alt: "Contingents marching past with flags and saluting",
    caption: "Contingent March-Past",
  },
  {
    type: "image",
    src: eodRobotTraining,
    alt: "Bomb disposal technician working alongside a tracked robot",
    caption: "Explosive Ordnance Disposal",
  },
  {
    type: "image",
    src: nationalMemorial,
    alt: "Wreaths laid at the National Martyrs' Memorial",
    caption: "National Martyrs' Memorial",
  },
];
