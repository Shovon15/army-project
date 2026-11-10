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
