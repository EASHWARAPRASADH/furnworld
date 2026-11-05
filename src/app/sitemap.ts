import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

const BASE = process.env.SITE_URL || "https://www.furnworld.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  const statics = ["", "/products", "/builder", "/about", "/contact", "/faq", "/care"].map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 }));
  const cats = c.categories.map((x) => ({ url: `${BASE}/products/${x.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }));
  const prods = c.products.map((p) => ({ url: `${BASE}/product/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...statics, ...cats, ...prods];
}
