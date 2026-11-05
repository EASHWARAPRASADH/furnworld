import type { BuilderConfig, BuilderModelId } from "./types";

export type ArmStyle = "track" | "rolled" | "slim";
export type LegStyle = "tapered" | "block" | "metal" | "plinth";
export type HeadboardStyle = "upholstered" | "wood" | "slatted";
export type DiningShape = "round" | "rect";

export interface BuilderState {
  model: BuilderModelId;
  fabric: string; // swatch id
  wood: string; // swatch id
  seats: number; // sofa 2-4, dining 4/6/8
  arm: ArmStyle;
  leg: LegStyle;
  ottoman: boolean;
  size: "queen" | "king";
  headboard: HeadboardStyle;
  storage: boolean;
  shape: DiningShape;
}

export const defaultState = (cfg: BuilderConfig, model: BuilderModelId = "sofa"): BuilderState => ({
  model,
  fabric: cfg.fabrics[0]?.id ?? "",
  wood: cfg.woods[0]?.id ?? "",
  seats: model === "dining" ? 6 : 3,
  arm: "track",
  leg: "tapered",
  ottoman: true,
  size: "queen",
  headboard: "upholstered",
  storage: true,
  shape: "rect",
});

export function swatchHex(cfg: BuilderConfig, kind: "fabrics" | "woods", id: string, fallback: string): string {
  return cfg[kind].find((s) => s.id === id)?.hex ?? fallback;
}

export function estimatePrice(cfg: BuilderConfig, s: BuilderState): number {
  const model = cfg.models.find((m) => m.id === s.model);
  const base = model?.basePrice ?? 0;
  const fabric = cfg.fabrics.find((f) => f.id === s.fabric)?.price ?? 0;
  const wood = cfg.woods.find((w) => w.id === s.wood)?.price ?? 0;
  let total = base + fabric + wood;
  if (s.model === "sofa") {
    total += Math.max(0, s.seats - 2) * cfg.seatPrice;
    if (s.arm === "rolled") total += 1500;
    if (s.leg === "metal") total += 800;
  }
  if (s.model === "chair") {
    if (s.ottoman) total += 3500;
  }
  if (s.model === "bed") {
    if (s.size === "king") total += 4500;
    if (s.storage) total += cfg.storagePrice;
    if (s.headboard === "upholstered") total += 2500;
  }
  if (s.model === "dining") {
    total += Math.max(0, s.seats - 4) * 2200;
    if (s.shape === "round") total += 1200;
    if (s.seats >= 8) total += cfg.extensionPrice;
  }
  return Math.round(total / 100) * 100;
}

export function summarize(cfg: BuilderConfig, s: BuilderState): Record<string, string> {
  const model = cfg.models.find((m) => m.id === s.model)?.name ?? s.model;
  const fabric = cfg.fabrics.find((f) => f.id === s.fabric)?.name ?? s.fabric;
  const wood = cfg.woods.find((w) => w.id === s.wood)?.name ?? s.wood;
  const out: Record<string, string> = { Model: model, Fabric: fabric, Wood: wood };
  if (s.model === "sofa") Object.assign(out, { Seats: String(s.seats), Arms: s.arm, Legs: s.leg });
  if (s.model === "chair") Object.assign(out, { Legs: s.leg, Ottoman: s.ottoman ? "Yes" : "No" });
  if (s.model === "bed") Object.assign(out, { Size: s.size, Headboard: s.headboard, Storage: s.storage ? "Hydraulic storage" : "No storage" });
  if (s.model === "dining") Object.assign(out, { Shape: s.shape, Seats: String(s.seats), Legs: s.leg });
  return out;
}

export function stateToQuery(s: BuilderState): string {
  const p = new URLSearchParams();
  (Object.keys(s) as (keyof BuilderState)[]).forEach((k) => p.set(k, String(s[k])));
  return p.toString();
}

export function stateFromQuery(cfg: BuilderConfig, q: URLSearchParams): BuilderState {
  const model = (["sofa", "chair", "bed", "dining"].includes(q.get("model") ?? "") ? q.get("model") : "sofa") as BuilderModelId;
  const d = defaultState(cfg, model);
  const pick = <T extends string>(key: keyof BuilderState, allowed: readonly T[], fallback: T): T => {
    const v = q.get(key);
    return (allowed as readonly string[]).includes(v ?? "") ? (v as T) : fallback;
  };
  return {
    model,
    fabric: cfg.fabrics.some((f) => f.id === q.get("fabric")) ? (q.get("fabric") as string) : d.fabric,
    wood: cfg.woods.some((w) => w.id === q.get("wood")) ? (q.get("wood") as string) : d.wood,
    seats: Number(q.get("seats")) || d.seats,
    arm: pick("arm", ["track", "rolled", "slim"] as const, d.arm),
    leg: pick("leg", ["tapered", "block", "metal", "plinth"] as const, d.leg),
    ottoman: q.get("ottoman") ? q.get("ottoman") === "true" : d.ottoman,
    size: pick("size", ["queen", "king"] as const, d.size),
    headboard: pick("headboard", ["upholstered", "wood", "slatted"] as const, d.headboard),
    storage: q.get("storage") ? q.get("storage") === "true" : d.storage,
    shape: pick("shape", ["round", "rect"] as const, d.shape),
  };
}
