import Image, { type StaticImageData } from "next/image";
import type { ComponentType, CSSProperties } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionHeading from "@/components/common/typography/SectionHeading";
import ImageShine from "@/components/common/image/ImageShine";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  PinterestIcon,
  XIcon,
} from "@/assets/icons";

import team1 from "@/assets/images/team-1.jpg";
import team2 from "@/assets/images/team-2.jpg";
import team3 from "@/assets/images/team-3.jpg";
import team4 from "@/assets/images/team-4.jpg";

// Some icon files declare an unused required prop, so widen the type here.
const SOCIAL_ICONS = {
  pinterest: PinterestIcon,
  x: XIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
} as unknown as Record<string, ComponentType>;

export type TeamMember = {
  name: string;
  role: string;
  image: StaticImageData | string;
  /** name = pinterest | x | facebook | instagram | linkedin */
  socials?: { name: string; url: string }[];
};

type MeetOurExpertsProps = {
  badge?: string;
  titleLines?: string[];
  members?: TeamMember[];
};

// TODO: replace "#" with each expert's real profile links.
const PLACEHOLDER_SOCIALS = ["pinterest", "x", "facebook", "instagram"].map(
  (name) => ({ name, url: "#" }),
);

const DEFAULT_MEMBERS: TeamMember[] = [
  { name: "Jenny Wilson", role: "Conservation Specialist", image: team1, socials: PLACEHOLDER_SOCIALS },
  { name: "Alexander Moore", role: "Museum Operations Manager", image: team2, socials: PLACEHOLDER_SOCIALS },
  { name: "Sophia Bennett", role: "Art Gallery Manager", image: team3, socials: PLACEHOLDER_SOCIALS },
  { name: "Daniel Carter", role: "Chief Curator", image: team4, socials: PLACEHOLDER_SOCIALS },
];

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as CSSProperties;

const MemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const d = 0.15 + index * 0.12;
  const socials = (member.socials ?? []).filter(
    (s) => SOCIAL_ICONS[s.name.trim().toLowerCase()],
  );
  return (
    <article className="group text-center">
      {/* Photo wipes up on scroll */}
      <div
        className="reveal-clip relative aspect-[400/462] overflow-hidden rounded-[20px]"
        style={{ ...delay(d), "--clip-r": "20px" } as CSSProperties}
      >
        <ImageShine className="absolute inset-0">
          <div className="reveal-zoom absolute inset-0" style={delay(d)}>
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
            />
          </div>
        </ImageShine>

        {/* Dark fade rises from the bottom on hover */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 [@media(hover:none)]:opacity-100" />

        {/* Socials rise in one after another */}
        {socials.length > 0 && (
          <ul className="absolute inset-x-0 bottom-6 z-[3] flex justify-center gap-2.5">
            {socials.map((social, i) => {
              const Icon = SOCIAL_ICONS[social.name.trim().toLowerCase()];
              return (
                <li
                  key={social.name}
                  className="team-social"
                  style={{ "--i": i } as CSSProperties}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${social.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-colors duration-300 hover:border-primary hover:bg-primary [&_svg]:h-4 [&_svg]:w-4"
                  >
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div {...revealItem("down", 30, d + 0.35, 1)}>
        <h3 className="mt-6 font-heading text-[clamp(0.95rem,1.1vw,1.15rem)] leading-title text-white uppercase transition-colors duration-300 group-hover:text-accent">
          {member.name}
        </h3>
        <p className="mt-2 font-dmSans text-[15px] text-white/75">{member.role}</p>
      </div>
    </article>
  );
};

const MeetOurExperts = ({
  badge = "Meet Our Experts",
  titleLines = ["Meet The People Behind", "Our Museum Excellence"],
  members = DEFAULT_MEMBERS,
}: MeetOurExpertsProps) => (
  <section className="relative isolate overflow-hidden bg-surface-dark py-20 text-white md:py-28">
    <GlowBackground />

    <ContentContainer size="narrow" className="h-auto">
      <SectionHeading badge={badge} lines={titleLines} tone="dark" />

      <Reveal
        once
        className="mx-auto mt-14 grid max-w-[420px] gap-x-6 gap-y-12 sm:max-w-none sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-x-[30px]"
      >
        {members.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </Reveal>
    </ContentContainer>
  </section>
);

export default MeetOurExperts;
