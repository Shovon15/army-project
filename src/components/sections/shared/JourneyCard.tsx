import PrimaryButton from "@/components/common/button/PrimaryButton";
import { CalendarIcon } from "@/assets/icons/MetaIcons";
import { CONTACT_INFO, OPENING_HOURS } from "@/config/static";
import routes from "@/config/routes";

/** Dark sidebar box: "Begin your artistic journey" with email, hours and a contact button. */
const JourneyCard = ({
  title = "Begin Your Artistic Journey Today",
}: {
  title?: string;
}) => (
  <div className="relative overflow-hidden rounded-[20px] bg-surface-dark p-6 text-white md:p-8">
    <span
      aria-hidden
      className="pointer-events-none absolute -right-16 -bottom-16 h-60 w-60 rounded-full bg-[radial-gradient(closest-side,rgb(var(--primary-rgb)/0.55),transparent)]"
    />
    <h2 className="relative font-heading text-[clamp(1rem,1.2vw,1.2rem)] leading-title uppercase">
      {title}
    </h2>
    <ul className="relative mt-6 space-y-4 font-dmSans text-[15px] text-white/80">
      <li>
        <span className="block text-[13px] tracking-[0.12em] text-accent uppercase">Email Us</span>
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="mt-1 block break-words text-white transition-colors hover:text-accent"
        >
          {CONTACT_INFO.email}
        </a>
      </li>
      <li className="flex gap-3">
        <CalendarIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" />
        <span>
          {OPENING_HOURS.map(({ day, time }) => (
            <span key={day} className="block">
              {day}: {time}
            </span>
          ))}
        </span>
      </li>
    </ul>
    <div className="relative mt-7">
      <PrimaryButton href={routes.contact} arrow variant="light" size="sm">
        Contact Us
      </PrimaryButton>
    </div>
  </div>
);

export default JourneyCard;
