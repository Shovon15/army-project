"use client";

import ContentContainer from "../container/contentContainer";
import NavLink from "@/components/common/link/NavLink";
import ImageComponent from "@/components/common/image";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import routes from "@/config/routes";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/utils/helpers/cn";
import { useIsMobile } from "@/hooks/useMobile";
import Paragraph from "@/components/common/typography/Paragraph";

const TopSection = () => {
  const { settings } = useAppSelector((state) => state.navigation);
  const setting = settings.items[0];
  const { isMobile } = useIsMobile();
  const backgroundImage =
    (isMobile ? setting?.footer_image_sd : setting?.footer_image) ||
    setting?.footer_image ||
    setting?.footer_image_sd;

  return (
    <div className=" relative overflow-hidden bg-foreground">
      {/* An <img> instead of a CSS background so the CMS image goes through
          the Next image optimizer and lazy-loads. */}
      {backgroundImage && (
        <ImageComponent
          src={backgroundImage}
          alt="footer background"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-[#000000BF] -z-0"></div>
      <div className=" flex flex-col gap-5 justify-center items-center text-white py-[51px] w-[90%] max-w-[800px]  mx-auto relative">
        <FooterLogo
          logo={setting?.footer_logo}
          className="w-[165px] lg:w-[284px] "
        />
        <h2 className="font-heading font-normal text-[clamp(20px,1.875vw,36px)] leading-[120%] text-center">
          {setting?.footer_title || "Let's Build Something Great Together"}
        </h2>
        
        <Paragraph
          content={setting?.footer_description || ""}
          className="text-center text-[clamp(14px,1vw,16px)] font-body "
        />

        <PrimaryButton
          href={routes.contact}
          arrow
          className="flex w-full lg:inline-flex lg:w-auto"
        >
          Get in Touch
        </PrimaryButton>
      </div>
    </div>
  );
};

export default TopSection;

const FooterLogo = ({
  className,
  logo,
}: {
  className?: string;
  logo?: string;
}) => {
  return (
    <NavLink href={routes.home}>
      <ImageComponent
        src={logo || "/logo.png"}
        fallbackSrc="/logo.png"
        alt="footer logo"
        className={cn("w-full h-full object-contain", className)}
      />
    </NavLink>
  );
};
