import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/content";
import { abs } from "@/lib/seo";

export const alt = "Furn World product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  const name = data?.product.name ?? "Furn World";
  const img = data?.product.images[0] ? abs(data.product.images[0]) : null;
  const cat = data?.category?.name ?? "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#15120f", color: "#f5f0e8" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, fontFamily: "Georgia, serif" }}>
          <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#b8893c" }}>{cat}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2 }}>{name}</div>
            <div style={{ fontSize: 26, color: "#cfc6b8", fontFamily: "Helvetica, Arial, sans-serif" }}>Furn World · made in Tamil Nadu since 1999</div>
          </div>
        </div>
        {img ? <img src={img} alt="" style={{ width: 560, height: 630, objectFit: "cover" }} /> : null}
      </div>
    ),
    { ...size }
  );
}
