/**
 * The Museon badge (red circle + bust) as a standalone SVG string, for places
 * that cannot use the <Logo> component: the generated apple icon and the
 * social share image. Keep in sync with LogoMark in components/common/logo,
 * src/app/icon.svg and public/logo.svg.
 */
export const BRAND_RED = "#e61f25";

export const BRAND_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${BRAND_RED}"/><g fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M16 22c0-6 3.6-10.5 8-10.5S32 16 32 22c0 3.2-.8 5.6-2 7.4"/><path d="M18 29.4c-1.2-1.8-2-4.2-2-7.4"/><path d="M17.5 17h13"/><path d="M20.5 20.5c0 4 1.6 6.5 3.5 6.5s3.5-2.5 3.5-6.5"/><path d="M22.4 22.2h.01M25.6 22.2h.01" stroke-width="2.4"/><path d="M14 37c.8-4.4 4.2-7.2 10-7.2S33.2 32.6 34 37"/><path d="M19 37l2.4-5M29 37l-2.4-5"/></g></svg>`;

export const BRAND_MARK_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(BRAND_MARK_SVG).toString("base64")}`;
