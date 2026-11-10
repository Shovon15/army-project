import NavLink from "@/components/common/link/NavLink";
import ArrowUpRightIcon from "@/assets/icons/ArrowUpRightIcon";
import { cn } from "@/utils/helpers/cn";

export type SidebarLink = { label: string; href: string; active?: boolean };

const ITEM =
  "group flex items-center justify-between gap-3 rounded-full px-5 py-3.5 font-dmSans text-[15px] font-semibold transition-colors duration-300";

/**
 * Sidebar card with a title and a list of pill links. `#id` hrefs render as
 * plain anchors (Lenis smooth-scrolls them); other hrefs use NavLink.
 */
const SidebarLinks = ({
  title,
  links,
  ariaLabel = title,
}: {
  title: string;
  links: SidebarLink[];
  ariaLabel?: string;
}) => (
  <nav
    aria-label={ariaLabel}
    className="rounded-[20px] border border-black/5 bg-surface-light p-6 md:p-8"
  >
    <h2 className="font-heading text-[clamp(1rem,1.2vw,1.2rem)] leading-title uppercase">
      {title}
    </h2>
    <ul className="mt-6 space-y-2.5">
      {links.map(({ label, href, active }) => {
        const className = cn(
          ITEM,
          active
            ? "bg-primary text-white"
            : "bg-white text-ink hover:bg-surface-dark hover:text-white",
        );
        const arrow = (
          <ArrowUpRightIcon
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-500",
              active ? "rotate-45" : "group-hover:rotate-45",
            )}
          />
        );
        return (
          <li key={href}>
            {href.startsWith("#") ? (
              <a href={href} className={className}>
                {label}
                {arrow}
              </a>
            ) : (
              <NavLink
                href={href}
                hover={false}
                aria-current={active ? "page" : undefined}
                className={className}
              >
                {label}
                {arrow}
              </NavLink>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

export default SidebarLinks;
