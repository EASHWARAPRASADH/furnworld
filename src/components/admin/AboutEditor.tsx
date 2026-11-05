"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { AboutContent } from "@/lib/types";
import { saveAboutAction } from "@/lib/actions";
import { Area, Field, ImageField, ImagesField, SaveBar, Text } from "./fields";
import { useSave } from "./useSave";

export function AboutEditor({ initial }: { initial: AboutContent }) {
  const [a, setA] = useState(initial);
  const { pending, message, error, run } = useSave();
  const set = (patch: Partial<AboutContent>) => setA((x) => ({ ...x, ...patch }));

  const listEditor = <K extends "stats" | "values" | "process">(key: K, fields: { k: keyof AboutContent[K][number]; label: string; area?: boolean }[]) => (
    <div className="space-y-3">
      {a[key].map((item, i) => (
        <div key={item.id || i} className="flex gap-3 rounded-xl bg-paper p-3">
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={String(f.k)} label={f.label}>
                {f.area ? (
                  <Area rows={2} value={String((item as unknown as Record<string, string>)[String(f.k)])} onChange={(v) => set({ [key]: a[key].map((x, k) => (k === i ? { ...x, [f.k]: v } : x)) } as Partial<AboutContent>)} />
                ) : (
                  <Text value={String((item as unknown as Record<string, string>)[String(f.k)])} onChange={(v) => set({ [key]: a[key].map((x, k) => (k === i ? { ...x, [f.k]: v } : x)) } as Partial<AboutContent>)} />
                )}
              </Field>
            ))}
          </div>
          <button onClick={() => set({ [key]: a[key].filter((_, k) => k !== i) } as Partial<AboutContent>)} className="self-start text-muted hover:text-accent"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <button onClick={() => set({ [key]: [...a[key], Object.fromEntries([["id", ""], ...fields.map((f) => [f.k, ""])])] } as Partial<AboutContent>)} className="btn btn-ghost !py-2 text-xs"><Plus className="h-4 w-4" /> Add</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="admin-card space-y-4 p-5">
        <Field label="Small line"><Text value={a.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
        <Field label="Title"><Text value={a.title} onChange={(v) => set({ title: v })} /></Field>
        <Field label="Intro"><Area rows={3} value={a.intro} onChange={(v) => set({ intro: v })} /></Field>
        <Field label="Story paragraphs" hint="Separate paragraphs with a blank line">
          <Area rows={10} value={a.story.join("\n\n")} onChange={(v) => set({ story: v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })} />
        </Field>
        <ImageField label="Main image" value={a.heroImage} onChange={(v) => set({ heroImage: v })} />
        <ImagesField label="Gallery" value={a.galleryImages} onChange={(v) => set({ galleryImages: v })} />
      </div>
      <div className="admin-card p-5"><h2 className="font-display mb-4 text-[1.2rem]">Numbers</h2>{listEditor("stats", [{ k: "value", label: "Value" }, { k: "label", label: "Label" }])}</div>
      <div className="admin-card p-5"><h2 className="font-display mb-4 text-[1.2rem]">Values</h2>{listEditor("values", [{ k: "title", label: "Title" }, { k: "text", label: "Text", area: true }])}</div>
      <div className="admin-card p-5"><h2 className="font-display mb-4 text-[1.2rem]">Process steps</h2>{listEditor("process", [{ k: "title", label: "Title" }, { k: "text", label: "Text", area: true }])}</div>
      <SaveBar pending={pending} message={message} error={error} onSave={() => run(() => saveAboutAction(a))} />
    </div>
  );
}
