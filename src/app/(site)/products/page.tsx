import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = { title: "Collection · sofas, cots, dining, wardrobes & office", description: "Every piece Furn World makes: sofas, cots, dining sets, wardrobes, tables, office and study furniture, storage and accents. Built in our own workshop in Tamil Nadu.", alternates: { canonical: "/products" } };

export default async function ProductsPage() {
  const c = await getContent();
  return (
    <>
      <JsonLd data={itemListJsonLd(c.products, "Furn World collection")} />
      <PageHero eyebrow="The collection" title="Every piece we make, in one place" text="Sofas, cots, dining sets, wardrobes, office and study furniture. All designed and built in our own workshop." />
      <section className="container-x py-10">
        <CategoryChips categories={c.categories} />
        <div className="mt-8">
          <ProductGrid products={c.products} categories={c.categories} settings={c.settings} />
        </div>
      </section>
    </>
  );
}
