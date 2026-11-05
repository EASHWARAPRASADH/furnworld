"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import type { BuilderConfig } from "@/lib/types";
import { defaultState, estimatePrice, type BuilderState } from "@/lib/builder";
import { Reveal, SplitWords } from "@/components/ui/Reveal";
import { formatINR } from "@/lib/format";

const HeroCanvas = dynamic(() => import("@/components/three/Scene").then((m) => m.HeroCanvas), { ssr: false });

export function BuilderTeaser({ config, showPrices, symbol }: { config: BuilderConfig; showPrices: boolean; symbol: string }) {
  const [state, setState] = useState<BuilderState>(() => ({ ...defaultState(config, "sofa"), seats: 3 }));
  const price = estimatePrice(config, state);

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-accent/20 blur-[140px]" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative order-2 aspect-[4/3] w-full lg:order-1">
          <HeroCanvas state={state} config={config} className="!h-full !w-full" />
          <motion.div
            key={price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
          >
            {showPrices ? <>Estimate <span className="font-semibold">{formatINR(price, symbol)}</span></> : "Live preview"}
          </motion.div>
        </div>
        <div className="order-1 lg:order-2">
          <Reveal><p className="eyebrow text-white/50">The 3D builder</p></Reveal>
          <SplitWords as="h2" text="Design it yourself. We'll build it." className="font-display display-soft mt-4 text-[clamp(2.4rem,5vw,4.6rem)] leading-[1] tracking-[-0.02em]" />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-lg text-white/70 leading-relaxed">
              Choose seats, arms, legs, fabric and wood. Spin it around, watch the price update, then send the exact
              specification to our workshop with one tap.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-8">
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.2em] text-white/50">Try a fabric</p>
              <div className="flex flex-wrap gap-2.5">
                {config.fabrics.slice(0, 8).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setState((s) => ({ ...s, fabric: f.id }))}
                    title={f.name}
                    aria-label={f.name}
                    className="relative h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-ink transition-transform hover:scale-110"
                    style={{ background: f.hex, boxShadow: state.fabric === f.id ? "0 0 0 2px #fff" : "0 0 0 2px transparent" }}
                  >
                    {state.fabric === f.id ? <Check className="absolute inset-0 m-auto h-4 w-4 text-white mix-blend-difference" /> : null}
                  </button>
                ))}
              </div>
              <p className="mb-3 mt-6 text-[0.72rem] uppercase tracking-[0.2em] text-white/50">Seats</p>
              <div className="flex gap-2">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setState((s) => ({ ...s, seats: n }))}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${state.seats === n ? "bg-white text-ink" : "bg-white/10 text-white hover:bg-white/20"}`}
                  >
                    {n} seater
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <Link href="/builder" className="btn btn-light mt-10">Open the full builder <ArrowUpRight className="arrow h-4 w-4" /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
