import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category, Product, Settings } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Featured({ products, categories, settings }: { products: Product[]; categories: Category[]; settings: Settings }) {
  const catName = (id: string) => categories.find((c) => c.id === id)?.name;
  return (
    <section className="container-x py-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Featured pieces" title="Chosen by our customers, finished by our hands" />
        <Reveal>
          <Link href="/products" className="btn btn-ghost">All products <ArrowUpRight className="arrow h-4 w-4" /></Link>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.08} as="div">
            <ProductCard product={p} categoryName={catName(p.categoryId)} showPrices={settings.showPrices} symbol={settings.currencySymbol} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
