"use client";

import type { ComponentType } from "react";
import ContentContainer from "../container/contentContainer";
import NavLink from "@/components/common/link/NavLink";
import Logo from "@/components/common/logo/Logo";
import GlowBackground from "@/components/common/background/GlowBackground";
import AnimatedHeading from "@/components/common/typography/AnimatedHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import NewsletterForm from "./NewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from "@/assets/icons";
import routes from "@/config/routes";
import { CONTACT_INFO, OPENING_HOURS } from "@/config/static";
import { useAppSelector } from "@/store/hooks";

const BRAND = "Army Project";

const SOCIAL_ICONS: Record<string, ComponentType<any>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  pinterest: PinterestIcon,
  whatsapp: WhatsAppIcon,
  x: XIcon,
  twitter: XIcon,
  youtube: YoutubeIcon,
};

// Used until the CMS provides social links. TODO: replace with real profile URLs
const FALLBACK_SOCIALS = [
  { name: "Pinterest", url: "https://pinterest.com" },
  { name: "X", url: "https://x.com" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "Instagram", url: "https://instagram.com" },
];

type LinkItem = { label: string; href: string };

const LINK_COLUMNS: { title: string; links: LinkItem[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: routes.home },
      { label: "About Us", href: routes.about },
      { label: "Events", href: "/events" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: routes.contact },
    ],
  },
  // {
  //   title: "Collections",
  //   links: [
  //     { label: "Classical Art", href: "/collection/classical-art" },
  //     { label: "Sculpture Gallery", href: "/collection/sculpture-gallery" },
  //     { label: "Photography Collection", href: "/collection/photography" },
  //     { label: "Contemporary Collection", href: "/collection/contemporary" },
  //     { label: "Cultural Heritage", href: "/collection/cultural-heritage" },
  //   ],
  // },
];

const DESCRIPTION =
  "Discover timeless art, culture, and heritage through curated exhibitions and inspiring creative experiences that connect past and present.";

const ColumnTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-heading text-[clamp(0.95rem,1.05vw,1.15rem)] leading-title uppercase">
    {children}
  </h3>
);

const Footer = () => {
  const { socialLinks } = useAppSelector((state) => state.navigation);
  const socials = (
    socialLinks.items.length ? socialLinks.items : FALLBACK_SOCIALS
  ).filter((s) => s.url && SOCIAL_ICONS[s.name?.trim().toLowerCase()]);

  return (
    <footer className="relative isolate w-full overflow-hidden bg-surface-dark text-white">
      <GlowBackground />

      <ContentContainer size="narrow" className="relative h-auto">
        {/* ---------- Top: headline + newsletter ---------- */}
        {/* <Reveal
          once
          className="grid items-center gap-10 border-b border-white/10 pt-[clamp(64px,7vw,110px)] pb-[clamp(48px,5vw,76px)] lg:grid-cols-[1.4fr_1fr] lg:gap-16"
        >
          <AnimatedHeading
            lines={["Stay Updated With", "Latest Exhibitions"]}
            className="text-[clamp(1.5rem,2.3vw,2.6rem)]"
          />

          <div
            className="w-full lg:max-w-[420px] lg:justify-self-end"
            {...revealItem("down", 30, 0.2, 1)}
          >
            <h3 className="mb-5 font-heading text-[clamp(0.95rem,1.05vw,1.15rem)] leading-title uppercase">
              Subscribe Newsletter&apos;s
            </h3>
            <NewsletterForm />
          </div>
        </Reveal> */}

        {/* ---------- Middle: brand + link columns ---------- */}
        <Reveal
          once
          className="grid gap-12 py-[clamp(56px,5vw,80px)] sm:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_1fr_1fr] lg:gap-10"
        >
          {/* Brand */}
          <div
            className="sm:col-span-2 lg:col-span-1 lg:pr-10"
            {...revealItem("down", 40, 0, 1)}
          >
            <Logo brand={BRAND} />
            <p className="mt-6 max-w-[420px] font-dmSans text-[15px] leading-text text-white/85">
              {DESCRIPTION}
            </p>
            {/* {socials.length > 0 && (
              <ul className="mt-9 flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.name.trim().toLowerCase()];
                  return (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary [&_svg]:h-4 [&_svg]:w-4"
                      >
                        <Icon />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )} */}
          </div>

          {/* Link columns */}
          {LINK_COLUMNS.map((column, i) => (
            <nav
              key={column.title}
              aria-label={column.title}
              {...revealItem("down", 40, 0.1 + i * 0.1, 1)}
            >
              <ColumnTitle>{column.title}</ColumnTitle>
              <ul className="mt-6 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      href={link.href}
                      hover={false}
                      className="group/link inline-flex items-center gap-3 font-dmSans text-[15px] text-white transition-colors duration-300 hover:text-accent"
                    >
                      <span
                        aria-hidden
                        className="h-[5px] w-[5px] shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover/link:scale-150"
                      />
                      <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                        {link.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Hours + location */}
          <div {...revealItem("down", 40, 0.3, 1)}>
            {/* <ColumnTitle>Opening Hours</ColumnTitle>
            <ul className="mt-6 space-y-1 font-dmSans text-[15px] leading-text text-white">
              {OPENING_HOURS.map(({ day, time }) => (
                <li key={day}>
                  {day}: {time}
                </li>
              ))}
            </ul> */}

            <div className="">
              <ColumnTitle>Location</ColumnTitle>
              <address className="mt-6 font-dmSans text-[15px] leading-text text-white not-italic">
                {CONTACT_INFO.address}
              </address>
            </div>
          </div>
        </Reveal>

        {/* ---------- Bottom: copyright ---------- */}
        <div className="flex flex-col items-center gap-3 border-t border-white/10 py-7 text-center font-dmSans text-[15px] text-white/90 md:flex-row md:justify-between md:text-left">
          <p>
            Copyright © {new Date().getFullYear()}{" "}
            <NavLink
              href={routes.home}
              hover={false}
              className="transition-colors duration-300 hover:text-accent"
            >
              {BRAND}
            </NavLink>
            . All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { label: "FAQs", href: routes.faq },
                { label: "Privacy Policy", href: routes.privacyPolicy },
              ].map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    hover={false}
                    className="transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </ContentContainer>
    </footer>
  );
};

export default Footer;
