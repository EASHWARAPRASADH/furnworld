"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { BuilderConfig, HeroSlide, Settings } from "@/lib/types";
import { HeroScene } from "@/components/three/HeroScene";
import { Magnetic } from "@/components/ui/Magnetic";

const ease = [0.16, 1, 0.3, 1] as const;

const chips = [
  { text: "Hand upholstered", x: "8%", y: "22%" },
  { text: "Seasoned teak", x: "72%", y: "18%" },
  { text: "Made to measure", x: "64%", y: "78%" },
  { text: "Fabric of your choice", x: "12%", y: "72%" },
];

export function Hero({ slides, settings, builder }: { slides: HeroSlide[]; settings: Settings; builder: BuilderConfig }) {
  const [i, setI] = useState(0);
  const slide = slides[i] ?? slides[0];

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slide) return null;
  const words = slide.title.split(" ");

  return (
    <section className="relative -mt-[72px] min-h-[100svh] overflow-hidden bg-ink text-white">
      {/* backdrop image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id + "-bg"}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease }}
          className="absolute inset-0"
        >
          {slide.image ? <Image src={slide.image} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.28]" /> : null}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_30%,rgba(21,18,15,0)_0%,rgba(21,18,15,.75)_60%,rgba(21,18,15,1)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />

      {/* 3D */}
      <div className="absolute inset-x-0 top-[13%] h-[36%] lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:h-auto lg:w-[58%]" aria-hidden>
        <HeroScene config={builder} />
        {chips.map((c, k) => (
          <motion.span
            key={c.text}
            className="absolute hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[0.72rem] font-medium tracking-[0.08em] uppercase text-white/85 backdrop-blur lg:block"
            style={{ left: c.x, top: c.y }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ opacity: { delay: 1 + k * 0.2, duration: 0.8 }, y: { duration: 5 + k, repeat: Infinity, ease: "easeInOut", delay: k * 0.7 } }}
          >
            {c.text}
          </motion.span>
        ))}
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pb-14 pt-[52svh] lg:justify-center lg:pb-24 lg:pt-40 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.p
              key={slide.id + "-eyebrow"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease }}
              className="eyebrow text-white/60"
            >
              {slide.eyebrow}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.h1
              key={slide.id + "-title"}
              className="font-display display-soft mt-5 text-[clamp(2.9rem,7.2vw,6.6rem)] leading-[0.98] tracking-[-0.03em]"
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ staggerChildren: 0.05 }}
            >
              {words.map((w, k) => (
                <span key={k} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                  <motion.span
                    className="inline-block"
                    variants={{ hidden: { y: "110%", rotate: 4 }, show: { y: 0, rotate: 0 }, exit: { y: "-110%", opacity: 0 } }}
                    transition={{ duration: 0.9, ease }}
                  >
                    {w}
                  </motion.span>
                  {k < words.length - 1 ? " " : ""}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={slide.id + "-sub"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.25 }}
              className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/70"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.5 }} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href={slide.ctaHref || "/products"} className="btn btn-light">
                {slide.ctaText || "Explore"} <ArrowUpRight className="arrow h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/builder" className="btn btn-outline-light">Design in 3D</Link>
            </Magnetic>
          </motion.div>
        </div>

        <div className="mt-14 flex items-end justify-between gap-6 lg:absolute lg:inset-x-0 lg:bottom-10 lg:mt-0 lg:px-[clamp(1rem,4vw,3.5rem)]">
          <div className="flex items-center gap-2">
            {slides.map((s, k) => (
              <button
                key={s.id}
                onClick={() => setI(k)}
                aria-label={`Slide ${k + 1}`}
                className="group relative h-8 w-10"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-white/25" />
                <motion.span
                  className="absolute inset-x-0 top-1/2 h-px origin-left bg-white"
                  initial={false}
                  animate={{ scaleX: k === i ? 1 : 0 }}
                  transition={k === i ? { duration: 7, ease: "linear" } : { duration: 0.3 }}
                  key={`${k}-${i}`}
                />
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-10 text-[0.78rem] uppercase tracking-[0.18em] text-white/55 md:flex">
            <span>Est. {settings.foundedYear}</span>
            <span>Chennai · Karaikal</span>
            <span className="inline-flex items-center gap-2">Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
