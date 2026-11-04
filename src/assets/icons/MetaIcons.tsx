type IconProps = { className?: string };

const LINE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Small line icons for card meta rows (date, place) and testimonials. */
export const CalendarIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <g {...LINE}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h2M14 14h2M8 17h2" />
    </g>
  </svg>
);

export const MapPinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <g {...LINE}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </g>
  </svg>
);

export const QuoteIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden>
    <path d="M6 38V26C6 15.6 11.4 9.4 20 8l1.6 4.2C16.8 13.8 14.3 17 14 22h7v16H6Zm22 0V26c0-10.4 5.4-16.6 14-18l1.6 4.2C38.8 13.8 36.3 17 36 22h7v16H28Z" />
  </svg>
);

export const StarIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z" />
  </svg>
);
