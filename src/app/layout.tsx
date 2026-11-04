import type { Metadata } from "next";
import "./globals.css";
import { BodyFont, HeadingFont, UIFont } from "./font";
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
    <html lang="en">
      <head>
        <meta name="darkreader-lock"></meta>
      </head>
      <body
        className={`${HeadingFont.variable} ${BodyFont.variable} ${UIFont.variable} font-body antialiased`}
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
          </SmoothScroll>
          <ToastListener />
          <CustomCursor />
        </ReduxProvider>
      </body>
    </html>
  );
}
