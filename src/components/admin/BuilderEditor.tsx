"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { BuilderConfig, BuilderSwatch } from "@/lib/types";
import { saveBuilderAction } from "@/lib/actions";
import { Field, SaveBar, Text } from "./fields";
import { useSave } from "./useSave";

function SwatchList({ items, onChange }: { items: BuilderSwatch[]; onChange: (v: BuilderSwatch[]) => void }) {
  const upd = (i: number, patch: Partial<BuilderSwatch>) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-2">
      {items.map((s, i) => (
        <div key={s.id || i} className="flex items-center gap-3 rounded-xl bg-paper p-2">
          <input type="color" value={s.hex} onChange={(e) => upd(i, { hex: e.target.value })} className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent" />
          <input className="input !w-28 font-mono text-xs" value={s.hex} onChange={(e) => upd(i, { hex: e.target.value })} />
          <input className="input flex-1" value={s.name} placeholder="Name" onChange={(e) => upd(i, { name: e.target.value })} />
          <input className="input !w-28" type="number" value={s.price} placeholder="+ price" onChange={(e) => upd(i, { price: Number(e.target.value) })} />
          <button onClick={() => onChange(items.filter((_, k) => k !== i))} className="text-muted hover:text-accent"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { id: "", name: "", hex: "#cccccc", price: 0 }])} className="btn btn-ghost !py-2 text-xs"><Plus className="h-4 w-4" /> Add</button>
    </div>
  );
}

export function BuilderEditor({ initial }: { initial: BuilderConfig }) {
  const [b, setB] = useState(initial);
  const { pending, message, error, run } = useSave();
  return (
    <div className="space-y-6">
      <div className="admin-card p-5">
        <h2 className="font-display mb-4 text-[1.2rem]">Models & base prices</h2>
        <div className="space-y-3">
          {b.models.map((m, i) => (
            <div key={m.id} className="grid gap-3 rounded-xl bg-paper p-3 sm:grid-cols-[8rem_1fr_1fr]">
              <Field label="Name"><Text value={m.name} onChange={(v) => setB({ ...b, models: b.models.map((x, k) => (k === i ? { ...x, name: v } : x)) })} /></Field>
              <Field label="Description"><Text value={m.description} onChange={(v) => setB({ ...b, models: b.models.map((x, k) => (k === i ? { ...x, description: v } : x)) })} /></Field>
              <Field label="Base price (₹)"><Text type="number" value={m.basePrice} onChange={(v) => setB({ ...b, models: b.models.map((x, k) => (k === i ? { ...x, basePrice: Number(v) } : x)) })} /></Field>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-card p-5"><h2 className="font-display mb-4 text-[1.2rem]">Fabrics</h2><SwatchList items={b.fabrics} onChange={(v) => setB({ ...b, fabrics: v })} /></div>
      <div className="admin-card p-5"><h2 className="font-display mb-4 text-[1.2rem]">Wood finishes</h2><SwatchList items={b.woods} onChange={(v) => setB({ ...b, woods: v })} /></div>
      <div className="admin-card grid gap-4 p-5 sm:grid-cols-4">
        <Field label="Per extra sofa seat (₹)"><Text type="number" value={b.seatPrice} onChange={(v) => setB({ ...b, seatPrice: Number(v) })} /></Field>
        <Field label="Bed storage (₹)"><Text type="number" value={b.storagePrice} onChange={(v) => setB({ ...b, storagePrice: Number(v) })} /></Field>
        <Field label="8-seat extension (₹)"><Text type="number" value={b.extensionPrice} onChange={(v) => setB({ ...b, extensionPrice: Number(v) })} /></Field>
        <Field label="Lead time (weeks)"><Text type="number" value={b.leadTimeWeeks} onChange={(v) => setB({ ...b, leadTimeWeeks: Number(v) })} /></Field>
      </div>
      <SaveBar pending={pending} message={message} error={error} onSave={() => run(() => saveBuilderAction(b))} />
    </div>
  );
}
