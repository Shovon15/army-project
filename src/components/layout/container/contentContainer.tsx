import { cn } from "@/utils/helpers/cn";
import React, { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /**
   * "default": content spans ~82–86% of the viewport.
   * "narrow": ~70% on desktop (about 30% tighter), for the header and hero.
   */
  size?: "default" | "narrow";
  disablePX?: boolean;
  disablePR?: boolean;
  disablePL?: boolean;
  disablePLOnLg?: boolean;
};

const SIZE = {
  default: "px-4 md:px-[7vw] 2xl:px-[9vw]",
  // Ramps in so the header nav still fits on small laptops.
  narrow: "px-4 md:px-[7vw] xl:px-[11vw] 2xl:px-[15vw]",
};

const ContentContainer = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      className = "",
      size = "default",
      disablePX,
      disablePR,
      disablePL,
      disablePLOnLg,
    },
    ref,
  ) => {
    const padding = ` ${disablePX ? "!px-0" : ""} ${
      disablePL ? "!pl-0" : ""
    } ${disablePR ? "!pr-0" : ""} ${disablePLOnLg ? "lg:!pl-0" : ""}`;

    return (
      <div
        ref={ref}
        className={cn("h-full", SIZE[size], padding, className)}
      >
        {children}
      </div>
    );
  },
);

ContentContainer.displayName = "ContentContainer";

export default ContentContainer;
