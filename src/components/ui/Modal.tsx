"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.classList.remove("lenis-stopped"); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
          <motion.div
            data-lenis-prevent
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[1.6rem] bg-white p-6 sm:max-w-xl sm:rounded-[1.6rem] sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between">
              {title ? <h2 className="font-display text-[1.6rem] tracking-[-0.01em]">{title}</h2> : <span />}
              <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-paper hover:bg-paper-2"><X className="h-4 w-4" /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
