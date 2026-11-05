"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Camera, Check, Link2, RotateCcw, Loader2 } from "lucide-react";
import type * as THREE from "three";
import type { CameraView } from "@/components/three/Scene";
import type { BuilderConfig, BuilderModelId, Settings } from "@/lib/types";
import { defaultState, estimatePrice, stateFromQuery, stateToQuery, summarize, type ArmStyle, type BuilderState, type HeadboardStyle, type LegStyle } from "@/lib/builder";
import { formatINR } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

const BuilderCanvas = dynamic(() => import("@/components/three/Scene").then((m) => m.BuilderCanvas), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center text-white/50"><Loader2 className="h-6 w-6 animate-spin" /></div>
  ),
});

const ease = [0.16, 1, 0.3, 1] as const;

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/10 py-6 first:border-t-0 first:pt-0">
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/50">{title}</p>
      {children}
    </div>
  );
}

function Pills<T extends string | number>({ options, value, onChange }: { options: { value: T; label: string; hint?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${value === o.value ? "bg-white text-ink shadow-lg" : "bg-white/10 text-white/85 hover:bg-white/20"}`}
        >
          {o.label}
          {o.hint ? <span className="ml-1.5 text-[0.7rem] opacity-60">{o.hint}</span> : null}
        </button>
      ))}
    </div>
  );
}

function Swatches({ items, value, onChange, symbol, showPrices }: { items: BuilderConfig["fabrics"]; value: string; onChange: (id: string) => void; symbol: string; showPrices: boolean }) {
  const active = items.find((i) => i.id === value);
  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {items.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            title={s.name}
            aria-label={s.name}
            className="relative h-10 w-10 rounded-full transition-transform hover:scale-110"
            style={{ background: s.hex, boxShadow: value === s.id ? "0 0 0 2px #15120f, 0 0 0 4px #fff" : "0 0 0 1px rgba(255,255,255,.2)" }}
          >
            {value === s.id ? <Check className="absolute inset-0 m-auto h-4 w-4 text-white mix-blend-difference" /> : null}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={value} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-white/80">
          {active?.name}
          {showPrices && active && active.price > 0 ? <span className="text-white/50"> · +{formatINR(active.price, symbol)}</span> : null}
          {showPrices && active && active.price === 0 ? <span className="text-white/50"> · included</span> : null}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Builder({ config, settings }: { config: BuilderConfig; settings: Settings }) {
  const params = useSearchParams();
  const [state, setState] = useState<BuilderState>(() => stateFromQuery(config, params));
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<CameraView>("angle");
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const price = useMemo(() => estimatePrice(config, state), [config, state]);
  const summary = useMemo(() => summarize(config, state), [config, state]);
  const modelName = config.models.find((m) => m.id === state.model)?.name ?? "Furniture";

  useEffect(() => {
    const url = `${window.location.pathname}?${stateToQuery(state)}`;
    window.history.replaceState(null, "", url);
  }, [state]);

  const set = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => setState((s) => ({ ...s, [key]: value }));
  const switchModel = (model: BuilderModelId) => setState((s) => ({ ...defaultState(config, model), fabric: s.fabric, wood: s.wood }));
  const onReady = useCallback((gl: THREE.WebGLRenderer) => { glRef.current = gl; }, []);

  const snapshot = () => {
    const gl = glRef.current;
    if (!gl) return;
    const a = document.createElement("a");
    a.download = `furnworld-${state.model}.png`;
    a.href = gl.domElement.toDataURL("image/png");
    a.click();
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  return (
    <div className="relative bg-ink text-white">
      <div className="grid min-h-[calc(100svh-72px)] lg:grid-cols-[1fr_26rem] xl:grid-cols-[1fr_30rem]">
        {/* Canvas */}
        <div className="relative h-[52svh] lg:sticky lg:top-[72px] lg:h-[calc(100svh-72px)]">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(255,255,255,.08),rgba(21,18,15,0)_70%)]" />
          <BuilderCanvas state={state} config={config} onReady={onReady} view={view} className="!absolute !inset-0" />
          <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-1">
            <p className="eyebrow text-white/50">3D builder</p>
            <AnimatePresence mode="wait">
              <motion.h1 key={state.model} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }} className="font-display display-soft text-[2rem] leading-none tracking-[-0.02em]">
                Your {modelName.toLowerCase()}
              </motion.h1>
            </AnimatePresence>
          </div>
          <div className="absolute right-5 top-5 flex gap-2">
            <button onClick={snapshot} title="Download image" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"><Camera className="h-4 w-4" /></button>
            <button onClick={share} title="Copy share link" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20">{copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}</button>
            <button onClick={() => switchModel(state.model)} title="Reset" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur">
            {(["angle", "front", "side", "top"] as CameraView[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.15em] transition ${view === v ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}>{v}</button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div className="border-t border-white/10 lg:border-l lg:border-t-0" data-lenis-prevent>
          <div className="px-6 py-7 md:px-8">
            <Group title="What are we building?">
              <div className="grid grid-cols-2 gap-2">
                {config.models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => switchModel(m.id)}
                    className={`rounded-2xl p-4 text-left transition-all ${state.model === m.id ? "bg-white text-ink shadow-xl" : "bg-white/5 hover:bg-white/10"}`}
                  >
                    <span className="font-display text-[1.15rem]">{m.name}</span>
                    <span className={`mt-1 block text-xs ${state.model === m.id ? "text-ink/60" : "text-white/50"}`}>{m.description}</span>
                  </button>
                ))}
              </div>
            </Group>

            {state.model === "sofa" ? (
              <>
                <Group title="Seats"><Pills options={[2, 3, 4].map((n) => ({ value: n, label: `${n} seater` }))} value={state.seats} onChange={(v) => set("seats", v)} /></Group>
                <Group title="Arms"><Pills<ArmStyle> options={[{ value: "track", label: "Track" }, { value: "rolled", label: "Rolled" }, { value: "slim", label: "Slim wood" }]} value={state.arm} onChange={(v) => set("arm", v)} /></Group>
                <Group title="Legs"><Pills<LegStyle> options={[{ value: "tapered", label: "Tapered" }, { value: "block", label: "Block" }, { value: "metal", label: "Metal" }, { value: "plinth", label: "Plinth" }]} value={state.leg} onChange={(v) => set("leg", v)} /></Group>
              </>
            ) : null}
            {state.model === "chair" ? (
              <>
                <Group title="Legs"><Pills<LegStyle> options={[{ value: "tapered", label: "Tapered" }, { value: "block", label: "Block" }, { value: "metal", label: "Metal" }]} value={state.leg} onChange={(v) => set("leg", v)} /></Group>
                <Group title="Ottoman"><Pills options={[{ value: "yes", label: "With ottoman" }, { value: "no", label: "Chair only" }]} value={state.ottoman ? "yes" : "no"} onChange={(v) => set("ottoman", v === "yes")} /></Group>
              </>
            ) : null}
            {state.model === "bed" ? (
              <>
                <Group title="Size"><Pills options={[{ value: "queen", label: "Queen", hint: "78 × 60 in" }, { value: "king", label: "King", hint: "78 × 72 in" }]} value={state.size} onChange={(v) => set("size", v as "queen" | "king")} /></Group>
                <Group title="Headboard"><Pills<HeadboardStyle> options={[{ value: "upholstered", label: "Upholstered" }, { value: "wood", label: "Solid wood" }, { value: "slatted", label: "Slatted" }]} value={state.headboard} onChange={(v) => set("headboard", v)} /></Group>
                <Group title="Storage"><Pills options={[{ value: "yes", label: "Hydraulic storage" }, { value: "no", label: "Open base" }]} value={state.storage ? "yes" : "no"} onChange={(v) => set("storage", v === "yes")} /></Group>
              </>
            ) : null}
            {state.model === "dining" ? (
              <>
                <Group title="Shape"><Pills options={[{ value: "rect", label: "Rectangular" }, { value: "round", label: "Round" }]} value={state.shape} onChange={(v) => set("shape", v as "rect" | "round")} /></Group>
                <Group title="Seats"><Pills options={[4, 6, 8].map((n) => ({ value: n, label: `${n} seats` }))} value={state.seats} onChange={(v) => set("seats", v)} /></Group>
                <Group title="Legs"><Pills<LegStyle> options={[{ value: "tapered", label: "Tapered" }, { value: "block", label: "Block" }, { value: "plinth", label: "Pedestal" }]} value={state.leg} onChange={(v) => set("leg", v)} /></Group>
              </>
            ) : null}

            <Group title={state.model === "dining" ? "Seat fabric" : "Fabric"}>
              <Swatches items={config.fabrics} value={state.fabric} onChange={(v) => set("fabric", v)} symbol={settings.currencySymbol} showPrices={settings.showPrices} />
            </Group>
            <Group title="Wood finish">
              <Swatches items={config.woods} value={state.wood} onChange={(v) => set("wood", v)} symbol={settings.currencySymbol} showPrices={settings.showPrices} />
            </Group>
          </div>

          <div className="sticky bottom-0 border-t border-white/10 bg-ink/90 px-6 py-5 backdrop-blur md:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/50">{settings.showPrices ? "Estimated price" : "Your specification"}</p>
                {settings.showPrices ? (
                  <AnimatePresence mode="popLayout">
                    <motion.p key={price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="font-display text-[2rem] leading-none tracking-[-0.02em]">
                      {formatINR(price, settings.currencySymbol)}
                    </motion.p>
                  </AnimatePresence>
                ) : (
                  <p className="font-display text-[1.4rem] leading-none">{modelName}</p>
                )}
                <p className="mt-1 text-xs text-white/50">Ready in about {config.leadTimeWeeks} weeks · final quote after site visit</p>
              </div>
              <button onClick={() => setOpen(true)} className="btn btn-accent">Send to workshop <ArrowUpRight className="arrow h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Your ${modelName.toLowerCase()}`}>
        <div className="text-ink">
          <ul className="mb-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {Object.entries(summary).map(([k, v]) => <li key={k}><span className="text-muted">{k}:</span> <span className="font-medium capitalize">{v}</span></li>)}
            {settings.showPrices ? <li><span className="text-muted">Estimate:</span> <span className="font-medium">{formatINR(price, settings.currencySymbol)}</span></li> : null}
          </ul>
          <EnquiryForm product={`Custom ${modelName}`} config={{ ...summary, ...(settings.showPrices ? { Estimate: formatINR(price, settings.currencySymbol) } : {}), Link: typeof window !== "undefined" ? window.location.href : "" }} whatsapp={settings.whatsapp} siteName={settings.siteName} />
        </div>
      </Modal>
    </div>
  );
}
