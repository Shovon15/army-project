"use client";

import { cn } from "@/utils/helpers/cn";
import Link, { LinkProps } from "next/link";
import React from "react";

type NavLinkProps = Omit<LinkProps, "href"> & {
  children: React.ReactNode;
  href: string;
  replace?: boolean;
  scroll?: boolean;
  query?: Record<string, string | number>;
  className?: string;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  title?: string;
  hover?: boolean;
  [key: string]: any;
};

export default function NavLink({
  children,
  href,
  replace = false,
  scroll = true,
  query,
  onClick,
  className = "",
  hover = true,
  title,
  ariaLabel,
  disabled = false,
  ...props
}: NavLinkProps) {
  const absoluteHref = href.startsWith("/") ? href : `/${href}`;
  const isExternal = href.startsWith("http") || href.startsWith("//");

  const combinedClass = cn(
    disabled
      ? "opacity-45 pointer-events-none"
      : hover
        ? "hover:text-header cursor-pointer"
        : "cursor-pointer",
    className,
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel || title}
        title={title}
        onClick={onClick}
        className={combinedClass}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      // A string href keeps "#section" as a real hash instead of part of the pathname.
      href={query ? { pathname: absoluteHref, query } : absoluteHref}
      replace={replace}
      scroll={scroll}
      className={combinedClass}
      aria-label={ariaLabel || title}
      title={title}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}
