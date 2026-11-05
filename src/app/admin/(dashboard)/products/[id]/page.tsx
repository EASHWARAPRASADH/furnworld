import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { readDb } from "@/lib/db";
import type { Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageTitle } from "@/components/admin/PageTitle";

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const db = await readDb();
  const isNew = id === "new";
  const existing = db.products.find((p) => p.id === id);
  if (!isNew && !existing) notFound();
  const blank: Product = {
    id: "", slug: "", name: "", categoryId: db.categories[0]?.id ?? "", shortDescription: "", description: "", price: null, compareAtPrice: null,
    images: [], featured: false, badge: "", materials: [], dimensions: "", warrantyYears: 3, inStock: true, order: db.products.length + 1, builderModel: "",
  };
  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Products</Link>
      <PageTitle title={isNew ? "New product" : existing!.name} />
      <ProductForm initial={existing ?? blank} categories={db.categories} isNew={isNew} />
    </>
  );
}
