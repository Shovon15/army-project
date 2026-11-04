import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionHeading from "@/components/common/typography/SectionHeading";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { ColumnIcon, MaskIcon, PaletteIcon } from "@/assets/icons/MuseumIcons";
import { cn } from "@/utils/helpers/cn";

// Exhibition photos
import exhibitionImage1 from "@/assets/images/exhibition-item-image-1.jpg";
import exhibitionImage2 from "@/assets/images/exhibition-item-image-2.jpg";
import exhibitionImage3 from "@/assets/images/exhibition-item-image-3.jpg";

export type Exhibition = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  image: StaticImageData | string;
};

type CurrentExhibitionsProps = {
  badge?: string;
  titleLines?: string[];
  exhibitions?: Exhibition[];
};

const DEFAULT_EXHIBITIONS: Exhibition[] = [
  {
    icon: MaskIcon,
    title: "Renaissance Treasures",
    description: "A journey through Europe's greatest artistic achievements.",
    image: exhibitionImage1,
  },
  {
    icon: PaletteIcon,
    title: "Contemporary Visions",
    description: "Bold new voices redefining what art can say today.",
    image: exhibitionImage2,
  },
  {
    icon: ColumnIcon,
    title: "Ancient Civilisations",
    description: "Relics and stories from the empires that shaped history.",
    image: exhibitionImage3,
  },
];

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

/** Icon + title + text half of a column. Red glow rises on hover. */
const InfoHalf = ({
  item,
  position,
}: {
  item: Exhibition;
  position: "top" | "bottom";
}) => {
  const Icon = item.icon;
  return (
    <div
      className={cn(
        "relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center",
        "bg-gradient-to-b from-surface-card to-surface-dark",
        position === "top" ? "pt-14 pb-8" : "pt-8 pb-14",
      )}
    >
      {/* Glow that swells from the outer edge on hover */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 h-full scale-y-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100",
          // Glow grows from the edge that touches the image half.
          position === "top"
            ? "bottom-0 origin-bottom bg-[radial-gradient(90%_80%_at_50%_100%,rgb(var(--primary-rgb)/0.35),transparent_70%)]"
            : "top-0 origin-top bg-[radial-gradient(90%_80%_at_50%_0%,rgb(var(--primary-rgb)/0.35),transparent_70%)]",
        )}
      />
      <span className="relative [perspective:400px]">
        <Icon className="icon-flip h-12 w-12 text-white md:h-14 md:w-14" />
      </span>
      <h3 className="relative mt-7 font-heading text-[clamp(1rem,1.2vw,1.3rem)] leading-title text-white uppercase">
        {item.title}
      </h3>
      <p className="relative mx-auto mt-3 max-w-[280px] font-dmSans text-[15px] leading-text text-white/80">
        {item.description}
      </p>
    </div>
  );
};

const ImageHalf = ({ item, d }: { item: Exhibition; d: number }) => (
  <ImageShine className="h-full">
    <div className="reveal-zoom absolute inset-0" style={delay(d)}>
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
      />
    </div>
  </ImageShine>
);

/**
 * Stadium-shaped column split into an info half and an image half. Odd
 * columns put the image on top. Wipes up on scroll with its rounded shape.
 */
const ExhibitionColumn = ({
  item,
  index,
}: {
  item: Exhibition;
  index: number;
}) => {
  const imageFirst = index % 2 === 1;
  const d = 0.15 + index * 0.18;
  return (
    <article
      className="group reveal-clip grid aspect-[407/593] grid-rows-2 gap-[10px] overflow-hidden rounded-[200px]"
      style={{ ...delay(d), "--clip-r": "200px" } as CSSProperties}
    >
      {imageFirst ? (
        <>
          <ImageHalf item={item} d={d} />
          <InfoHalf item={item} position="bottom" />
        </>
      ) : (
        <>
          <InfoHalf item={item} position="top" />
          <ImageHalf item={item} d={d} />
        </>
      )}
    </article>
  );
};

const CurrentExhibitions = ({
  badge = "Current Exhibitions",
  titleLines = ["Inspiring Exhibitions", "Happening Right Now"],
  exhibitions = DEFAULT_EXHIBITIONS,
}: CurrentExhibitionsProps) => (
  <section className="relative isolate overflow-hidden bg-surface-dark py-20 text-white md:py-28">
    <GlowBackground />

    <ContentContainer size="narrow" className="h-auto">
      <SectionHeading badge={badge} lines={titleLines} tone="dark" />

      <Reveal
        once
        className="mx-auto mt-14 grid max-w-[420px] gap-[30px] sm:max-w-none sm:grid-cols-2 md:mt-16 lg:grid-cols-3"
      >
        {exhibitions.map((item, i) => (
          <div
            key={item.title}
            className={cn(
              i === 2 && "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full",
            )}
          >
            <ExhibitionColumn item={item} index={i} />
          </div>
        ))}
      </Reveal>
    </ContentContainer>
  </section>
);

export default CurrentExhibitions;
