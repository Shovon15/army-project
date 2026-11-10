import ContentContainer from "@/components/layout/container/contentContainer";
import SectionHeading from "@/components/common/typography/SectionHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { Accordion } from "@/components/common/accordion/Accordion";
import { PhoneIcon } from "@/assets/icons";
import routes from "@/config/routes";

import { VISITOR_FAQS } from "@/lib/faq/faqs";

// Re-exported so pages can build FAQ JSON-LD from the same questions.
export { VISITOR_FAQS };

type CommonQuestionsProps = {
  badge?: string;
  titleLines?: string[];
  faqs?: IFaqItem[];
  cta?: { title: string; text: string; label: string; href: string };
};

/** FAQ: heading + "still have questions" card on the left, accordion on the right. */
const CommonQuestions = ({
  badge = "Common Questions",
  titleLines = ["Everything You Need To", "Know Before Visiting"],
  faqs = VISITOR_FAQS,
  cta = {
    title: "Still Have Any Questions?",
    text: "Our team is happy to help you plan your visit.",
    label: "View All Questions",
    href: routes.faq,
  },
}: CommonQuestionsProps) => (
  <section className="relative overflow-hidden bg-surface-light py-20 text-ink md:py-28">
    <ContentContainer
      size="narrow"
      className="grid h-auto gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
    >
      <div className="flex flex-col">
        <SectionHeading badge={badge} lines={titleLines} align="left" tone="light" />

        <Reveal once className="mt-10 lg:mt-auto">
          <div
            className="relative overflow-hidden rounded-[20px] bg-surface-dark p-7 text-white md:p-9"
            {...revealItem("down", 40, 0.3, 1)}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(var(--primary-rgb)/0.55),transparent)]"
            />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <PhoneIcon className="size-5" />
            </span>
            <h3 className="relative mt-6 font-heading text-[clamp(1.05rem,1.3vw,1.35rem)] leading-title uppercase">
              {cta.title}
            </h3>
            <p className="relative mt-3 font-dmSans text-[15px] leading-text text-white/75">
              {cta.text}
            </p>
            <div className="relative mt-7">
              <PrimaryButton href={cta.href} arrow variant="light">
                {cta.label}
              </PrimaryButton>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal once>
        <div {...revealItem("down", 40, 0.2, 1)}>
          <Accordion items={faqs} tag="h3" columns={1} />
        </div>
      </Reveal>
    </ContentContainer>
  </section>
);

export default CommonQuestions;
