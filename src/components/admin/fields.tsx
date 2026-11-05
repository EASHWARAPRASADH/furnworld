"use client";

import { useState, type ReactNode } from "react";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function Text({ value, onChange, placeholder, type = "text" }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input className="input" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function Area({ value, onChange, rows = 4, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return <textarea className="input" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="flex items-center gap-3 text-sm">
      <span className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-ink" : "bg-paper-3"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export async function uploadFiles(files: FileList | File[]): Promise<string[]> {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append("file", f));
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const json = (await res.json()) as { urls: string[] };
  return json.urls;
}

/** Single image: upload or paste a URL. */
export function ImageField({ value, onChange, label = "Image" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex gap-3">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-paper-2 ring-1 ring-line">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : null}
          {busy ? <span className="absolute inset-0 grid place-items-center bg-white/70"><Loader2 className="h-5 w-5 animate-spin" /></span> : null}
        </div>
        <div className="flex-1 space-y-2">
          <input className="input" value={value} placeholder="/uploads/… or https://…" onChange={(e) => onChange(e.target.value)} />
          <div className="flex gap-2">
            <label className="btn btn-ghost !py-2 !px-3 text-xs cursor-pointer">
              <ImagePlus className="h-4 w-4" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                if (!e.target.files?.length) return;
                setBusy(true);
                try { const [url] = await uploadFiles(e.target.files); if (url) onChange(url); } finally { setBusy(false); e.target.value = ""; }
              }} />
            </label>
            {value ? <button type="button" onClick={() => onChange("")} className="btn btn-ghost !py-2 !px-3 text-xs"><X className="h-4 w-4" /> Clear</button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Multiple images with reorder and remove. */
export function ImagesField({ value, onChange, label = "Images" }: { value: string[]; onChange: (v: string[]) => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div key={img + i} className="group relative h-24 w-32 overflow-hidden rounded-xl bg-paper-2 ring-1 ring-line">
            <img src={img} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 p-1 text-white opacity-0 transition group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} className="px-1 text-xs">◀</button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="px-1"><Trash2 className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => move(i, 1)} className="px-1 text-xs">▶</button>
            </div>
            {i === 0 ? <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 text-[0.6rem] font-semibold uppercase">Main</span> : null}
          </div>
        ))}
        <label className="grid h-24 w-32 cursor-pointer place-items-center rounded-xl border border-dashed border-line text-xs text-muted hover:bg-paper-2">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="flex flex-col items-center gap-1"><ImagePlus className="h-5 w-5" /> Add</span>}
          <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
            if (!e.target.files?.length) return;
            setBusy(true);
            try { const urls = await uploadFiles(e.target.files); onChange([...value, ...urls]); } finally { setBusy(false); e.target.value = ""; }
          }} />
        </label>
      </div>
      <input className="input mt-3 text-xs" placeholder="Or paste an image URL and press Enter" onKeyDown={(e) => {
        if (e.key === "Enter") { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) { onChange([...value, v]); (e.target as HTMLInputElement).value = ""; } }
      }} />
    </div>
  );
}

export function TagsField({ value, onChange, label, placeholder }: { value: string[]; onChange: (v: string[]) => void; label: string; placeholder?: string }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-white p-2">
        {value.map((t, i) => (
          <span key={t + i} className="inline-flex items-center gap-1 rounded-full bg-paper-2 px-3 py-1 text-sm">
            {t}<button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))}><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input className="min-w-[8rem] flex-1 bg-transparent px-2 py-1 text-sm outline-none" placeholder={placeholder ?? "Type and press Enter"} onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) { onChange([...value, v]); (e.target as HTMLInputElement).value = ""; } }
        }} />
      </div>
    </div>
  );
}

export function SaveBar({ pending, message, error, onSave, label = "Save changes" }: { pending: boolean; message?: string | null; error?: string | null; onSave: () => void; label?: string }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex items-center justify-between gap-4 border-t border-line bg-paper/90 px-6 py-4 backdrop-blur">
      <div className="text-sm">
        {error ? <span className="text-accent">{error}</span> : null}
        {message ? <span className="text-green-700">{message}</span> : null}
      </div>
      <button type="button" onClick={onSave} disabled={pending} className="btn btn-primary disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {label}</button>
    </div>
  );
}
