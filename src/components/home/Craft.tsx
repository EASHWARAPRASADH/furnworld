"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "motion/react";
import type { AboutContent } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const [n, setN] = useState(0);
  const target = match ? Number(match[2].replace(/,/g, "")) : 0;
  const isYear = !!match && !match[2].includes(",") && target >= 1800 && target <= 2100;
  useEffect(() => {
    if (!inView || !match || isYear) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, match, isYear]);
  if (!match || isYear) return <span ref={ref}>{value}</span>;
  const formatted = match[2].includes(",") ? n.toLocaleString("en-IN") : String(n);
  return <span ref={ref}>{match[1]}{formatted}{match[3]}</span>;
}

export function Craft({ about }: { about: AboutContent }) {
  return (
    <section className="container-x py-24">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="How we work" title="From our workshop floor to your living room" text={about.intro} />
          <div className="mt-10 grid grid-cols-2 gap-6">
            {about.stats.map((s) => (
              <Reveal key={s.id}>
                <p className="font-display text-[2.6rem] leading-none tracking-[-0.03em]"><CountUp value={s.value} /></p>
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.8rem]">
            {about.heroImage ? <Image src={about.heroImage} alt="" fill sizes="(max-width:1024px) 92vw, 55vw" className="object-cover" /> : null}
          </div>
          <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {about.process.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} as="li">
                <motion.div className="flex gap-5">
                  <span className="font-display text-[1.6rem] leading-none text-accent">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-[1.3rem]">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
