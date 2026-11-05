"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";

/** Image that reveals with a clip-path wipe and drifts slowly as you scroll. */
export function ParallaxImage({ src, alt = "", className = "", sizes = "100vw", priority = false, speed = 10, direction = "up" }: { src: string; alt?: string; className?: string; sizes?: string; priority?: boolean; speed?: number; direction?: "up" | "left" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);
  const clip = direction === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: clip }}
      animate={inView ? { clipPath: "inset(0 0 0 0)" } : undefined}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div style={{ y }} className="absolute inset-[-12%_0]">
        <motion.div initial={{ scale: 1.25 }} animate={inView ? { scale: 1 } : undefined} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
