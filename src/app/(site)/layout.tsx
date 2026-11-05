import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Preloader } from "@/components/fx/Preloader";
import { Cursor } from "@/components/fx/Cursor";
import { getContent } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { settings, categories, branches } = await getContent();
  return (
    <SmoothScroll>
      <Preloader name={settings.siteName} />
      <Cursor />
      <Header settings={settings} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} branches={branches} />
      <WhatsAppFab number={settings.whatsapp} siteName={settings.siteName} />
    </SmoothScroll>
  );
}
