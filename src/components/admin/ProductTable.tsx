"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, Star, Trash2 } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { deleteProductAction, duplicateProductAction, saveProductAction } from "@/lib/actions";
import { useSave } from "./useSave";
import { formatINR } from "@/lib/format";

export function ProductTable({ products, categories, showPrices }: { products: Product[]; categories: Category[]; showPrices: boolean }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const { run, pending } = useSave();
  const list = products.filter((p) => (!cat || p.categoryId === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input className="input !w-auto min-w-[16rem]" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input !w-auto" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="admin-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-[0.1em] text-muted">
            <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3 hidden md:table-cell">Category</th><th className="px-4 py-3 hidden sm:table-cell">Price</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-paper/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                    <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-paper-2">{p.images[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : null}</span>
                    <span><span className="block font-medium">{p.name}</span><span className="block text-xs text-muted">/{p.slug}{p.badge ? ` · ${p.badge}` : ""}</span></span>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted">{catName(p.categoryId)}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{showPrices ? formatINR(p.price) : "—"}</td>
                <td className="px-4 py-3">
                  <button disabled={pending} onClick={() => run(() => saveProductAction({ ...p, featured: !p.featured }), { message: p.featured ? "Removed from featured" : "Added to featured" })} aria-label="Toggle featured" className={p.featured ? "text-brass" : "text-muted/40 hover:text-muted"}>
                    <Star className={`h-5 w-5 ${p.featured ? "fill-current" : ""}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 text-muted">
                    <button onClick={() => run(() => duplicateProductAction(p.id), { message: "Duplicated." })} aria-label="Duplicate" className="hover:text-ink"><Copy className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm(`Delete ${p.name}?`)) run(() => deleteProductAction(p.id), { message: "Deleted." }); }} aria-label="Delete" className="hover:text-accent"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 ? <p className="p-6 text-sm text-muted">No products match.</p> : null}
      </div>
    </div>
  );
}
