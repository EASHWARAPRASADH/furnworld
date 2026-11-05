"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { BuilderConfig } from "@/lib/types";
import { defaultState, type BuilderState } from "@/lib/builder";

const HeroCanvas = dynamic(() => import("./Scene").then((m) => m.HeroCanvas), { ssr: false });

/** Hero model: a sofa that slowly cycles through the admin-defined fabrics. */
export function HeroScene({ config, cycleMs = 5200 }: { config: BuilderConfig; cycleMs?: number }) {
  const [state, setState] = useState<BuilderState>(() => defaultState(config, "sofa"));
  useEffect(() => {
    if (config.fabrics.length < 2) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % config.fabrics.length;
      const w = config.woods[i % config.woods.length];
      setState((s) => ({ ...s, fabric: config.fabrics[i].id, wood: w?.id ?? s.wood }));
    }, cycleMs);
    return () => clearInterval(id);
  }, [config, cycleMs]);
  return <HeroCanvas state={state} config={config} className="!h-full !w-full" />;
}
