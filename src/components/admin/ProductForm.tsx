"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/types";
import { saveProductAction, deleteProductAction } from "@/lib/actions";
import { Area, Field, ImagesField, SaveBar, TagsField, Text, Toggle } from "./fields";
import { useSave } from "./useSave";

export function ProductForm({ initial, categories, isNew }: { initial: Product; categories: Category[]; isNew: boolean }) {
  const [p, setP] = useState<Product>(initial);
  const { pending, message, error, run } = useSave();
  const router = useRouter();
  const set = (patch: Partial<Product>) => setP((x) => ({ ...x, ...patch }));

  const save = () => run(() => saveProductAction(p), { then: (r) => { if (r.ok && isNew && r.id) router.replace(`/admin/products/${r.id}`); } });
  const del = () => { if (confirm("Delete this product?")) run(() => deleteProductAction(p.id), { then: (r) => { if (r.ok) router.push("/admin/products"); } }); };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-5">
        <div className="admin-card space-y-4 p-5">
          <Field label="Name"><Text value={p.name} onChange={(v) => set({ name: v })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="URL slug" hint="Leave blank to generate from the name"><Text value={p.slug} onChange={(v) => set({ slug: v })} /></Field>
            <Field label="Category">
              <select className="input" value={p.categoryId} onChange={(e) => set({ categoryId: e.target.value })}>
                <option value="">Choose…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Short description" hint="One line, shown on cards"><Text value={p.shortDescription} onChange={(v) => set({ shortDescription: v })} /></Field>
          <Field label="Full description"><Area rows={5} value={p.description} onChange={(v) => set({ description: v })} /></Field>
        </div>
        <div className="admin-card p-5">
          <ImagesField value={p.images} onChange={(v) => set({ images: v })} label="Photos (first is the main image)" />
        </div>
        <div className="admin-card space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (₹)" hint="Blank = price on request"><Text type="number" value={p.price ?? ""} onChange={(v) => set({ price: v === "" ? null : Number(v) })} /></Field>
            <Field label="Compare-at price (₹)" hint="Shown struck through"><Text type="number" value={p.compareAtPrice ?? ""} onChange={(v) => set({ compareAtPrice: v === "" ? null : Number(v) })} /></Field>
            <Field label="Warranty (years)"><Text type="number" value={p.warrantyYears} onChange={(v) => set({ warrantyYears: Number(v) })} /></Field>
          </div>
          <TagsField label="Materials" value={p.materials} onChange={(v) => set({ materials: v })} />
          <Field label="Dimensions"><Text value={p.dimensions} onChange={(v) => set({ dimensions: v })} placeholder="e.g. 84 x 36 x 33 in" /></Field>
        </div>
      </div>
      <div className="space-y-5">
        <div className="admin-card space-y-4 p-5">
          <Toggle value={p.featured} onChange={(v) => set({ featured: v })} label="Featured on home page" />
          <Toggle value={p.inStock} onChange={(v) => set({ inStock: v })} label="Available to order" />
          <Field label="Badge" hint="e.g. New, Bestseller, Handcrafted"><Text value={p.badge} onChange={(v) => set({ badge: v })} /></Field>
          <Field label="3D builder model" hint="Shows a 'Customise in 3D' button">
            <select className="input" value={p.builderModel} onChange={(e) => set({ builderModel: e.target.value as Product["builderModel"] })}>
              <option value="">None</option>
              <option value="sofa">Sofa</option>
              <option value="chair">Lounge chair</option>
              <option value="bed">Cot / bed</option>
              <option value="dining">Dining table</option>
            </select>
          </Field>
          <Field label="Sort order"><Text type="number" value={p.order} onChange={(v) => set({ order: Number(v) })} /></Field>
        </div>
        {!isNew ? (
          <div className="admin-card p-5 text-sm space-y-3">
            <Link href={`/product/${p.slug}`} target="_blank" className="block hover:text-accent">View on site ↗</Link>
            <button onClick={del} className="text-accent hover:underline">Delete product</button>
          </div>
        ) : null}
      </div>
      <div className="lg:col-span-2"><SaveBar pending={pending} message={message} error={error} onSave={save} label={isNew ? "Create product" : "Save changes"} /></div>
    </div>
  );
}
