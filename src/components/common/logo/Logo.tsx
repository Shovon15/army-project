import NavLink from "../link/NavLink";
import { cn } from "@/utils/helpers/cn";

type LogoProps = {
  className?: string;
  /** Wordmark next to the badge. */
  brand?: string;
  /** Hide the wordmark and show only the round badge. */
  iconOnly?: boolean;
  onClick?: () => void;
};

/** Round red badge with a classical bust silhouette. */
const LogoMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <circle cx="24" cy="24" r="24" fill="var(--primary)" />
    <g fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      {/* veil / head */}
      <path d="M16 22c0-6 3.6-10.5 8-10.5S32 16 32 22c0 3.2-.8 5.6-2 7.4" />
      <path d="M18 29.4c-1.2-1.8-2-4.2-2-7.4" />
      <path d="M17.5 17h13" />
      {/* face */}
      <path d="M20.5 20.5c0 4 1.6 6.5 3.5 6.5s3.5-2.5 3.5-6.5" />
      <path d="M22.4 22.2h.01M25.6 22.2h.01" strokeWidth="2.4" />
      {/* shoulders / drapery */}
      <path d="M14 37c.8-4.4 4.2-7.2 10-7.2S33.2 32.6 34 37" />
      <path d="M19 37l2.4-5M29 37l-2.4-5" />
    </g>
  </svg>
);

const Logo = ({ className, brand = "Museon", iconOnly = false, onClick }: LogoProps) => {
  return (
    <NavLink
      href="/"
      hover={false}
      ariaLabel={`${brand} home`}
      onClick={onClick}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <LogoMark className="h-11 w-11 shrink-0 transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:rotate-[360deg] lg:h-[52px] lg:w-[52px]" />
      {!iconOnly && (
        <span className="font-boldCond text-[18px] leading-[1.3] text-white uppercase lg:text-[21px]">
          {brand}
          <span className="text-[var(--primary)]">.</span>
        </span>
      )}
    </NavLink>
  );
};

export default Logo;
