"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const src = images[i];
  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-white ring-1 ring-line/60">
        <AnimatePresence mode="wait">
          <motion.div key={src} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
            {src ? <Image src={src} alt={alt} fill priority sizes="(max-width:1024px) 92vw, 55vw" className="object-cover" /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-none">
          {images.map((img, k) => (
            <button key={img + k} onClick={() => setI(k)} className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition ${k === i ? "ring-ink" : "ring-transparent hover:ring-line"}`}>
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
