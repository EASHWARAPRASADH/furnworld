import type { MetadataRoute } from "next";

const BASE = process.env.SITE_URL || "https://www.furnworld.net";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }], sitemap: `${BASE}/sitemap.xml` };
}
