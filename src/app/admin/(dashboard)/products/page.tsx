import Link from "next/link";
import { Plus } from "lucide-react";
import { readDb } from "@/lib/db";
import { PageTitle } from "@/components/admin/PageTitle";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function AdminProducts() {
  const db = await readDb();
  const products = [...db.products].sort((a, b) => a.order - b.order);
  return (
    <>
      <PageTitle title="Products" text={`${products.length} products across ${db.categories.length} categories.`} action={<Link href="/admin/products/new" className="btn btn-primary !py-2.5"><Plus className="h-4 w-4" /> New product</Link>} />
      <ProductTable products={products} categories={db.categories} showPrices={db.settings.showPrices} />
    </>
  );
}
