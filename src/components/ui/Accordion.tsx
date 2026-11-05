"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

export function Accordion({ items }: { items: { id: string; title: string; body: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id}>
            <button onClick={() => setOpen(isOpen ? null : it.id)} className="flex w-full items-center gap-6 py-6 text-left" aria-expanded={isOpen}>
              <span className="font-display text-[1rem] text-accent w-8 shrink-0">0{i + 1}</span>
              <span className="font-display flex-1 text-[clamp(1.15rem,2vw,1.6rem)] leading-tight tracking-[-0.01em]">{it.title}</span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line"><Plus className="h-4 w-4" /></motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                  <p className="pb-7 pl-14 pr-16 text-[1.02rem] leading-relaxed text-muted max-w-3xl">{it.body}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
