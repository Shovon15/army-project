import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionHeading from "@/components/common/typography/SectionHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import CtaLine from "@/components/common/cta/CtaLine";
import { ColumnIcon, EaselIcon, TicketIcon } from "@/assets/icons/MuseumIcons";
import routes from "@/config/routes";

export type ApproachStep = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  tags: string[];
};

type OurApproachProps = {
  badge?: string;
  titleLines?: string[];
  steps?: ApproachStep[];
  cta?: { text: string; linkLabel: string; href: string };
};

const DEFAULT_STEPS: ApproachStep[] = [
  {
    icon: ColumnIcon,
    title: "Collect & Preserve",
    text: "We carefully acquire, document, and preserve valuable artworks so they last for generations to come.",
    tags: ["Culture", "Gallery"],
  },
  {
    icon: EaselIcon,
    title: "Curate with Purpose",
    text: "Our expert curators thoughtfully organise collections into engaging exhibitions that tell meaningful stories.",
    tags: ["Education", "Tradition"],
  },
  {
    icon: TicketIcon,
    title: "Educate & Engage",
    text: "Through guided tours, educational programs and workshops, we connect every visitor with art and history.",
    tags: ["Artworks", "History"],
  },
];

const StepCard = ({ step, index }: { step: ApproachStep; index: number }) => {
  const Icon = step.icon;
  return (
    <li
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-surface-card p-7 transition-[translate,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:border-accent/40 md:p-9"
      {...revealItem("down", 60, 0.15 + index * 0.15, 1.1)}
    >
      {/* Red glow rises from the bottom on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-1/2 h-full translate-y-1/3 bg-[radial-gradient(closest-side,rgb(var(--primary-rgb)/0.45),transparent)] opacity-0 transition-[opacity,translate] duration-700 group-hover:translate-y-0 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06] text-accent transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
          <Icon className="icon-wobble h-9 w-9" />
        </span>
        <span
          aria-hidden
          className="font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.25)] transition-colors duration-500 group-hover:[-webkit-text-stroke-color:var(--accent)]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="relative mt-8 font-heading text-[clamp(1.05rem,1.3vw,1.35rem)] leading-title uppercase">
        <span className="sr-only">Step {index + 1}: </span>
        {step.title}
      </h3>
      <p className="relative mt-4 font-dmSans text-[15px] leading-text text-white/70">
        {step.text}
      </p>

      <span aria-hidden className="relative mt-7 block h-px w-full bg-white/10" />

      <ul className="relative mt-6 flex flex-wrap gap-2.5">
        {step.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-white/15 px-4 py-1.5 font-dmSans text-[13px] font-medium text-white/85"
          >
            {tag}
          </li>
        ))}
      </ul>
    </li>
  );
};

/** "Our Approach": three numbered step cards on the dark surface. */
const OurApproach = ({
  badge = "Our Approach",
  titleLines = ["Step By Step Approach", "To Perfect Events"],
  steps = DEFAULT_STEPS,
  cta = {
    text: "Reach out and begin your artistic journey today –",
    linkLabel: "Contact Us Today",
    href: routes.contact,
  },
}: OurApproachProps) => (
  <section className="relative isolate overflow-hidden bg-surface-dark py-20 text-white md:py-28">
    <GlowBackground />
    <ContentContainer size="narrow" className="h-auto">
      <SectionHeading badge={badge} lines={titleLines} tone="dark" />

      <Reveal once className="mt-14 md:mt-16">
        <ol className="grid gap-6 md:grid-cols-3 lg:gap-[30px]">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </ol>
      </Reveal>

      <CtaLine {...cta} tone="dark" className="mt-12 md:mt-14" />
    </ContentContainer>
  </section>
);

export default OurApproach;
