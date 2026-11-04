import { cn } from "@/utils/helpers/cn";
import NavLink from "@/components/common/link/NavLink";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode;
  prependIcon?: ReactNode;
  appendIcon?: ReactNode;
  loading?: boolean;
  /**
   * Render as a link. Internal paths use next/link, `http(s)://` opens in a
   * new tab. Prefer this over wrapping the button in a <NavLink>.
   */
  href?: string;
  /**
   * Render as a non-interactive <span> styled like the button. Use it when the
   * button sits inside a link (<NavLink><PrimaryButton as="span">): a <button>
   * inside an <a> is two nested focus targets - screen readers announce it
   * twice and Lighthouse fails it on touch-target size.
   */
  as?: "button" | "span";
};

const ButtonComponent = ({
  children,
  icon,
  prependIcon,
  appendIcon,
  loading = false,
  className,
  disabled,
  href,
  as = "button",
  ...props
}: BaseButtonProps) => {
  const isDisabled = disabled || loading;

  const classes = cn(
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 inline-flex items-center justify-center gap-[calc(8/1920*100vw)] px-[calc(16/1920*100vw)] py-[calc(8/1440*100vw)] rounded font-medium disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.97] duration-100 transition-all",
    isDisabled && href && "opacity-50 pointer-events-none",
    className,
  );

  const content = (
    <>
      {/* icon-only */}
      {icon && !children && icon}

      {/* prepend icon + text */}
      {prependIcon && (
        <span className="mr-[calc(4/1920*100vw)]">{prependIcon}</span>
      )}
      {children}
      {appendIcon && (
        <span className="ml-[calc(4/1920*100vw)]">{appendIcon}</span>
      )}
    </>
  );

  if (href) {
    // Only forward the attributes that make sense on an <a>.
    const { onClick, title, id, style, ...rest } = props;
    const aria = Object.fromEntries(
      Object.entries(rest).filter(
        ([k]) => k.startsWith("aria-") || k.startsWith("data-"),
      ),
    );
    return (
      <NavLink
        href={href}
        hover={false}
        disabled={isDisabled}
        className={classes}
        title={title}
        id={id}
        style={style}
        onClick={
          onClick as unknown as (
            e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
          ) => void
        }
        {...aria}
      >
        {content}
      </NavLink>
    );
  }

  if (as === "span") {
    const { type: _type, ...rest } = props;
    return (
      <span
        className={classes}
        {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    );
  }

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {content}
    </button>
  );
};

export default ButtonComponent;
