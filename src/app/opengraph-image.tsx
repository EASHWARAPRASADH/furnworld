import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "Furn World · Furniture manufacturer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const { settings } = await getContent();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#15120f", color: "#f5f0e8", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#b8893c" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#c8372d" }} />
          Since {settings.foundedYear} · Chennai & Karaikal
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 118, lineHeight: 1, letterSpacing: -4 }}>{settings.siteName}</div>
          <div style={{ fontSize: 36, color: "#cfc6b8", fontFamily: "Helvetica, Arial, sans-serif" }}>Furniture made for the way you live. Design your own in 3D.</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
