import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryChips({ categories, active }: { categories: Category[]; active?: string }) {
  const base = "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors";
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Link href="/products" className={`${base} ${!active ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:bg-paper-2"}`}>All</Link>
      {categories.map((c) => (
        <Link key={c.id} href={`/products/${c.slug}`} className={`${base} ${active === c.slug ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:bg-paper-2"}`}>{c.name}</Link>
      ))}
    </div>
  );
}
