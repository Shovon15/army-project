import Image from "next/image";
import NavLink from "../link/NavLink";
import { cn } from "@/utils/helpers/cn";
import logoImage from "@/assets/images/logo.png";

type LogoProps = {
  className?: string;
  /** Wordmark next to the emblem. */
  brand?: string;
  /** Hide the wordmark and show only the emblem. */
  iconOnly?: boolean;
  onClick?: () => void;
};

/**
 * Round emblem (src/assets/images/logo.png, transparent PNG cut from
 * logo.jpeg) + wordmark. The same emblem is used for the favicon
 * (src/app/icon.png), apple-icon.png, public/logo.png and the share image.
 */
const Logo = ({ className, brand = "Museon", iconOnly = false, onClick }: LogoProps) => {
  return (
    <NavLink
      href="/"
      hover={false}
      ariaLabel={`${brand} home`}
      onClick={onClick}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <Image
        src={logoImage}
        alt=""
        priority
        sizes="56px"
        className="h-11 w-11 shrink-0 rounded-full transition-[scale,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:shadow-[0_0_0_3px_rgba(213,181,70,0.35)] lg:h-[52px] lg:w-[52px]"
      />
      {!iconOnly && (
        <span className="font-boldCond text-[18px] leading-title text-white uppercase lg:text-[21px]">
          {brand}
          <span className="text-[var(--primary)]">.</span>
        </span>
      )}
    </NavLink>
  );
};

export default Logo;
