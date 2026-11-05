"use client";

import { useState } from "react";
import { MessageCircle, Phone, Trash2 } from "lucide-react";
import type { Enquiry } from "@/lib/types";
import { deleteEnquiryAction, setEnquiryStatusAction } from "@/lib/actions";
import { useSave } from "./useSave";

export function EnquiryList({ items }: { items: Enquiry[]; whatsapp: string }) {
  const [filter, setFilter] = useState<"all" | Enquiry["status"]>("all");
  const { run } = useSave();
  const list = items.filter((e) => filter === "all" || e.status === filter);
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["all", "new", "contacted", "closed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${filter === f ? "bg-ink text-white" : "bg-white ring-1 ring-line"}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((e) => (
          <div key={e.id} className="admin-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{e.name} <span className="text-muted font-normal">· {new Date(e.createdAt).toLocaleString("en-IN")}</span></p>
                <p className="mt-1 text-sm">{e.product || "General enquiry"}</p>
                {e.config ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
                    {Object.entries(e.config).map(([k, v]) => <li key={k} className="rounded-full bg-paper-2 px-2 py-0.5">{k}: {k === "Link" ? <a href={v} className="underline" target="_blank" rel="noreferrer">open</a> : v}</li>)}
                  </ul>
                ) : null}
                {e.message ? <p className="mt-3 text-sm text-muted whitespace-pre-wrap">{e.message}</p> : null}
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 hover:text-accent"><Phone className="h-3.5 w-3.5" /> {e.phone}</a>
                  <a href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
                  {e.email ? <a href={`mailto:${e.email}`} className="hover:text-accent">{e.email}</a> : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select defaultValue={e.status} onChange={(ev) => run(() => setEnquiryStatusAction(e.id, ev.target.value as Enquiry["status"]))} className="input !w-auto !py-2 text-sm">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <button onClick={() => { if (confirm("Delete this enquiry?")) run(() => deleteEnquiryAction(e.id)); }} className="text-muted hover:text-accent" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 ? <p className="text-sm text-muted">Nothing here.</p> : null}
      </div>
    </div>
  );
}
