import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";
import { SITE_URL, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "WONK", "opsz"], display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const viewport: Viewport = { themeColor: "#15120f", width: "device-width", initialScale: 1 };

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.seoTitle, template: `%s · ${settings.siteName}` },
    description: settings.seoDescription,
    applicationName: settings.siteName,
    keywords: ["furniture manufacturer Chennai", "furniture shop Karaikal", "sofa set Chennai", "wooden cot", "dining table", "wardrobe", "office furniture", "custom furniture Tamil Nadu", settings.siteName],
    authors: [{ name: settings.siteName, url: SITE_URL }],
    creator: settings.siteName,
    publisher: settings.siteName,
    formatDetection: { telephone: true, email: true, address: true },
    icons: { icon: "/images/brand/favicon.png", apple: "/images/brand/favicon.png" },
    manifest: "/manifest.webmanifest",
    alternates: { canonical: "/" },
    openGraph: { title: settings.seoTitle, description: settings.seoDescription, siteName: settings.siteName, type: "website", locale: "en_IN", url: SITE_URL },
    twitter: { card: "summary_large_image", title: settings.seoTitle, description: settings.seoDescription },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    category: "shopping",
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { settings, branches } = await getContent();
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <JsonLd data={[organizationJsonLd(settings, branches), websiteJsonLd(settings)]} />
      </head>
      <body className="min-h-full flex flex-col grain">{children}</body>
    </html>
  );
}
