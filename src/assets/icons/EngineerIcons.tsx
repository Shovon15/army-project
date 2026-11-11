/* Corps of Engineers line icons, same style as MuseumIcons: outline uses
   currentColor, accents use the brand red. */

type IconProps = { className?: string };

/** Arch bridge over water: combat bridging and infrastructure. */
export const BridgeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22h42M3 27h42" />
      <path d="M8 27v9M40 27v9" />
      <path d="M8 22c4-8 10-12 16-12s12 4 16 12" />
    </g>
    <g stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 22v-6M19 22v-9.5M24 22V10M29 22v-9.5M34 22v-6" />
      <path d="M3 41c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2 3 2 6 2 3-2 3-2" />
    </g>
  </svg>
);

/** Shield with a laurel cross: service to the nation and peacekeeping. */
export const ShieldIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4 8 10v12c0 10.5 6.8 18.6 16 22 9.2-3.4 16-11.5 16-22V10Z" />
    </g>
    <g stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 14v16M17 21h14" />
      <path d="M15 31c2.5 2.5 5.5 4 9 4s6.5-1.5 9-4" />
    </g>
  </svg>
);
