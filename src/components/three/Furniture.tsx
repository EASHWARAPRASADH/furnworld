"use client";

import { RoundedBox } from "@react-three/drei";
import type { ArmStyle, HeadboardStyle, LegStyle, DiningShape } from "@/lib/builder";
import { FabricMaterial, MattressMaterial, MetalMaterial, WoodMaterial, lighten } from "./materials";

/* ------------------------------------------------------------------ */
/* Shared parts                                                        */
/* ------------------------------------------------------------------ */

function Leg({ style, wood, height = 0.16, position }: { style: LegStyle; wood: string; height?: number; position: [number, number, number] }) {
  if (style === "metal") {
    return (
      <mesh position={[position[0], height / 2, position[2]]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, height, 12]} />
        <MetalMaterial />
      </mesh>
    );
  }
  if (style === "block") {
    return (
      <mesh position={[position[0], height / 2, position[2]]} castShadow>
        <boxGeometry args={[0.07, height, 0.07]} />
        <WoodMaterial color={wood} />
      </mesh>
    );
  }
  // tapered (default)
  return (
    <mesh position={[position[0], height / 2, position[2]]} castShadow>
      <cylinderGeometry args={[0.03, 0.045, height, 16]} />
      <WoodMaterial color={wood} />
    </mesh>
  );
}

