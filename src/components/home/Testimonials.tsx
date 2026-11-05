"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  if (items.length === 0) return null;
  const t = items[i];
  const go = (d: number) => { setDir(d); setI((x) => (x + d + items.length) % items.length); };

  return (
    <section className="bg-paper-2/60 py-24">
      <div className="container-x">
        <Reveal><p className="eyebrow text-center">What our customers say</p></Reveal>
        <div className="relative mx-auto mt-8 max-w-4xl overflow-hidden text-center min-h-[16rem]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-center gap-1 text-brass">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className={`h-4 w-4 ${k < t.rating ? "fill-current" : "opacity-25"}`} />)}
              </div>
              <p className="font-display display-soft mt-6 text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.2] tracking-[-0.01em] text-balance">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer className="mt-7 text-sm">
                <span className="font-semibold">{t.name}</span>
                {t.location ? <span className="text-muted"> · {t.location}</span> : null}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        {items.length > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button onClick={() => go(-1)} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-white"><ArrowLeft className="h-4 w-4" /></button>
            <span className="text-xs tabular-nums text-muted">{i + 1} / {items.length}</span>
            <button onClick={() => go(1)} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-white"><ArrowRight className="h-4 w-4" /></button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
