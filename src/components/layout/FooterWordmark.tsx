"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        aria-hidden
        style={{ y, opacity }}
        className="pointer-events-none select-none font-display display-soft text-[22vw] leading-[0.75] tracking-[-0.05em] text-white/[0.05] whitespace-nowrap -mb-[0.1em] text-center"
      >
        {text}
      </motion.div>
    </div>
  );
}