function Legs({ style, wood, w, d, height = 0.16, inset = 0.08 }: { style: LegStyle; wood: string; w: number; d: number; height?: number; inset?: number }) {
  if (style === "plinth") {
    return (
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.1, height, d - 0.12]} />
        <WoodMaterial color={wood} />
      </mesh>
    );
  }
  const x = w / 2 - inset;
  const z = d / 2 - inset;
  return (
    <group>
      <Leg style={style} wood={wood} height={height} position={[-x, 0, -z]} />
      <Leg style={style} wood={wood} height={height} position={[x, 0, -z]} />
      <Leg style={style} wood={wood} height={height} position={[-x, 0, z]} />
      <Leg style={style} wood={wood} height={height} position={[x, 0, z]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Sofa                                                                */
/* ------------------------------------------------------------------ */

export interface SofaProps { seats: number; arm: ArmStyle; leg: LegStyle; fabric: string; wood: string }

export function Sofa({ seats, arm, leg, fabric, wood }: SofaProps) {
  const seatW = 0.72;
  const armW = arm === "slim" ? 0.1 : arm === "rolled" ? 0.24 : 0.2;
  const depth = 0.95;
  const legH = leg === "plinth" ? 0.1 : 0.16;
  const baseH = 0.26;
  const innerW = seatW * seats;
  const totalW = innerW + armW * 2;
  const baseY = legH + baseH / 2;
  const seatTop = legH + baseH;
  const cushionH = 0.15;
  const backH = 0.55;
  const backT = 0.2;
  const cushionFabric = lighten(fabric, 0.04);

  return (
    <group position={[0, 0, 0]}>
      <Legs style={leg} wood={wood} w={totalW} d={depth} height={legH} />
      {/* base */}
      <RoundedBox args={[totalW, baseH, depth]} radius={0.04} smoothness={4} position={[0, baseY, 0]} castShadow receiveShadow>
        <FabricMaterial color={fabric} />
      </RoundedBox>
      {/* back */}
      <group position={[0, seatTop + backH / 2 - 0.02, -depth / 2 + backT / 2]} rotation={[-0.1, 0, 0]}>
        <RoundedBox args={[innerW, backH, backT]} radius={0.05} smoothness={4} castShadow receiveShadow>
          <FabricMaterial color={fabric} />
        </RoundedBox>
      </group>
      {/* seat cushions */}
      {Array.from({ length: seats }).map((_, i) => {
        const x = -innerW / 2 + seatW / 2 + i * seatW;
        return (
          <group key={`seat-${i}`}>
            <RoundedBox args={[seatW - 0.03, cushionH, depth - backT - 0.08]} radius={0.055} smoothness={5} position={[x, seatTop + cushionH / 2, backT / 2 + 0.02]} castShadow receiveShadow>
              <FabricMaterial color={cushionFabric} />
            </RoundedBox>
            <group position={[x, seatTop + cushionH + 0.19, -depth / 2 + backT + 0.1]} rotation={[-0.18, 0, 0]}>
              <RoundedBox args={[seatW - 0.05, 0.4, 0.14]} radius={0.055} smoothness={5} castShadow receiveShadow>
                <FabricMaterial color={cushionFabric} />
              </RoundedBox>
            </group>
          </group>
        );
      })}
      {/* arms */}
      {[-1, 1].map((side) => {
        const x = side * (innerW / 2 + armW / 2);
        if (arm === "rolled") {
          return (
            <group key={side}>
              <RoundedBox args={[armW, 0.32, depth]} radius={0.04} smoothness={4} position={[x, seatTop + 0.16 - 0.02, 0]} castShadow receiveShadow>
                <FabricMaterial color={fabric} />
              </RoundedBox>
              <mesh position={[x, seatTop + 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[armW / 2, armW / 2, depth - 0.02, 24]} />
                <FabricMaterial color={fabric} />
              </mesh>
            </group>
          );
        }
        const armH = arm === "slim" ? 0.3 : 0.38;
        return (
          <RoundedBox key={side} args={[armW, armH, depth]} radius={0.035} smoothness={4} position={[x, seatTop + armH / 2 - 0.02, 0]} castShadow receiveShadow>
            {arm === "slim" ? <WoodMaterial color={wood} /> : <FabricMaterial color={fabric} />}
          </RoundedBox>
        );
      })}
      {/* throw pillow accent */}
      <group position={[innerW / 2 - 0.3, seatTop + cushionH + 0.2, -depth / 2 + backT + 0.26]} rotation={[-0.2, 0.3, 0.1]}>
        <RoundedBox args={[0.34, 0.34, 0.1]} radius={0.05} smoothness={5} castShadow>
          <FabricMaterial color={lighten(wood, 0.25)} />
        </RoundedBox>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Lounge chair                                                        */
/* ------------------------------------------------------------------ */

export interface ChairProps { fabric: string; wood: string; leg: LegStyle; ottoman: boolean }

export function LoungeChair({ fabric, wood, leg, ottoman }: ChairProps) {
  const w = 0.8;
  const d = 0.85;
  const legH = 0.2;
  const seatH = 0.2;
  const seatTop = legH + seatH;
  return (
    <group>
      <group position={[0, 0, 0.1]}>
        <Legs style={leg === "plinth" ? "tapered" : leg} wood={wood} w={w} d={d} height={legH} inset={0.1} />
        <RoundedBox args={[w, seatH, d]} radius={0.06} smoothness={5} position={[0, legH + seatH / 2, 0]} castShadow receiveShadow>
          <FabricMaterial color={fabric} />
        </RoundedBox>
        {/* back shell */}
        <group position={[0, seatTop + 0.3, -d / 2 + 0.1]} rotation={[-0.32, 0, 0]}>
          <RoundedBox args={[w, 0.68, 0.16]} radius={0.07} smoothness={5} castShadow receiveShadow>
            <FabricMaterial color={fabric} />
          </RoundedBox>
        </group>
        {/* arms in wood */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <RoundedBox args={[0.06, 0.05, d - 0.1]} radius={0.02} position={[s * (w / 2 + 0.03), seatTop + 0.2, -0.02]} castShadow>
              <WoodMaterial color={wood} />
            </RoundedBox>
            <mesh position={[s * (w / 2 + 0.03), seatTop + 0.1, d / 2 - 0.12]} castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.2, 10]} />
              <WoodMaterial color={wood} />
            </mesh>
          </group>
        ))}
        {/* head cushion */}
        <group position={[0, seatTop + 0.55, -d / 2 + 0.24]} rotation={[-0.32, 0, 0]}>
          <RoundedBox args={[w - 0.2, 0.2, 0.08]} radius={0.035} castShadow>
            <FabricMaterial color={lighten(fabric, 0.08)} />
          </RoundedBox>
        </group>
      </group>
      {ottoman ? (
        <group position={[0, 0, 0.95]}>
          <Legs style={leg === "plinth" ? "tapered" : leg} wood={wood} w={0.62} d={0.5} height={legH} inset={0.08} />
          <RoundedBox args={[0.62, 0.16, 0.5]} radius={0.05} smoothness={5} position={[0, legH + 0.08, 0]} castShadow receiveShadow>
            <FabricMaterial color={fabric} />
          </RoundedBox>
        </group>
      ) : null}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Bed                                                                 */
/* ------------------------------------------------------------------ */

export interface BedProps { size: "queen" | "king"; headboard: HeadboardStyle; storage: boolean; fabric: string; wood: string }

export function Bed({ size, headboard, storage, fabric, wood }: BedProps) {
  const w = size === "king" ? 1.9 : 1.6;
  const l = 2.05;
  const baseH = storage ? 0.34 : 0.22;
  const legH = storage ? 0.06 : 0.14;
  const baseTop = legH + baseH;
  const hbH = 1.05;
  return (
    <group position={[0, 0, 0]}>
      {storage ? (
        <mesh position={[0, legH / 2, 0]} receiveShadow>
          <boxGeometry args={[w - 0.1, legH, l - 0.1]} />
          <WoodMaterial color={lighten(wood, -0.1)} />
        </mesh>
      ) : (
        <Legs style="tapered" wood={wood} w={w} d={l} height={legH} inset={0.1} />
      )}
      <RoundedBox args={[w, baseH, l]} radius={0.02} smoothness={3} position={[0, legH + baseH / 2, 0]} castShadow receiveShadow>
        <WoodMaterial color={wood} />
      </RoundedBox>
      {storage ? (
        <>
          {[-0.5, 0.5].map((z) => (
            <mesh key={z} position={[w / 2 + 0.002, legH + baseH / 2, z]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[l / 2 - 0.08, baseH - 0.06]} />
              <meshStandardMaterial color={lighten(wood, 0.08)} roughness={0.5} />
            </mesh>
          ))}
          {[-0.5, 0.5].map((z) => (
            <mesh key={`h${z}`} position={[w / 2 + 0.012, legH + baseH / 2, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.18, 8]} />
              <MetalMaterial color="#c8a95d" />
            </mesh>
          ))}
        </>
      ) : null}
      {/* mattress */}
      <RoundedBox args={[w - 0.08, 0.2, l - 0.12]} radius={0.05} smoothness={5} position={[0, baseTop + 0.1, 0.02]} castShadow receiveShadow>
        <MattressMaterial />
      </RoundedBox>
      {/* duvet */}
      <RoundedBox args={[w - 0.04, 0.09, l * 0.62]} radius={0.04} smoothness={5} position={[0, baseTop + 0.24, 0.3]} castShadow receiveShadow>
        <FabricMaterial color={fabric} />
      </RoundedBox>
      {/* pillows */}
      {(size === "king" ? [-0.42, 0.42] : [-0.36, 0.36]).map((x) => (
        <RoundedBox key={x} args={[0.62, 0.14, 0.42]} radius={0.06} smoothness={5} position={[x, baseTop + 0.27, -l / 2 + 0.36]} rotation={[0.25, 0, 0]} castShadow>
          <MattressMaterial />
        </RoundedBox>
      ))}
      {/* headboard */}
      <group position={[0, hbH / 2, -l / 2 - 0.06]}>
        {headboard === "upholstered" ? (
          <RoundedBox args={[w + 0.1, hbH, 0.12]} radius={0.05} smoothness={5} castShadow receiveShadow>
            <FabricMaterial color={fabric} />
          </RoundedBox>
        ) : headboard === "wood" ? (
          <RoundedBox args={[w + 0.1, hbH, 0.08]} radius={0.02} smoothness={3} castShadow receiveShadow>
            <WoodMaterial color={wood} />
          </RoundedBox>
        ) : (
          <group>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * (w / 2 + 0.02), 0, 0]} castShadow>
                <boxGeometry args={[0.07, hbH, 0.07]} />
                <WoodMaterial color={wood} />
              </mesh>
            ))}
            {[0.15, 0.3, 0.45].map((y) => (
              <mesh key={y} position={[0, y, 0]} castShadow>
                <boxGeometry args={[w, 0.09, 0.04]} />
                <WoodMaterial color={wood} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Dining                                                              */
/* ------------------------------------------------------------------ */

export interface DiningProps { shape: DiningShape; seats: number; leg: LegStyle; wood: string; fabric: string }

function DiningChair({ wood, fabric, position, rotation }: { wood: string; fabric: string; position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Legs style="tapered" wood={wood} w={0.42} d={0.42} height={0.42} inset={0.05} />
      <RoundedBox args={[0.42, 0.05, 0.42]} radius={0.015} position={[0, 0.445, 0]} castShadow receiveShadow>
        <WoodMaterial color={wood} />
      </RoundedBox>
      <RoundedBox args={[0.38, 0.05, 0.38]} radius={0.02} position={[0, 0.495, 0]} castShadow>
        <FabricMaterial color={fabric} />
      </RoundedBox>
      <group position={[0, 0.72, -0.18]} rotation={[-0.12, 0, 0]}>
        <RoundedBox args={[0.4, 0.45, 0.035]} radius={0.015} castShadow>
          <WoodMaterial color={wood} />
        </RoundedBox>
      </group>
    </group>
  );
}

export function DiningTable({ shape, seats, leg, wood, fabric }: DiningProps) {
  const h = 0.75;
  const topT = 0.045;
  const chairs: { pos: [number, number, number]; rot: number }[] = [];
  if (shape === "round") {
    const r = seats <= 4 ? 0.6 : seats <= 6 ? 0.72 : 0.85;
    for (let i = 0; i < seats; i++) {
      const a = (i / seats) * Math.PI * 2;
      chairs.push({ pos: [Math.sin(a) * (r + 0.38), 0, Math.cos(a) * (r + 0.38)], rot: a + Math.PI });
    }
    return (
      <group>
        <mesh position={[0, h - topT / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[r, r, topT, 64]} />
          <WoodMaterial color={wood} />
        </mesh>
        {leg === "plinth" ? (
          <>
            <mesh position={[0, (h - topT) / 2, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.14, h - topT, 24]} />
              <WoodMaterial color={wood} />
            </mesh>
            <mesh position={[0, 0.03, 0]} receiveShadow>
              <cylinderGeometry args={[r * 0.55, r * 0.6, 0.06, 48]} />
              <WoodMaterial color={wood} />
            </mesh>
          </>
        ) : (
          <Legs style={leg} wood={wood} w={r * 1.4} d={r * 1.4} height={h - topT} inset={0.06} />
        )}
        {chairs.map((c, i) => <DiningChair key={i} wood={wood} fabric={fabric} position={c.pos} rotation={c.rot} />)}
      </group>
    );
  }
  const perSide = Math.ceil((seats - 2) / 2);
  const len = Math.max(1.3, perSide * 0.62 + 0.4);
  const wid = 0.9;
  for (let i = 0; i < perSide; i++) {
    const x = -len / 2 + 0.2 + 0.31 + i * ((len - 0.4) / perSide) + ((len - 0.4) / perSide - 0.62) / 2;
    chairs.push({ pos: [x, 0, wid / 2 + 0.35], rot: Math.PI });
    chairs.push({ pos: [x, 0, -wid / 2 - 0.35], rot: 0 });
  }
  chairs.push({ pos: [len / 2 + 0.35, 0, 0], rot: -Math.PI / 2 });
  chairs.push({ pos: [-len / 2 - 0.35, 0, 0], rot: Math.PI / 2 });
  return (
    <group>
      <RoundedBox args={[len, topT, wid]} radius={0.015} smoothness={3} position={[0, h - topT / 2, 0]} castShadow receiveShadow>
        <WoodMaterial color={wood} />
      </RoundedBox>
      {leg === "plinth" ? (
        [-1, 1].map((s) => (
          <mesh key={s} position={[s * (len / 2 - 0.3), (h - topT) / 2, 0]} castShadow>
            <boxGeometry args={[0.08, h - topT, wid - 0.3]} />
            <WoodMaterial color={wood} />
          </mesh>
        ))
      ) : (
        <Legs style={leg} wood={wood} w={len} d={wid} height={h - topT} inset={0.08} />
      )}
      {chairs.slice(0, seats).map((c, i) => <DiningChair key={i} wood={wood} fabric={fabric} position={c.pos} rotation={c.rot} />)}
    </group>
  );
}
