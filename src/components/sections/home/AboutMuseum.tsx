import Image, { type StaticImageData } from "next/image";
import ContentContainer from "@/components/layout/container/contentContainer";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import SectionBadge from "@/components/common/typography/SectionBadge";
import AnimatedHeading from "@/components/common/typography/AnimatedHeading";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import { BridgeIcon, ShieldIcon } from "@/assets/icons/EngineerIcons";
import routes from "@/config/routes";

import mainImage from "@/assets/images/about-us.jpg";
import archImage from "@/assets/images/event-2.jpg";
import corpsLogo from "@/assets/images/logo.png";
import handImage from "@/assets/images/about/hand.png";

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
};

type AboutMuseumProps = {
  badge?: string;
  titleLines?: string[];
  description?: string;
  features?: Feature[];
  ctaLabel?: string;
  ctaHref?: string;
  person?: { name: string; role: string; image: StaticImageData | string };
  images?: {
    main: StaticImageData | string;
    arch: StaticImageData | string;
    mainAlt?: string;
    archAlt?: string;
  };
};

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: BridgeIcon,
    title: "Combat Engineering",
    text: "Bridging, field defences and mine clearance that keep the Army moving.",
  },
  {
    icon: ShieldIcon,
    title: "Nation Building",
    text: "Roads, infrastructure, disaster relief and UN peacekeeping missions.",
  },
];

const AboutMuseum = ({
  badge = "About The Corps",
  titleLines = ["Building The Nation", "In War And In Peace"],
  description = "The Corps of Engineers is the engineering arm of the Bangladesh Army. Our engineers bridge rivers, build roads and defences and clear mines in support of the Army, and serve the nation beyond the battlefield through infrastructure projects, disaster relief and UN peacekeeping missions around the world.",
  features = DEFAULT_FEATURES,
  ctaLabel = "More About Us",
  ctaHref = routes.about,
  person = {
    name: "Corps of Engineers",
    role: "Bangladesh Army",
    image: corpsLogo,
  },
  images = {
    main: mainImage,
    arch: archImage,
    mainAlt: "Senior officers inspecting a guard of honour of Bangladesh Army engineers",
    archAlt: "Bangladesh Army contingent marching with flags",
  },
}: AboutMuseumProps) => {
  return (
    <section className="relative overflow-hidden bg-surface-light py-10 text-ink min-[1025px]:py-[90px]">
      {/* Decorative sculpted hands, bottom-right. The file is a transparent
          284×313 PNG: it is never drawn wider than 284px (larger = blurry),
          h-auto keeps the ratio, and unoptimized serves the original PNG
          without re-compression. */}
      <Image
        src={handImage}
        alt=""
        aria-hidden
        unoptimized
        className="pointer-events-none absolute right-[-40px] bottom-0 hidden h-auto w-[clamp(200px,15vw,284px)] select-none xl:block"
      />

      <ContentContainer
        size="narrow"
        className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-0"
      >
        {/* ---------- Images ----------
            Proportions follow the reference layout: the arch column is
            20% + 156px wide and overlaps the main photo by 156px; the main
            photo is 80% wide. Native image ratios: main 480×564, arch 257×376.
            Mobile: 20% + 80px wide, 80px overlap, thinner border. */}
        <Reveal once className="flex w-full items-center lg:pr-[35px]">
          <div
            className="relative z-[2] w-[calc(20%+80px)] shrink-0 -mr-[80px] md:w-[calc(20%+156px)] md:-mr-[156px]"
            {...revealItem("left", 80, 0.25, 1.2)}
          >
            <div className="overflow-hidden rounded-t-[150px] border-[5px] border-white bg-white md:border-[10px]">
              <ImageShine className="aspect-[257/376]">
                <Image
                  src={images.arch}
                  alt={images.archAlt ?? ""}
                  fill
                  sizes="(min-width: 768px) 280px, 40vw"
                  className="object-cover"
                />
              </ImageShine>
            </div>
          </div>

          <div className="w-[80%]" {...revealItem("right", 80, 0, 1.2)}>
            <ImageShine className="aspect-[480/564] rounded-[20px]">
              <Image
                src={images.main}
                alt={images.mainAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 500px, 80vw"
                // Landscape photo in a portrait frame: keep the inspecting
                // officers (left) and the guard of honour in view.
                className="object-cover object-[30%_center]"
              />
            </ImageShine>
          </div>
        </Reveal>

        {/* ---------- Copy ---------- */}
        <Reveal once className="max-w-[640px]">
          <div {...revealItem("down", 30, 0, 0.9)}>
            <SectionBadge>{badge}</SectionBadge>
          </div>

          <AnimatedHeading
            lines={titleLines}
            className="mt-5 text-[clamp(1.5rem,1.9vw,2.4rem)]"
          />

          <p
            className="mt-6 font-dmSans text-[clamp(15px,1vw,17px)] leading-text text-ink-muted"
            {...revealItem("down", 30, 0.35, 1)}
          >
            {description}
          </p>

          <ul className="mt-9 grid gap-8 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="group flex gap-4"
                {...revealItem("down", 30, 0.45 + i * 0.12, 1)}
              >
                <Icon className="h-12 w-12 shrink-0 text-ink transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg]" />
                <div>
                  <h3 className="font-boldCond text-[clamp(0.95rem,1vw,1.15rem)] leading-title uppercase">
                    {title}
                  </h3>
                  <p className="mt-2 font-dmSans text-[15px] leading-text text-ink-muted">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div
            className="mt-10 h-px w-full origin-left bg-black/10"
            {...revealItem("left", 0, 0.6, 1)}
          />

          <div
            className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6"
            {...revealItem("down", 30, 0.7, 1)}
          >
            <PrimaryButton href={ctaHref} arrow variant="dark">
              {ctaLabel}
            </PrimaryButton>

            <div className="flex items-center gap-4">
              <Image
                src={person.image}
                alt={person.name}
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded-full object-cover"
              />
              <div>
                <p className="font-boldCond text-[clamp(0.95rem,1vw,1.15rem)] leading-title uppercase">
                  {person.name}
                </p>
                <p className="mt-1.5 font-dmSans text-[15px] text-ink-muted">
                  {person.role}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </ContentContainer>
    </section>
  );
};

export default AboutMuseum;
