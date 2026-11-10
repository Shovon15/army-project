import type { StaticImageData } from "next/image";

import collectionImage1 from "@/assets/images/collection-item-image-1.jpg";
import collectionImage2 from "@/assets/images/collection-item-image-2.jpg";
import collectionImage3 from "@/assets/images/collection-item-image-3.jpg";
import exhibitionImage1 from "@/assets/images/exhibition-item-image-1.jpg";
import exhibitionImage2 from "@/assets/images/exhibition-item-image-2.jpg";
import exhibitionImage3 from "@/assets/images/exhibition-item-image-3.jpg";
import museumImage from "@/assets/images/museum-image.jpg";
import museumImage1 from "@/assets/images/museum-image-1.jpg";
import whoWeAre3 from "@/assets/images/who-we-are-image-3.jpg";
import whoWeAre4 from "@/assets/images/who-we-are-image-4.jpg";
import whoWeAre5 from "@/assets/images/who-we-are-image-5.jpg";
import post1 from "@/assets/images/post-1.jpg";

export type CollectionStat = { value: number; suffix: string; label: string };
export type CollectionFeature = { title: string; text: string };

export type MuseumCollection = {
  slug: string;
  title: string;
  /** Short line shown on the cards. */
  description: string;
  href: string;
  image: StaticImageData | string;
  /** Detail page */
  intro: string;
  highlightsText: string;
  highlights: string[];
  highlightImage: StaticImageData | string;
  stats: CollectionStat[];
  featuredText: string;
  featured: CollectionFeature[];
};

// Detail copy shared by every collection until each has its own.
// TODO: sample copy and figures. Replace with the curators' real text (or CMS).
const SHARED = {
  highlightsText:
    "Our collection brings together rare artifacts, ceremonial objects, textiles, manuscripts and decorative arts, each chosen for the story it tells about the people who made and used it.",
  highlights: [
    "World Class Art Collections",
    "Expert Curated Art Exhibitions",
    "Rare Historical Artifact Displays",
    "Preserving History Through Art",
  ],
  stats: [
    { value: 10, suffix: "k+", label: "Artworks Preserved" },
    { value: 45, suffix: "+", label: "Curated Collections" },
    { value: 12, suffix: "+", label: "Exhibition Galleries" },
  ],
  featuredText:
    "Thoughtfully arranged to appeal to visitors of all ages, our featured galleries guide you from the old masters to the artists shaping art today.",
  featured: [
    {
      title: "Renaissance Masterpieces",
      text: "Timeless paintings and sculptures from one of the most influential periods in art history.",
    },
    {
      title: "Modern Art Collection",
      text: "Bold, experimental work from the 20th century that broke the rules of tradition.",
    },
    {
      title: "Contemporary Gallery",
      text: "Installations, mixed media and digital art from the voices of today.",
    },
  ],
};

const make = (
  slug: string,
  data: Pick<MuseumCollection, "title" | "description" | "image" | "intro" | "highlightImage">,
): MuseumCollection => ({ slug, href: `/collection/${slug}`, ...SHARED, ...data });

// Slugs match the footer's "Collections" links.
export const COLLECTIONS: MuseumCollection[] = [
  make("sculpture-gallery", {
    title: "Sculpture Gallery",
    description: "Explore remarkable sculptures crafted across centuries and cultures.",
    image: collectionImage1,
    highlightImage: whoWeAre4,
    intro:
      "Our Sculpture Gallery brings together marble, bronze and stone works from ancient civilisations to modern studios. Walk among figures carved by masters and discover how artists across the world have shaped form, movement and emotion in three dimensions.",
  }),
  make("photography", {
    title: "Photography Collection",
    description: "Moments in light and shadow from pioneering photographers.",
    image: collectionImage2,
    highlightImage: whoWeAre3,
    intro:
      "From early silver prints to contemporary large-format work, our Photography Collection traces how the camera changed the way we record history, people and places.",
  }),
  make("cultural-heritage", {
    title: "Cultural Heritage",
    description: "Artefacts and stories that carry the memory of civilisations.",
    image: collectionImage3,
    highlightImage: museumImage1,
    intro:
      "The Cultural Heritage collection preserves everyday and ceremonial objects that connect us to the traditions, beliefs and craftsmanship of communities across the centuries.",
  }),
  make("classical-art", {
    title: "Classical Art",
    description: "Masterpieces from the great painters of the classical era.",
    image: exhibitionImage1,
    highlightImage: museumImage,
    intro:
      "Our Classical Art collection celebrates the balance, harmony and beauty of the classical tradition, with paintings and sculptures that have inspired artists for generations.",
  }),
  make("contemporary", {
    title: "Contemporary Collection",
    description: "Bold works from today's artists that challenge and inspire.",
    image: exhibitionImage2,
    highlightImage: whoWeAre5,
    intro:
      "The Contemporary Collection showcases artists working today: installations, mixed media and digital pieces that ask new questions about identity, society and the world we share.",
  }),
  make("historical-artifacts", {
    title: "Historical Artifacts",
    description: "Objects that carry the everyday stories of past civilisations.",
    image: exhibitionImage3,
    highlightImage: post1,
    intro:
      "Tools, coins, jewellery and manuscripts: our Historical Artifacts collection reveals how people lived, traded and believed, one carefully preserved object at a time.",
  }),
];

export const getCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug) ?? null;
