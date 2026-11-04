import {
  Boldonse,
  Cinzel,
  DM_Sans,
  Inter,
  Jost,
  Lato,
  Lora,
  Manrope,
  Montserrat,
  Noto_Sans,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Roboto,
  Syne,
} from "next/font/google";

/*
 * Every web font the site can use. Each font only exposes a CSS variable
 * (--ff-*); which variable is used for headings / body / UI, and with what
 * line heights, is decided by the presets in src/config/fonts.ts.
 *
 * To add a Google font: load it here with a new --ff-* variable, add it to
 * FONT_VARIABLE_CLASSES, then reference it from a preset. (System fonts such
 * as Arial, Segoe UI or SF Pro need nothing here: presets list them directly.)
 *
 * Only the default preset's fonts are preloaded; the rest download the first
 * time the font switcher is opened.
 */

// ---- Default preset ("Modern Bold") ----
const boldonse = Boldonse({ subsets: ["latin"], weight: "400", variable: "--ff-boldonse", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--ff-inter", display: "swap" });
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--ff-dm-sans",
  display: "swap",
});

// ---- Other presets (lazy) ----

const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-playfair" });
const lora = Lora({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-lora" });
const syne = Syne({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-syne" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-manrope" });
const cinzel = Cinzel({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-cinzel" });
const jost = Jost({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-jost" });
const roboto = Roboto({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-roboto" });
const openSans = Open_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-open-sans" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-montserrat" });
const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--ff-noto-sans" });
// Static (non-variable) families need their weights listed.
const poppins = Poppins({ subsets: ["latin"], display: "swap", preload: false, weight: ["300", "400", "500", "600", "700", "800"], variable: "--ff-poppins" });
const lato = Lato({ subsets: ["latin"], display: "swap", preload: false, weight: ["300", "400", "700", "900"], variable: "--ff-lato" });

/** Put on <html> so every --ff-* variable is available to the presets. */
export const FONT_VARIABLE_CLASSES = [
  boldonse,
  inter,
  dmSans,
  playfair,
  lora,
  syne,
  manrope,
  cinzel,
  jost,
  roboto,
  openSans,
  montserrat,
  notoSans,
  poppins,
  lato,
]
  .map((font) => font.variable)
  .join(" ");
