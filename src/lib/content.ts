import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { readDb } from "./db";
import type { Database } from "./types";

export const CONTENT_TAG = "content";

/** Public, cached view of the site content. Never exposes admin or enquiries. */
export async function getContent(): Promise<Omit<Database, "admin" | "enquiries">> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  const db = await readDb();
  const { admin: _admin, enquiries: _enquiries, ...rest } = db;
  void _admin;
  void _enquiries;
  return {
    ...rest,
    categories: [...rest.categories].sort((a, b) => a.order - b.order),
    products: [...rest.products].sort((a, b) => a.order - b.order),
  };
}

export async function getProductBySlug(slug: string) {
  const c = await getContent();
  const product = c.products.find((p) => p.slug === slug);
  if (!product) return null;
  const category = c.categories.find((x) => x.id === product.categoryId) ?? null;
  const related = c.products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  return { product, category, related, settings: c.settings };
}

export async function getCategoryBySlug(slug: string) {
  const c = await getContent();
  const category = c.categories.find((x) => x.slug === slug);
  if (!category) return null;
  const products = c.products.filter((p) => p.categoryId === category.id);
  return { category, products, categories: c.categories, settings: c.settings };
}
