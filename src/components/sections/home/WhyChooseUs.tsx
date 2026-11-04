import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionHeading from "@/components/common/typography/SectionHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import CountUp from "@/components/common/animations/CountUp";
import {
  EaselIcon,
  PaletteIcon,
  TicketIcon,
  VaseIcon,
} from "@/assets/icons/MuseumIcons";

// Statue-in-circle artwork
import whyChooseImage from "@/assets/images/why-choose-image.png";

type Stat = {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  title: string;
  text: string;
};

type WhyChooseUsProps = {
  badge?: string;
  titleLines?: string[];
  description?: string;
  stats?: [Stat, Stat, Stat, Stat];
  image?: StaticImageData | string;
};

const DEFAULT_STATS: [Stat, Stat, Stat, Stat] = [
  {
    icon: EaselIcon,
    value: 500,
    suffix: "+",
    title: "Artworks Displayed",
    text: "A diverse collection of paintings, sculptures, and installations.",
  },
  {
    icon: VaseIcon,
    value: 120,
    suffix: "+",
    title: "Curated Exhibitions",
    text: "Fresh and thoughtfully designed showcases every year.",
  },
  {
    icon: PaletteIcon,
    value: 75,
    suffix: "+",
    title: "Artists Featured",
    text: "From emerging talents to world-renowned creators.",
  },
  {
    icon: TicketIcon,
    value: 1,
    suffix: "M+",
    title: "Annual Visitors",
    text: "A growing global community of art lovers and explorers.",
  },
];

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

const StatItem = ({
  stat,
  from,
  order,
}: {
  stat: Stat;
  from: "left" | "right";
  order: number;
}) => {
  const Icon = stat.icon;
  const d = 0.2 + order * 0.15;
  return (
    <div className="group" {...revealItem(from, 60, d, 1.1)}>
      <div className="flex items-center gap-4">
        <Icon className="icon-wobble h-12 w-12 shrink-0 text-[#0b0b0b] md:h-14 md:w-14" />
        <CountUp
          to={stat.value}
          suffix={stat.suffix}
          duration={2800}
          className="font-heading text-[clamp(2rem,2.8vw,2.55rem)] leading-none text-[#0b0b0b] tabular-nums"
        />
      </div>
      <h3 className="mt-5 font-heading text-[clamp(0.95rem,1.05vw,1.15rem)] leading-[1.3] text-[#0b0b0b] uppercase transition-colors duration-300 group-hover:text-[var(--primary)]">
        {stat.title}
      </h3>
      <span
        aria-hidden
        className="reveal-draw mt-5 block h-px w-full bg-black/10"
        style={delay(d + 0.2)}
      />
      <p className="mt-5 max-w-[300px] font-dmSans text-[15px] leading-[1.7] text-[#5b5b5b]">
        {stat.text}
      </p>
    </div>
  );
};

/** Statue-in-circle artwork with slowly spinning rings behind it. */
const Centerpiece = ({ image }: { image: StaticImageData | string }) => (
  <div className="relative mx-auto aspect-[524/549] w-full max-w-[460px] lg:max-w-[min(500px,32vw)]">
    {/* Decorative rings with an orbiting dot (spin slowly) */}
    <div
      className="reveal-pop absolute top-[-4.5%] left-[-4%] aspect-square w-[108%]"
      style={delay(0)}
    >
      <div className="spin-slow absolute inset-0 rounded-full border border-black/10">
        <span className="absolute top-1/2 -left-[5px] h-2.5 w-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(230,31,37,0.6)]" />
      </div>
      <div className="spin-slow-reverse absolute inset-[4%] rounded-full border border-dashed border-black/10" />
    </div>

    {/* Artwork pops in, then floats */}
    <div className="reveal-pop absolute inset-0" style={delay(0.2)}>
      <div className="float-soft h-full w-full">
        <Image
          src={image}
          alt="Classical marble bust framed by a gallery view"
          fill
          sizes="(min-width: 1024px) 32vw, 90vw"
          className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)]"
        />
      </div>
    </div>
  </div>
);

const WhyChooseUs = ({
  badge = "Why Choose Us",
  titleLines = ["Why Visitors Choose Our", "Museum Experience"],
  description = "Discover a space where creativity meets heritage. Our museum and art gallery is dedicated to preserving cultural stories while offering immersive, modern experiences that connect visitors with art in meaningful ways.",
  stats = DEFAULT_STATS,
  image = whyChooseImage,
}: WhyChooseUsProps) => (
  <section className="relative overflow-hidden bg-[#f4f4f4] py-20 text-[#0b0b0b] md:py-28">
    <ContentContainer size="narrow" className="h-auto">
      {/* Header row */}
      <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          badge={badge}
          lines={titleLines}
          align="left"
          tone="light"
        />
        <Reveal once>
          <p
            className="font-dmSans text-[clamp(15px,1vw,17px)] leading-[1.7] text-[#5b5b5b] lg:pb-2"
            {...revealItem("down", 30, 0.3, 1)}
          >
            {description}
          </p>
        </Reveal>
      </div>

      {/* Stats around the centrepiece */}
      <Reveal
        once
        className="mt-16 grid items-center gap-x-10 gap-y-14 md:mt-20 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-[clamp(24px,3vw,56px)]"
      >
        <div className="grid gap-14 lg:order-1">
          <StatItem stat={stats[0]} from="left" order={0} />
          <StatItem stat={stats[1]} from="left" order={2} />
        </div>

        <div className="md:col-span-2 md:row-start-1 lg:order-2 lg:col-span-1 lg:row-auto lg:w-[min(500px,32vw)]">
          <Centerpiece image={image} />
        </div>

        <div className="grid gap-14 lg:order-3 lg:justify-items-end lg:[&>*]:w-full lg:[&>*]:max-w-[300px]">
          <StatItem stat={stats[2]} from="right" order={1} />
          <StatItem stat={stats[3]} from="right" order={3} />
        </div>
      </Reveal>
    </ContentContainer>
  </section>
);

export default WhyChooseUs;
