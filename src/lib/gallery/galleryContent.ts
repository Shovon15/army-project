/* ---------------------------------------------------------------------------
   Gallery section text (components/sections/gallery/GallerySlider.tsx).
   The slider uses `en` by default; props still override every string.
--------------------------------------------------------------------------- */

type GalleryCopy = {
  eyebrow: string;
  /** One entry per heading line. */
  titleLines: string[];
  intro: string;
  openViewer: string;
  /** Prefix for each slide's button label: "Open {caption}". */
  openItem: string;
};

export const galleryContent: { en: GalleryCopy; bn: GalleryCopy } = {
  en: {
    eyebrow: "In the Field",
    titleLines: ["Field Operations Gallery"],
    intro:
      "Moments from EOD operations, training, UN missions and the museum's exhibits.",
    openViewer: "Open gallery viewer",
    openItem: "Open in gallery viewer",
  },
  // TODO(bn): add the Bangla translation. Keep the same keys.
  bn: {
    eyebrow: "TODO",
    titleLines: ["TODO"],
    intro: "TODO",
    openViewer: "TODO",
    openItem: "TODO",
  },
};
