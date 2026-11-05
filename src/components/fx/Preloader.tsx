"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/** First-visit intro: wordmark letters rise, counter runs, curtain lifts. */
export function Preloader({ name }: { name: string }) {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("fw-intro") === "1"; } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
    document.documentElement.classList.add("lenis-stopped");
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setShow(false); try { sessionStorage.setItem("fw-intro", "1"); } catch {} }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => { if (!show) document.documentElement.classList.remove("lenis-stopped"); }, [show]);

  const letters = name.split("");
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-white"
          exit={{ y: "-100%", transition: { duration: 0.9, ease } }}
        >
          <div className="flex overflow-hidden font-display display-soft text-[clamp(3rem,10vw,8rem)] leading-none tracking-[-0.03em]">
            {letters.map((l, i) => (
              <motion.span key={i} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i }} className="inline-block">
                {l === " " ? " " : l}
              </motion.span>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-[0.72rem] uppercase tracking-[0.3em] text-white/50">
            for furniture · since 1999
          </motion.p>
          <div className="absolute bottom-8 left-[clamp(1rem,4vw,3.5rem)] right-[clamp(1rem,4vw,3.5rem)] flex items-end justify-between">
            <span className="font-display text-[2.5rem] leading-none tabular-nums">{count}</span>
            <span className="h-px flex-1 mx-6 bg-white/15 overflow-hidden"><span className="block h-full bg-white origin-left" style={{ transform: `scaleX(${count / 100})` }} /></span>
            <span className="text-[0.7rem] uppercase tracking-[0.25em] text-white/50">Loading</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
