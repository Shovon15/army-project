import ContentContainer from "@/components/layout/container/contentContainer";
import GlowBackground from "@/components/common/background/GlowBackground";
import SectionHeading from "@/components/common/typography/SectionHeading";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import NavLink from "@/components/common/link/NavLink";
import TestimonialsSlider, {
  Stars,
  type Testimonial,
} from "./TestimonialsSlider";

type TestimonialsProps = {
  badge?: string;
  titleLines?: string[];
  items?: Testimonial[];
  cta?: { text: string; linkLabel: string; href: string };
  /** Overall rating line under the slider. */
  summary?: { rating: number; label: string };
};

// TODO: sample copy. Replace with real visitor reviews before launch.
const DEFAULT_ITEMS: Testimonial[] = [
  {
    quote:
      "From classical masterpieces to contemporary works, every exhibit was thoughtfully presented. I can't wait to visit again.",
    name: "Amelia Harris",
    role: "Cultural Events Coordinator",
    rating: 5,
  },
  {
    quote:
      "The guided tour brought centuries of history to life. Our guide's stories made every room feel personal.",
    name: "Emily Carter",
    role: "Art History Student",
    rating: 5,
  },
  {
    quote:
      "A calm, beautifully lit space. The sculpture gallery alone is worth the trip — I lost track of time.",
    name: "William Foster",
    role: "Author & Collector",
    rating: 5,
  },
  {
    quote:
      "We brought the kids to a weekend workshop and they haven't stopped painting since. Wonderful staff.",
    name: "Olivia Bennett",
    role: "Parent & Member",
    rating: 5,
  },
  {
    quote:
      "Thoughtful curation and great accessibility. Every label and audio guide was clear and engaging.",
    name: "James Walker",
    role: "Museum Volunteer",
    rating: 4,
  },
  {
    quote:
      "The evening artist talk was the highlight of my month. A genuinely welcoming cultural space.",
    name: "Sophia Turner",
    role: "Graphic Designer",
    rating: 5,
  },
];

const Testimonials = ({
  badge = "Testimonials",
  titleLines = ["Real Experiences From", "Our Valued Visitors"],
  items = DEFAULT_ITEMS,
  cta = {
    text: "From timeless collections to immersive exhibitions –",
    linkLabel: "View Our All Reviews.",
    href: "/reviews",
  },
  summary = { rating: 4.9, label: "Over 25,000 Happy Visitors" },
}: TestimonialsProps) => (
  <section className="relative isolate overflow-hidden bg-surface-dark py-20 text-white md:py-28">
    <GlowBackground />

    <ContentContainer size="narrow" className="h-auto">
      <SectionHeading badge={badge} lines={titleLines} tone="dark" />

      <Reveal once className="mt-14 md:mt-16">
        <TestimonialsSlider items={items} />
      </Reveal>

      <Reveal
        once
        className="mt-10 flex flex-col items-center gap-3 text-center font-dmSans"
      >
        {/* <p
          className="text-[16px] text-white/90"
          {...revealItem("down", 24, 0.2, 1)}
        >
          {cta.text}{" "}
          <NavLink
            href={cta.href}
            hover={false}
            className="font-semibold text-accent underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-white"
          >
            {cta.linkLabel}
          </NavLink>
        </p> */}
        <p
          className="flex flex-wrap items-center justify-center gap-3 text-[15px] text-white/85"
          {...revealItem("down", 24, 0.35, 1)}
        >
          <span className="font-heading text-[15px] text-white">
            {summary.rating}
          </span>
          <Stars rating={summary.rating} className="flex gap-1" />
          <span>{summary.label}</span>
        </p>
      </Reveal>
    </ContentContainer>
  </section>
);

export default Testimonials;
