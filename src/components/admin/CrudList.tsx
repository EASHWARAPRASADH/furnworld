"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import { useSave } from "./useSave";

type Result = { ok: true; id?: string } | { ok: false; error: string };

export function CrudList<T extends { id: string }>({
  items,
  blank,
  title,
  subtitle,
  thumb,
  renderFields,
  onSave,
  onDelete,
  onReorder,
  addLabel = "Add new",
}: {
  items: T[];
  blank: () => T;
  title: (item: T) => string;
  subtitle?: (item: T) => string;
  thumb?: (item: T) => string | undefined;
  renderFields: (item: T, set: (patch: Partial<T>) => void) => ReactNode;
  onSave: (item: T) => Promise<Result>;
  onDelete: (id: string) => Promise<Result>;
  onReorder?: (ids: string[]) => Promise<Result>;
  addLabel?: string;
}) {
  const [list, setList] = useState<T[]>(items);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const { pending, message, error, run } = useSave();

  const startNew = () => { const b = blank(); setDraft(b); setOpenId("__new__"); };
  const editing = openId === "__new__" ? draft : list.find((x) => x.id === openId) ?? null;
  const setEditing = (patch: Partial<T>) => {
    if (openId === "__new__") setDraft((d) => (d ? { ...d, ...patch } : d));
    else setList((l) => l.map((x) => (x.id === openId ? { ...x, ...patch } : x)));
  };
  const save = () => {
    if (!editing) return;
    run(() => onSave(editing), {
      then: (r) => {
        if (r.ok && openId === "__new__" && r.id) { setList((l) => [...l, { ...editing, id: r.id! }]); setDraft(null); setOpenId(null); }
      },
    });
  };
  const del = (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    run(() => onDelete(id), { then: (r) => { if (r.ok) { setList((l) => l.filter((x) => x.id !== id)); if (openId === id) setOpenId(null); } }, message: "Deleted." });
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
    if (onReorder) run(() => onReorder(next.map((x) => x.id)), { message: "Order saved." });
  };

  return (
    <div className="space-y-3">
      {list.map((item, i) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="admin-card overflow-hidden">
            <div className="flex items-center gap-4 px-4 py-3">
              {thumb && thumb(item) ? <img src={thumb(item)} alt="" className="h-12 w-16 rounded-lg object-cover bg-paper-2" /> : null}
              <button onClick={() => setOpenId(open ? null : item.id)} className="flex-1 text-left">
                <p className="font-medium">{title(item) || <span className="text-muted">Untitled</span>}</p>
                {subtitle ? <p className="text-xs text-muted">{subtitle(item)}</p> : null}
              </button>
              {onReorder ? (
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} className="text-muted hover:text-ink" aria-label="Move up"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => move(i, 1)} className="text-muted hover:text-ink" aria-label="Move down"><ChevronDown className="h-4 w-4" /></button>
                </div>
              ) : null}
              <button onClick={() => del(item.id)} className="text-muted hover:text-accent" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              <button onClick={() => setOpenId(open ? null : item.id)} className="btn btn-ghost !py-2 !px-3 text-xs">{open ? "Close" : "Edit"}</button>
            </div>
            <AnimatePresence initial={false}>
              {open && editing ? (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="space-y-4 border-t border-line bg-paper/60 p-5">
                    {renderFields(editing, setEditing)}
                    <div className="flex items-center gap-3 pt-2">
                      <button onClick={save} disabled={pending} className="btn btn-primary !py-2.5 disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save</button>
                      {message ? <span className="text-sm text-green-700">{message}</span> : null}
                      {error ? <span className="text-sm text-accent">{error}</span> : null}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}

      {openId === "__new__" && draft ? (
        <div className="admin-card space-y-4 border-dashed p-5">
          <p className="font-medium">New item</p>
          {renderFields(draft, setEditing)}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={save} disabled={pending} className="btn btn-primary !py-2.5 disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create</button>
            <button onClick={() => { setDraft(null); setOpenId(null); }} className="btn btn-ghost !py-2.5">Cancel</button>
            {error ? <span className="text-sm text-accent">{error}</span> : null}
          </div>
        </div>
      ) : (
        <button onClick={startNew} className="btn btn-ghost w-full justify-center border-dashed"><Plus className="h-4 w-4" /> {addLabel}</button>
      )}
    </div>
  );
}
