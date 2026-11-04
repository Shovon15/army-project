import { Boldonse, DM_Sans, Inter } from "next/font/google";

/* Heading face for every title (`.font-heading` and `.font-boldCond`). */
export const HeadingFont = Boldonse({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

export const BodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* Rounded geometric sans for UI copy and buttons (`.font-dmSans`). */
export const UIFont = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});
