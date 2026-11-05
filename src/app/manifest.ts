import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Furn World",
    short_name: "Furn World",
    description: "Furniture manufacturer in Chennai and Karaikal. Sofas, cots, dining sets, wardrobes and a 3D builder.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0e8",
    theme_color: "#15120f",
    icons: [{ src: "/images/brand/favicon.png", sizes: "any", type: "image/png" }],
  };
}
