import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, Wrench } from "lucide-react";
import { getContent, getProductBySlug } from "@/lib/content";
import { Gallery } from "@/components/ui/Gallery";
import { Price } from "@/components/ui/Price";
import { ProductActions } from "@/components/ui/ProductActions";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const c = await getContent();
  return c.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return {};
  const title = `${data.product.name}${data.category ? ` · ${data.category.name}` : ""}`;
  return {
    title,
    description: `${data.product.shortDescription} ${data.product.description}`.slice(0, 160),
    alternates: { canonical: `/product/${slug}` },
    openGraph: { title, description: data.product.shortDescription, type: "website", url: `/product/${slug}` },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();
  const { product, category, related, settings } = data;

  const crumbs = [{ name: "Home", path: "/" }, { name: "Collection", path: "/products" }, ...(category ? [{ name: category.name, path: `/products/${category.slug}` }] : []), { name: product.name, path: `/product/${product.slug}` }];

  return (
    <>
      <JsonLd data={[productJsonLd(product, category, settings), breadcrumbJsonLd(crumbs)]} />
      <section className="container-x pt-8 pb-16">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {crumbs.map((c, i) => (
            <span key={c.path} className="inline-flex items-center gap-2">
              {i > 0 ? <span className="text-line">/</span> : null}
              {i < crumbs.length - 1 ? <Link href={c.path} className="hover:text-ink">{c.name}</Link> : <span className="text-ink">{c.name}</span>}
            </span>
          ))}
        </nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Gallery images={product.images} alt={product.name} />
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              {product.badge ? <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent">{product.badge}</span> : null}
              <h1 className="font-display display-soft mt-3 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1] tracking-[-0.03em]">{product.name}</h1>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{product.shortDescription}</p>
              <div className="mt-6 flex items-baseline gap-3">
                <Price value={product.price} compareAt={product.compareAtPrice} show={settings.showPrices} symbol={settings.currencySymbol} className="text-[1.6rem]" />
                {settings.showPrices && product.price !== null ? <span className="text-xs text-muted">incl. delivery in Chennai & Karaikal</span> : <span className="text-xs text-muted">· built in our workshop, delivered by our team</span>}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8">
                <ProductActions productName={product.name} builderModel={product.builderModel} whatsapp={settings.whatsapp} siteName={settings.siteName} />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 space-y-6 border-t border-line pt-8">
                <div>
                  <p className="eyebrow mb-2">About this piece</p>
                  <p className="leading-relaxed text-ink/85">{product.description}</p>
                </div>
                {product.materials.length ? (
                  <div>
                    <p className="eyebrow mb-2">Materials</p>
                    <ul className="flex flex-wrap gap-2">
                      {product.materials.map((m) => <li key={m} className="rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-line">{m}</li>)}
                    </ul>
                  </div>
                ) : null}
                {product.dimensions ? (
                  <div>
                    <p className="eyebrow mb-2">Dimensions</p>
                    <p className="text-sm">{product.dimensions}</p>
                  </div>
                ) : null}
                <ul className="grid gap-3 sm:grid-cols-3 text-sm">
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> <Link href="/care" className="link-underline">{product.warrantyYears} year warranty</Link></li>
                  <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Delivered by our team</li>
                  <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-accent" /> Made to order sizes</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="container-x pb-10">
          <h2 className="font-display text-[2rem] tracking-[-0.02em]">You might also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} categoryName={category?.name} showPrices={settings.showPrices} symbol={settings.currencySymbol} />)}
          </div>
        </section>
      ) : null}
    </>
  );
}
