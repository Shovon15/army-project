import type { ReactNode } from "react";
import ContentContainer from "@/components/layout/container/contentContainer";
import SectionHeading from "@/components/common/typography/SectionHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { CalendarIcon, MapPinIcon } from "@/assets/icons/MetaIcons";
import { CONTACT_INFO, OPENING_HOURS } from "@/config/static";
import routes from "@/config/routes";

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

type ContactCard = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: ReactNode;
  link?: { label: string; href: string };
};

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.address)}`;

const DEFAULT_CARDS: ContactCard[] = [
  {
    icon: MailIcon,
    title: "Email Us",
    body: CONTACT_INFO.email,
    link: { label: "Send an Email", href: `mailto:${CONTACT_INFO.email}` },
  },
  {
    icon: CalendarIcon,
    title: "Opening Hours",
    body: (
      <>
        {OPENING_HOURS.map(({ day, time }) => (
          <span key={day} className="block">
            {day}: {time}
          </span>
        ))}
      </>
    ),
  },
  {
    icon: MapPinIcon,
    title: "Visit Us",
    body: CONTACT_INFO.address,
    link: { label: "View on Maps", href: MAPS_URL },
  },
];

type ConnectWithUsProps = {
  badge?: string;
  titleLines?: string[];
  description?: string;
  /** null hides the button (e.g. on the Contact page itself). */
  cta?: { label: string; href: string } | null;
  cards?: ContactCard[];
};

/** "Connect With Us": heading + button on the left, three contact cards on the right. */
const ConnectWithUs = ({
  badge = "Connect With Us",
  titleLines = ["Questions? We're Happy", "To Help You Today!"],
  description = "Whether you are planning a visit, booking a guided tour, or asking about exhibitions and memberships, our team is ready to help.",
  cta = { label: "Get Consultation", href: routes.contact },
  cards = DEFAULT_CARDS,
}: ConnectWithUsProps) => (
  <section className="relative overflow-hidden bg-surface-light py-20 text-ink md:py-28">
    <ContentContainer
      size="narrow"
      className="grid h-auto items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
    >
      <div>
        <SectionHeading badge={badge} lines={titleLines} align="left" tone="light" />
        <Reveal once>
          <p
            className="mt-6 max-w-[520px] font-dmSans text-[clamp(15px,1vw,17px)] leading-text text-ink-muted"
            {...revealItem("down", 30, 0.3, 1)}
          >
            {description}
          </p>
          {cta && (
            <div className="mt-8" {...revealItem("down", 30, 0.4, 1)}>
              <PrimaryButton href={cta.href} arrow variant="dark">
                {cta.label}
              </PrimaryButton>
            </div>
          )}
        </Reveal>
      </div>

      <Reveal once>
        <ul className="grid gap-5 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, body, link }, i) => (
            <li
              key={title}
              className={`group flex flex-col rounded-[20px] border border-black/5 bg-white p-6 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)] md:p-7 ${i === cards.length - 1 && cards.length % 2 === 1 ? "sm:col-span-2" : ""}`}
              {...revealItem("down", 40, 0.15 + i * 0.12, 1)}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-light text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-heading text-[clamp(0.95rem,1.05vw,1.15rem)] leading-title uppercase">
                {title}
              </h3>
              <p className="mt-2.5 font-dmSans text-[15px] leading-text break-words text-ink-muted not-italic">
                {body}
              </p>
              {link && (
                // Plain <a>: NavLink would prefix "mailto:" with a slash.
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="mt-auto self-start pt-5 font-dmSans text-[15px] font-semibold text-primary underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-ink"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </ContentContainer>
  </section>
);

export default ConnectWithUs;
