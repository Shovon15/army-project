import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionHeading from "@/components/common/typography/SectionHeading";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import ScrollFillWord from "@/components/common/animations/ScrollFillWord";
import CtaLine from "@/components/common/cta/CtaLine";
import { cn } from "@/utils/helpers/cn";

import whoWeAre3 from "@/assets/images/who-we-are-image-3.jpg";
import whoWeAre4 from "@/assets/images/who-we-are-image-4.jpg";
import whoWeAre5 from "@/assets/images/who-we-are-image-5.jpg";
import statueImage from "@/assets/images/section-bg-image-shape-2.png";

type WhoWeAreProps = {
  badge?: string;
  titleLines?: string[];
  /** Giant word behind the photos. */
  word?: string;
  /** Left, centre and right photos of the fan. */
  photos?: [StaticImageData | string, StaticImageData | string, StaticImageData | string];
  photoAlts?: [string, string, string];
  statue?: StaticImageData | string;
  cta?: { text: string; linkLabel: string; href: string };
};

/*
 * Each card starts stacked in the centre (--fan-x pulls it there) and fans
 * out to its tilt (--fan-r). The centre card is smaller and sits on top.
 */
const FAN = [
  { x: "88%", r: "-10deg", delay: 0.35, className: "z-[1] -mr-[7%] w-[34%] max-w-[306px]" },
  { x: "0%", r: "0deg", delay: 0.15, className: "z-[2] w-[28%] max-w-[250px]" },
  { x: "-88%", r: "10deg", delay: 0.35, className: "z-[1] -ml-[7%] w-[34%] max-w-[306px]" },
];

const WhoWeAre = ({
  badge = "Who We Are",
  titleLines = ["Where Art History", "And Culture Unite"],
  word = "MUSEON",
  photos = [whoWeAre3, whoWeAre4, whoWeAre5],
  photoAlts = ["Gallery hall with framed paintings", "Visitors studying artworks under a glass roof", "Ornate gallery with a central sculpture"],
  statue = statueImage,
  cta = {
    text: "Reach out and begin your artistic journey today –",
    linkLabel: "Contact Us Today",
    href: "/contact",
  },
}: WhoWeAreProps) => (
  <section className="relative isolate overflow-hidden bg-[#f4f4f4] pt-20 pb-20 text-[#0b0b0b] md:pt-28 md:pb-24">
    <ContentContainer size="narrow" className="h-auto">
      <SectionHeading badge={badge} lines={titleLines} tone="light" />

      <div className="relative mt-12 md:mt-16">
        {/* Giant word fills red while scrolling */}
        <ScrollFillWord
          word={word}
          className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2"
        />

        {/* Photo fan */}
        <Reveal once className="relative z-[1] flex items-center justify-center py-6 md:py-10">
          {FAN.map((card, i) => (
            <div
              key={i}
              className={cn("fan-card relative", card.className)}
              style={
                {
                  "--fan-x": card.x,
                  "--fan-r": card.r,
                  "--reveal-delay": `${card.delay}s`,
                } as CSSProperties
              }
            >
              <div className="fan-card-inner">
                <ImageShine className="aspect-[5/7] border-[5px] border-white bg-white shadow-[0_25px_50px_-20px_rgba(0,0,0,0.45)] md:border-[8px]">
                  <Image
                    src={photos[i]}
                    alt={photoAlts[i]}
                    fill
                    sizes="(min-width: 1024px) 306px, 34vw"
                    className="object-cover"
                  />
                </ImageShine>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <CtaLine {...cta} tone="light" className="relative z-[3] mt-10 md:mt-14" />
    </ContentContainer>

    {/* Statue rises from the bottom-left corner */}
    <Reveal
      once
      className="pointer-events-none absolute bottom-0 left-[1%] z-[2] hidden w-[clamp(150px,17vw,300px)] md:block"
    >
      <div className="reveal-rise" style={{ "--reveal-delay": "0.3s" } as CSSProperties}>
        <Image
          src={statue}
          alt=""
          sizes="(min-width: 768px) 17vw, 0px"
          className="h-auto w-full"
        />
      </div>
    </Reveal>
  </section>
);

export default WhoWeAre;
