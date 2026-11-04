import Image, { type StaticImageData } from "next/image";
import Reveal from "@/components/common/animations/Reveal";
import { revealItem } from "@/components/common/animations/revealItem";
import NavLink from "@/components/common/link/NavLink";
import { PhoneIcon } from "@/assets/icons";
import { cn } from "@/utils/helpers/cn";
import defaultAvatar from "@/assets/images/about/curator.png";

type CtaLineProps = {
  text: string;
  linkLabel: string;
  href: string;
  /** "dark" = white text for dark sections. */
  tone?: "dark" | "light";
  avatar?: StaticImageData | string;
  className?: string;
};

/**
 * "Avatar + phone chip · text – red underlined link" line that closes several
 * home sections. Fades up when scrolled into view.
 */
const CtaLine = ({
  text,
  linkLabel,
  href,
  tone = "dark",
  avatar = defaultAvatar,
  className,
}: CtaLineProps) => {
  const ring = tone === "dark" ? "border-surface-dark" : "border-surface-light";
  return (
    <Reveal once className={cn("flex justify-center", className)}>
      <p
        className={cn(
          "flex flex-wrap items-center justify-center gap-3 text-center font-dmSans text-[16px]",
          tone === "dark" ? "text-white/90" : "text-ink-soft",
        )}
        {...revealItem("down", 24, 0.4, 1)}
      >
        <span className="flex items-center" aria-hidden>
          <Image
            src={avatar}
            alt=""
            width={40}
            height={40}
            className={cn("h-10 w-10 rounded-full border-2 object-cover", ring)}
          />
          <span
            className={cn(
              "-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-primary text-white",
              ring,
            )}
          >
            <PhoneIcon className="size-4" />
          </span>
        </span>
        {text}
        <NavLink
          href={href}
          hover={false}
          className={cn(
            "font-semibold underline decoration-1 underline-offset-4 transition-colors duration-300",
            tone === "dark" ? "text-accent hover:text-white" : "text-primary hover:text-ink",
          )}
        >
          {linkLabel}
        </NavLink>
      </p>
    </Reveal>
  );
};

export default CtaLine;
