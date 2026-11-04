import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_INFORMATION } from "@/config/seo";

// Default link-preview image (Facebook, X, WhatsApp, Slack…) for every page
// that does not set its own. Social sites cannot show SVGs, so this is a PNG.
export const alt = SITE_INFORMATION.metaTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "src/assets/images/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          background: "radial-gradient(circle at 50% 120%, rgba(230,31,37,0.45), #050505 60%)",
          color: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={300} height={300} alt="" />
        <div style={{ display: "flex", marginTop: 36, fontSize: 64, fontWeight: 800, letterSpacing: 4 }}>
          {SITE_INFORMATION.appName.toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
