import type { Metadata } from "next";
import "./globals.css";
import { FONT_VARIABLE_CLASSES } from "./font";
import { buildFontThemeCss, fontInitScript } from "@/config/fonts";
import FontSwitcher from "@/components/common/fontSwitcher/FontSwitcher";
import CustomCursor from "@/components/common/cursor/CustomCursor";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/common/button/BackToTop";
import SmoothScroll from "@/components/layout/container/SmoothScroll";
import ReduxProvider from "@/store/provider";
import ToastListener from "@/components/common/toast/toastListener";
import { SITE_INFORMATION } from "@/config/seo";

export const metadata: Metadata = {
  title: SITE_INFORMATION.metaTitle,
  description: SITE_INFORMATION.metaDescription,
  keywords: SITE_INFORMATION.keywords,
  metadataBase: new URL(SITE_INFORMATION.url || "http://localhost:4004"),
  applicationName: SITE_INFORMATION.appName,
  // Favicon (src/app/icon.svg), apple-icon and opengraph-image are picked up
  // automatically from the app folder.
  openGraph: {
    title: SITE_INFORMATION.socialTitle,
    description: SITE_INFORMATION.socialDescription,
    siteName: SITE_INFORMATION.appName,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_INFORMATION.socialTitle,
    description: SITE_INFORMATION.socialDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: fontInitScript may set data-font before React hydrates.
    <html lang="en" className={FONT_VARIABLE_CLASSES} suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock"></meta>
        {/* Font presets (src/config/fonts.ts) + apply the saved one before paint */}
        <style dangerouslySetInnerHTML={{ __html: buildFontThemeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: fontInitScript }} />
      </head>
      <body
        className="font-body antialiased"
      >
        {/* End Google Tag Manager (noscript) */}
        <ReduxProvider>
          <SmoothScroll>
            <Header />
            <div className="min-h-[calc(100dvh-338px)] md:min-h-[calc(100dvh-360px)] bg-background">
              {children}
            </div>
            <Footer />
            <BackToTop />
            <FontSwitcher />
          </SmoothScroll>
          <ToastListener />
          <CustomCursor />
        </ReduxProvider>
      </body>
    </html>
  );
}
