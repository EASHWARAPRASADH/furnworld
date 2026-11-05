"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CareContent, Faq } from "@/lib/types";
import { deleteFaqAction, reorderAction, saveCareAction, saveFaqAction } from "@/lib/actions";
import { CrudList } from "./CrudList";
import { Area, Field, SaveBar, Text } from "./fields";
import { useSave } from "./useSave";

export function FaqEditor({ items }: { items: Faq[] }) {
  return (
    <CrudList<Faq>
      items={items}
      blank={() => ({ id: "", question: "", answer: "" })}
      title={(f) => f.question}
      subtitle={(f) => f.answer.slice(0, 90)}
      onSave={saveFaqAction}
      onDelete={deleteFaqAction}
      onReorder={(ids) => reorderAction("faqs", ids)}
      addLabel="Add question"
      renderFields={(f, set) => (
        <>
          <Field label="Question"><Text value={f.question} onChange={(v) => set({ question: v })} /></Field>
          <Field label="Answer"><Area rows={4} value={f.answer} onChange={(v) => set({ answer: v })} /></Field>
        </>
      )}
    />
  );
}

export function CareEditor({ initial }: { initial: CareContent }) {
  const [c, setC] = useState(initial);
  const { pending, message, error, run } = useSave();
  const upd = (i: number, patch: Partial<CareContent["sections"][number]>) => setC({ ...c, sections: c.sections.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  return (
    <div className="space-y-5">
      <div className="admin-card space-y-4 p-5">
        <Field label="Page title"><Text value={c.title} onChange={(v) => setC({ ...c, title: v })} /></Field>
        <Field label="Intro"><Area rows={3} value={c.intro} onChange={(v) => setC({ ...c, intro: v })} /></Field>
      </div>
      <div className="space-y-3">
        {c.sections.map((s, i) => (
          <div key={s.id || i} className="admin-card flex gap-3 p-4">
            <div className="flex-1 space-y-3">
              <Field label="Section title"><Text value={s.title} onChange={(v) => upd(i, { title: v })} /></Field>
              <Field label="Text"><Area rows={3} value={s.text} onChange={(v) => upd(i, { text: v })} /></Field>
            </div>
            <button onClick={() => setC({ ...c, sections: c.sections.filter((_, k) => k !== i) })} className="self-start text-muted hover:text-accent"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <button onClick={() => setC({ ...c, sections: [...c.sections, { id: "", title: "", text: "" }] })} className="btn btn-ghost !py-2 text-xs"><Plus className="h-4 w-4" /> Add section</button>
      </div>
      <SaveBar pending={pending} message={message} error={error} onSave={() => run(() => saveCareAction(c))} />
    </div>
  );
}
