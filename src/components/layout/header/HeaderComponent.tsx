"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { useScrollMetrics } from "@/hooks/useScrollMetrics";
import { useGSAP } from "@gsap/react";
import ContentContainer from "../container/contentContainer";
import Hamburger from "./hamburger/Hamburger";
import MobileMenu from "./MobileMenu";
import NavItems from "./NavItems";
import PAGES from "@/dummyData";
import Logo from "@/components/common/logo/Logo";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setFetchedStatus,
  setNavigation,
} from "@/store/slices/navigationSlice";
import { normalizeSiteInfoNavigation } from "@/hooks/useNavigationData";
import { cn } from "@/utils/helpers/cn";

gsap.registerPlugin(useGSAP);

const emptySubscribe = () => () => {};

const CTA = { label: "Explore Collections", href: "/collection" };

const HeaderComponent = ({ data }: any) => {
  const dispatch = useAppDispatch();
  const { header } = useAppSelector((state) => state.navigation);
  const navItems = header.items.length ? header.items : PAGES.header.items;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuOpenRef = useRef(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!data) return;

    dispatch(setNavigation(normalizeSiteInfoNavigation(data)));
    dispatch(setFetchedStatus(true));
  }, [data, dispatch]);

  useEffect(() => {
    menuOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  useGSAP(
    () => {
      if (!mounted) return;
      const q = gsap.utils.selector(headerRef);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* ---------- Intro: bar drops in, border draws, items rise ---------- */
      if (!reduceMotion) {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(headerRef.current, { yPercent: -100, duration: 1 })
          .from(
            q("[data-border]"),
            { scaleX: 0, duration: 1.4, ease: "expo.inOut" },
            0.2,
          )
          .from(
            q("[data-intro]"),
            {
              y: 20,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            },
            0.4,
          );
      }

    },
    { dependencies: [mounted] },
  );

  /* ---------- Hide on scroll down, reveal on scroll up ----------
     Uses live scroll metrics instead of a ScrollTrigger: its `end: "max"`
     was measured once, so after navigating to a page of different height
     it stopped updating and the header got stuck hidden / shown. */
  const hiddenRef = useRef(false);
  const travelRef = useRef(0);

  const setHidden = (hide: boolean) => {
    if (hiddenRef.current === hide || !wrapperRef.current) return;
    if (hide && menuOpenRef.current) return;
    hiddenRef.current = hide;
    gsap.to(wrapperRef.current, {
      yPercent: hide ? -110 : 0,
      duration: hide ? 0.6 : 0.7,
      ease: hide ? "power3.inOut" : "power3.out",
      overwrite: true,
    });
  };

  useScrollMetrics(({ y, delta }) => {
    setScrolled(y > 60);

    if (y < 140) {
      travelRef.current = 0;
      setHidden(false);
      return;
    }

    // Accumulate movement in one direction; reset when it flips. Needs a few
    // px of real travel so trackpad jitter doesn't toggle the bar.
    const t = travelRef.current;
    travelRef.current = Math.sign(delta) === Math.sign(t) ? t + delta : delta;
    if (travelRef.current > 8) setHidden(true);
    else if (travelRef.current < -8) setHidden(false);
  });

  if (!mounted) return null;

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <div
        ref={wrapperRef}
        className="fixed top-0 left-0 z-50 w-full will-change-transform"
      >
        <header
          ref={headerRef}
          className={cn(
            "relative transition-[background-color,backdrop-filter] duration-500",
            scrolled || isMobileMenuOpen
              ? "bg-surface-dark/85 backdrop-blur-xl"
              : "bg-transparent",
          )}
        >
          <ContentContainer
            size="narrow"
            className={cn(
              "flex items-center justify-between gap-6 transition-[height] duration-500",
              scrolled ? "h-[76px] lg:h-[84px]" : "h-[84px] lg:h-[104px]",
            )}
          >
            {/* Logo */}
            <div data-intro className="flex shrink-0 items-center">
              <Logo onClick={closeMenu} />
            </div>

            {/* Nav */}
            <div data-intro className="hidden h-full lg:block">
              {navItems.length > 0 && <NavItems navItems={navItems} />}
            </div>

            {/* Right */}
            <div data-intro className="flex items-center gap-3">
              <PrimaryButton
                href={CTA.href}
                onClick={closeMenu}
                arrow
                variant="primary"
                className="hidden sm:inline-flex"
              >
                {CTA.label}
              </PrimaryButton>

              <button
                type="button"
                aria-label={
                  isMobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/15 bg-white/5 p-2.5 text-white focus:outline-none lg:hidden"
              >
                <Hamburger isOpen={isMobileMenuOpen} />
              </button>
            </div>
          </ContentContainer>

          {/* Bottom hairline (red glow travels along it) */}
          <span
            data-border
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px origin-left overflow-hidden bg-white/10"
          >
            <span className="header-sheen absolute top-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </span>
        </header>
      </div>

      {/* Outside the transformed wrapper so `fixed` stays relative to the viewport */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        onClose={closeMenu}
      />
    </>
  );
};

export default HeaderComponent;
