import Image from "next/image";
import NavLink from "../link/NavLink";
import { cn } from "@/utils/helpers/cn";
import logoImage from "@/assets/images/logo.png";

type LogoProps = {
  className?: string;
  /** Brand name, used only for the link's accessible label. */
  brand?: string;
  onClick?: () => void;
};

/**
 * Round emblem (src/assets/images/logo.png, transparent PNG cut from
 * logo.jpeg). The same emblem is used for the favicon (src/app/icon.png),
 * apple-icon.png, public/logo.png and the share image.
 */
const Logo = ({ className, brand = "Museon", onClick }: LogoProps) => {
  return (
    <NavLink
      href="/"
      hover={false}
      ariaLabel={`${brand} home`}
      onClick={onClick}
      className={cn("group inline-flex items-center", className)}
    >
      <Image
        src={logoImage}
        alt=""
        priority
        sizes="76px"
        className="h-16 w-16 shrink-0 rounded-full transition-[scale,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:shadow-[0_0_0_3px_rgb(var(--accent-rgb)/0.35)] lg:h-[76px] lg:w-[76px]"
      />
    </NavLink>
  );
};

export default Logo;
