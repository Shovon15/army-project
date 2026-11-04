import { ImageResponse } from "next/og";
import { BRAND_MARK_DATA_URI } from "@/lib/metadata/brandMark";

// iOS home-screen icon (Safari ignores SVG favicons).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BRAND_MARK_DATA_URI} width={148} height={148} alt="" />
      </div>
    ),
    size,
  );
}
