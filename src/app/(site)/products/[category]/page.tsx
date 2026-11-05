import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { CategoryChips } from "@/components/ui/CategoryChips";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const c = await getContent();
  return c.categories.map((x) => ({ category: x.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  if (!data) return {};
  return { title: `${data.category.name} · made in Chennai & Karaikal`, description: data.category.description, alternates: { canonical: `/products/${category}` }, openGraph: { title: data.category.name, description: data.category.description, url: `/products/${category}` } };
}

export default async function CategoryPage({ params }: PageProps<"/products/[category]">) {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  if (!data) notFound();
  return (
    <>
      <JsonLd data={[itemListJsonLd(data.products, data.category.name), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Collection", path: "/products" }, { name: data.category.name, path: `/products/${category}` }])]} />
      <PageHero eyebrow={data.category.tagline} title={data.category.name} text={data.category.description} image={data.category.image} />
      <section className="container-x py-10">
        <CategoryChips categories={data.categories} active={data.category.slug} />
        <div className="mt-8">
          <ProductGrid products={data.products} categories={data.categories} settings={data.settings} />
        </div>
      </section>
    </>
  );
}
