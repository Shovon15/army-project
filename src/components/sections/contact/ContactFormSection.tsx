import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionHeading from "@/components/common/typography/SectionHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import { MapPinIcon } from "@/assets/icons/MetaIcons";
import { CONTACT_INFO } from "@/config/static";
import { MAPS_URL } from "@/components/sections/shared/ConnectWithUs";
import ContactForm from "./ContactForm";

type ContactFormSectionProps = {
  badge?: string;
  titleLines?: string[];
  description?: string;
  address?: string;
};

/** "Reach Out Today": contact form on the left, map of the museum on the right. */
const ContactFormSection = ({
  badge = "Send A Message",
  titleLines = ["Reach Out Today"],
  description = "Have a question about your visit, a guided tour, or an upcoming exhibition? Send us a message and our team will get back to you shortly.",
  address = CONTACT_INFO.address,
}: ContactFormSectionProps) => (
  <section className="relative isolate overflow-hidden bg-surface-dark py-20 text-white md:py-28">
    <GlowBackground />
    <ContentContainer
      size="narrow"
      className="grid h-auto gap-12 lg:grid-cols-2 lg:gap-16"
    >
      <div>
        <SectionHeading badge={badge} lines={titleLines} align="left" tone="dark" />
        <Reveal once>
          <p
            className="mt-6 max-w-[520px] font-dmSans text-[clamp(15px,1vw,17px)] leading-text text-white/75"
            {...revealItem("down", 30, 0.3, 1)}
          >
            {description}
          </p>
          <div className="mt-9" {...revealItem("down", 40, 0.4, 1)}>
            <ContactForm />
          </div>
        </Reveal>
      </div>

      <Reveal once className="flex">
        <div
          className="relative flex min-h-[380px] w-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-surface-card"
          {...revealItem("right", 60, 0.25, 1.1)}
        >
          <iframe
            title="Map showing the museum location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-[300px] w-full flex-1 border-0 grayscale-[0.4] invert-[0.9] hue-rotate-180"
          />
          <div className="flex items-center gap-4 border-t border-white/10 p-5 md:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
              <MapPinIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-heading text-[15px] leading-title uppercase">Visit Our Location</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-dmSans text-[14px] leading-text text-white/70 underline-offset-4 transition-colors duration-300 hover:text-accent hover:underline"
              >
                {address}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </ContentContainer>
  </section>
);

export default ContactFormSection;
