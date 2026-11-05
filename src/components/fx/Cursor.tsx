"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Soft cursor ring that grows over links and buttons. Desktop pointers only. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [role=button], [data-cursor]");
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? "");
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over); };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] grid place-items-center rounded-full mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="rounded-full bg-white grid place-items-center overflow-hidden"
        animate={{ width: label ? 84 : hover ? 44 : 10, height: label ? 84 : hover ? 44 : 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {label ? <span className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ink">{label}</span> : null}
      </motion.div>
    </motion.div>
  );
}
