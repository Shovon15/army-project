"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavLink from "@/components/common/link/NavLink";
import { cn } from "@/utils/helpers/cn";
import { getNavChildPath, getNavPath, isGroupItem } from "@/utils/helpers/navPaths";

type Props = {
  navItems: any;
};

const EASE = "ease-[cubic-bezier(.7,0,.2,1)]";

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const NavItems = ({ navItems }: Props) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const activeIndex = navItems.findIndex((item: any) => {
    const childActive = item.children?.some(
      (c: any) => pathname === getNavChildPath(item, c),
    );
    if (childActive) return true;
    if (isGroupItem(item)) return false;
    const path = getNavPath(item);
    return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  });

  return (
    <nav className="hidden h-full items-center gap-[clamp(20px,2.2vw,42px)] lg:flex">
      {navItems.map((item: any, index: number) => {
        const linkPath = getNavPath(item);
        const isActive = index === activeIndex;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openDropdown === index;
        // A group parent has no page: render a button that only opens the menu.
        const isGroup = hasChildren && isGroupItem(item);
        const triggerClass = cn(
          "group relative flex cursor-pointer items-center gap-1.5 py-2 font-dmSans text-[16px] font-medium whitespace-nowrap transition-colors duration-300",
          isActive ? "text-accent" : "text-white hover:text-accent",
        );
        const triggerInner = (
          <>
            {item.title}
            {hasChildren && <Chevron open={isOpen} />}

            {/* Underline draws in from the left on hover */}
            <span
              aria-hidden
              className={cn(
                "absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-500",
                EASE,
                isActive ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </>
        );

        return (
          <div
            key={item.slug}
            className="relative"
            onMouseEnter={() => hasChildren && setOpenDropdown(index)}
            onMouseLeave={() => hasChildren && setOpenDropdown(null)}
            onFocus={() => hasChildren && setOpenDropdown(index)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node))
                setOpenDropdown(null);
            }}
          >
            {isGroup ? (
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() => setOpenDropdown(isOpen ? null : index)}
                className={triggerClass}
              >
                {triggerInner}
              </button>
            ) : (
              <NavLink
                href={linkPath}
                hover={false}
                aria-haspopup={hasChildren || undefined}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-current={isActive && pathname === linkPath ? "page" : undefined}
                className={triggerClass}
              >
                {triggerInner}
              </NavLink>
            )}

            {hasChildren && (
              <div
                className={cn(
                  "absolute top-full left-1/2 z-30 min-w-[220px] -translate-x-1/2 pt-5 transition-all duration-300",
                  isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0",
                )}
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink/95 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  {item.children.map((child: any) => {
                    const childPath = getNavChildPath(item, child);
                    const childActive = pathname === childPath;
                    return (
                      <NavLink
                        key={child.slug}
                        href={childPath}
                        hover={false}
                        aria-current={childActive ? "page" : undefined}
                        onClick={() => setOpenDropdown(null)}
                        className={cn(
                          "group/item flex items-center gap-2 rounded-xl px-4 py-2.5 font-dmSans text-sm transition-colors duration-200 hover:bg-white/5",
                          childActive
                            ? "text-accent"
                            : "text-white/75 hover:text-white",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "h-1.5 w-0 rounded-full bg-accent transition-all duration-300 group-hover/item:w-1.5",
                            childActive && "w-1.5",
                          )}
                        />
                        {child.title}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavItems;
