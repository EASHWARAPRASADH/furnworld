"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import type { Category, Product, Settings } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, categories, settings }: { products: Product[]; categories: Category[]; settings: Settings }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const catName = (id: string) => categories.find((c) => c.id === id)?.name;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = products.filter((p) => !needle || `${p.name} ${p.shortDescription} ${catName(p.categoryId) ?? ""}`.toLowerCase().includes(needle));
    if (sort === "price-asc") out = [...out].sort((a, b) => (a.price ?? 1e12) - (b.price ?? 1e12));
    if (sort === "price-desc") out = [...out].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") out = [...out].sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, q, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the collection" className="input !pl-11 !rounded-full" />
        </label>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">{list.length} pieces</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input !w-auto !rounded-full !py-2.5">
            <option value="featured">Featured first</option>
            <option value="name">Name A to Z</option>
            {settings.showPrices ? <option value="price-asc">Price low to high</option> : null}
            {settings.showPrices ? <option value="price-desc">Price high to low</option> : null}
          </select>
        </div>
      </div>
      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 8) * 0.04 }}>
              <ProductCard product={p} categoryName={catName(p.categoryId)} showPrices={settings.showPrices} symbol={settings.currencySymbol} priority={i < 4} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 ? <p className="mt-12 text-center text-muted">Nothing matches that search. Try a different word or ask us on WhatsApp.</p> : null}
    </div>
  );
}
