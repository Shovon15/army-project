import { ImageResponse } from "next/og";
import { BRAND_MARK_DATA_URI, BRAND_RED } from "@/lib/metadata/brandMark";
import { SITE_INFORMATION } from "@/config/seo";

// Default link-preview image (Facebook, X, WhatsApp, Slack…) for every page
// that does not set its own. Social sites cannot show SVGs, so this is a PNG.
export const alt = SITE_INFORMATION.metaTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at 50% 120%, rgba(230,31,37,0.45), #050505 60%)`,
          color: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BRAND_MARK_DATA_URI} width={170} height={170} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: 8,
          }}
        >
          MUSEON
          <span style={{ color: BRAND_RED }}>.</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 34,
            letterSpacing: 6,
            color: "rgba(255,255,255,0.75)",
            textTransform: "uppercase",
          }}
        >
          Art Gallery &amp; Museum
        </div>
      </div>
    ),
    size,
  );
}
