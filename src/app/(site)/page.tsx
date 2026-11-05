import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { Featured } from "@/components/home/Featured";
import { BuilderTeaser } from "@/components/home/BuilderTeaser";
import { Banners } from "@/components/home/Banners";
import { Craft } from "@/components/home/Craft";
import { Testimonials } from "@/components/home/Testimonials";
import { Showrooms } from "@/components/home/Showrooms";
import { Marquee } from "@/components/ui/Marquee";
import { ImageMarquee } from "@/components/home/ImageMarquee";
import { FaqTeaser } from "@/components/home/FaqTeaser";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const c = await getContent();
  const featured = c.products.filter((p) => p.featured).slice(0, 8);
  const counts: Record<string, number> = {};
  for (const p of c.products) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  const marqueeItems = [...c.categories.map((x) => x.name), "Made in Tamil Nadu", `Since ${c.settings.foundedYear}`, "Manufacturer direct", "Made to measure"];
  const thumbs = c.products.filter((p) => p.images[0]).slice(0, 14).map((p) => ({ src: p.images[0], alt: p.name, href: `/product/${p.slug}` }));

  return (
    <>
      <Hero slides={c.hero} settings={c.settings} builder={c.builder} />
      <Marquee className="border-y border-line bg-paper py-4" speed={45}>
        {marqueeItems.map((t, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-6 font-display text-[1.2rem] tracking-[-0.01em]">
            {t} <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>
      <Categories categories={c.categories} counts={counts} />
      <Featured products={featured} categories={c.categories} settings={c.settings} />
      <ImageMarquee items={thumbs} />
      <BuilderTeaser config={c.builder} showPrices={c.settings.showPrices} symbol={c.settings.currencySymbol} />
      <Banners banners={c.banners} />
      <Craft about={c.about} />
      <Testimonials items={c.testimonials} />
      <FaqTeaser faqs={c.faqs.slice(0, 4)} />
      <Showrooms branches={c.branches} settings={c.settings} />
    </>
  );
}
