/* Museum line icons. Outline uses currentColor (works on light and dark),
   accents use the brand red. */

type IconProps = { className?: string };

/** Carved mask / sculpture head. */
export const MaskIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4c-9 0-15 6.5-15 15 0 5.4 2.2 9.3 5 11.8V38a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-7.2c2.8-2.5 5-6.4 5-11.8C39 10.5 33 4 24 4Z" />
      <path d="M18 42v-5M22 42v-5M26 42v-5M30 42v-5" />
      <path d="M22 30.5 24 27l2 3.5Z" />
    </g>
    <g stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="17.5" cy="21" rx="4" ry="3.2" />
      <ellipse cx="30.5" cy="21" rx="4" ry="3.2" />
      <path d="M15 12.5c1.5-1.2 3.3-1.8 5-1.8M33 12.5c-1.5-1.2-3.3-1.8-5-1.8" />
    </g>
  </svg>
);

/** Easel holding a framed painting. */
export const EaselIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6h36M24 3v3" />
      <rect x="8" y="9" width="32" height="25" rx="1.5" />
      <path d="M16 34l-4 11M32 34l4 11M24 34v8" />
    </g>
    <g stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="23" y="13" width="13" height="11" rx="1" />
      <path d="M23 21l3.5-3.5 3 3 2.5-2 4 3.5" />
      <rect x="12" y="13" width="7" height="17" rx="1" />
      <path d="M14.5 18.5h2M14.5 22h2M14.5 25.5h2" />
      <path d="M23 28h13" />
    </g>
  </svg>
);

const OUTLINE = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const ACCENT = { ...OUTLINE, stroke: "var(--primary)" };

/** Greek amphora with painted band. */
export const VaseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g {...OUTLINE}>
      <path d="M18 4h12M19 4v5c0 1.5-1 2.5-2.5 3.5C12 15.5 9 20 9 26c0 8 6 14 15 14s15-6 15-14c0-6-3-10.5-7.5-13.5C30 11.5 29 10.5 29 9V4" />
      <path d="M16 40l-1 4h18l-1-4" />
      <path d="M12 15c-3 0-5 2-5 4.5S9 24 11 24M36 15c3 0 5 2 5 4.5S39 24 37 24" />
    </g>
    <g {...ACCENT}>
      <path d="M11 22h26M11 30h26" />
      <circle cx="17" cy="26" r="1.6" />
      <circle cx="24" cy="26" r="1.6" />
      <circle cx="31" cy="26" r="1.6" />
    </g>
  </svg>
);

/** Classical column (antiquity). */
export const ColumnIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g {...OUTLINE}>
      <path d="M8 10h32L24 3 8 10Z" />
      <path d="M10 10v4h28v-4" />
      <path d="M13 14v24M35 14v24" />
      <path d="M9 38h30v4H9zM6 42h36v3H6z" />
    </g>
    <g {...ACCENT}>
      <path d="M19 17v18M24 17v18M29 17v18" />
      <circle cx="24" cy="7.5" r="1.2" />
    </g>
  </svg>
);

/** Painter's palette with brush. */
export const PaletteIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g {...OUTLINE}>
      <path d="M24 5C13 5 5 13 5 23s8 19 18 19c3 0 4-2 4-4 0-1.5-1-2.4-1-4 0-2.2 1.8-4 4-4h5c5.5 0 8-3.6 8-8C43 12 34.5 5 24 5Z" />
      <circle cx="15" cy="30" r="3" />
    </g>
    <g {...ACCENT}>
      <circle cx="14" cy="19" r="2.4" />
      <circle cx="22" cy="13" r="2.4" />
      <circle cx="31" cy="14" r="2.4" />
      <path d="M33 22l11-11" />
    </g>
  </svg>
);

/** Admission ticket (visitors). */
export const TicketIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g {...OUTLINE}>
      <path d="M5 14h38v6a4 4 0 0 0 0 8v6H5v-6a4 4 0 0 0 0-8v-6Z" />
      <path d="M32 14v4M32 22v4M32 30v4" strokeDasharray="0" />
    </g>
    <g {...ACCENT}>
      <path d="M12 21h13M12 27h9" />
      <circle cx="38" cy="24" r="0.6" />
    </g>
  </svg>
);
